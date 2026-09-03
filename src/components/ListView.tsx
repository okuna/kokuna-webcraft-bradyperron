"use client";

import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "@/lib/projects";
import { LIST_ROW_HEIGHT, VIEW_TRANSITION_SECONDS } from "@/lib/motion";
import { ProjectMedia } from "@/components/ProjectMedia";

const MOBILE_BREAKPOINT = 768;
const VELOCITY_DECAY = 0.92;
const VELOCITY_LERP = 0.28;
const MAX_VELOCITY = 1.6;
const RING_CAMERA_Z = 12;
const RING_CENTER_Z = 2.2;
const RING_WORLD_Y = -2;
const RING_FOV_DEGREES = 50;
const RING_MEDIA_WORLD_SIZE = 4;
const RING_VISIBLE_COSINE_LIMIT = 0.25;

type Viewport = { width: number; height: number };

type Props = {
  onOpenProject: (project: Project) => void;
  ready?: boolean;
};

function wrapProjectDistance(value: number) {
  const count = PROJECTS.length;
  return ((((value + count / 2) % count) + count) % count) - count / 2;
}

export function ListView({ onOpenProject, ready = true }: Props) {
  const [viewport, setViewport] = useState<Viewport>({ width: 1200, height: 800 });
  const [activeIndex, setActiveIndex] = useState(0);
  const offsetRef = useRef(0);
  const targetVelocityRef = useRef(0);
  const velocityRef = useRef(0);
  const activeIndexRef = useRef(0);
  const titleRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const ringRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();

  const updateTitleTransforms = useCallback((scrollProject: number) => {
    for (let index = 0; index < PROJECTS.length; index++) {
      const el = titleRefs.current[index];
      if (!el) continue;
      const distance = wrapProjectDistance(index - scrollProject);
      const y = distance * LIST_ROW_HEIGHT;
      const vh = viewport.height || 800;
      const opacity = Math.max(0.08, 1 - Math.min(1, Math.abs(y) / (vh * 0.45)) ** 1.4);
      el.style.transform = `translate3d(-50%, calc(-50% + ${y}px), 0)`;
      el.style.opacity = String(opacity);
      const isActive = index === activeIndexRef.current;
      if (isActive) {
        el.setAttribute("data-active", "true");
        el.tabIndex = 0;
      } else {
        el.removeAttribute("data-active");
        el.tabIndex = -1;
      }
    }
  }, [viewport.height]);

  const updateRingTransforms = useCallback((scrollProject: number, v: Viewport) => {
    const isSmall = v.width < MOBILE_BREAKPOINT;
    const ringRadius = isSmall ? 5.5 : 7.5;
    const focalLength = v.height / (2 * Math.tan((RING_FOV_DEGREES * Math.PI) / 360));
    const worldScale = focalLength / RING_CAMERA_Z;
    for (let index = 0; index < PROJECTS.length; index++) {
      const el = ringRefs.current[index];
      if (!el) continue;
      const project = PROJECTS[index];
      const distance = wrapProjectDistance(index - scrollProject);
      const angle = (distance / PROJECTS.length) * Math.PI * 2 + Math.PI;
      const cosine = Math.cos(angle);
      const depth = (cosine + 1) / 2;
      const worldX = Math.sin(angle) * ringRadius;
      const worldZ = cosine * ringRadius + RING_CENTER_Z;
      const cameraDeltaX = -worldX;
      const cameraDeltaY = RING_WORLD_Y;
      const cameraDeltaZ = RING_CAMERA_Z - worldZ;
      const yaw = Math.atan2(cameraDeltaX, cameraDeltaZ);
      const pitch = Math.atan2(-cameraDeltaY, Math.hypot(cameraDeltaX, cameraDeltaZ));
      const perspectiveScale = 0.7 + 0.55 * depth;
      const aspect = project.width / project.height;
      const worldWidth = aspect >= 1 ? RING_MEDIA_WORLD_SIZE : RING_MEDIA_WORLD_SIZE * aspect;
      const worldHeight = aspect >= 1 ? RING_MEDIA_WORLD_SIZE / aspect : RING_MEDIA_WORLD_SIZE;
      const width = worldWidth * worldScale * perspectiveScale;
      const height = worldHeight * worldScale * perspectiveScale;
      const isVisibleArc = cosine <= RING_VISIBLE_COSINE_LIMIT;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.transform = `translate3d(calc(-50% + ${worldX * worldScale}px), calc(-50% + ${-RING_WORLD_Y * worldScale}px), ${worldZ * worldScale}px) rotateY(${yaw}rad) rotateX(${pitch}rad)`;
      el.style.opacity = isVisibleArc ? "1" : "0";
      el.style.pointerEvents = isVisibleArc ? "auto" : "none";
      (el.style as unknown as Record<string, string>).visibility = isVisibleArc ? "visible" : "hidden";
      el.style.zIndex = String(Math.round(depth * 100));
    }
  }, []);

  const nudgeVelocity = useCallback((amount: number) => {
    targetVelocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, targetVelocityRef.current + amount));
  }, []);

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const handleWheel = (event: WheelEvent) => {
      if ((event.target as Element | null)?.closest("[data-modal-scroll]")) return;
      event.preventDefault();
      nudgeVelocity(event.deltaY * (viewport.width < MOBILE_BREAKPOINT ? 0.0014 : 0.0024));
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nudgeVelocity, viewport.width, reduceMotion]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const seconds = Math.min(delta, 50) / 1000;
    velocityRef.current += (targetVelocityRef.current - velocityRef.current) * VELOCITY_LERP;
    targetVelocityRef.current *= VELOCITY_DECAY;
    if (Math.abs(targetVelocityRef.current) < 0.0005) targetVelocityRef.current = 0;

    offsetRef.current -= velocityRef.current * seconds * 480;
    const cycleHeight = PROJECTS.length * LIST_ROW_HEIGHT;
    if (Math.abs(offsetRef.current) > cycleHeight * 2) {
      offsetRef.current %= cycleHeight;
    }

    const scrollProject = -offsetRef.current / LIST_ROW_HEIGHT;
    updateTitleTransforms(scrollProject);
    updateRingTransforms(scrollProject, viewport);

    const nextActive = ((Math.round(-offsetRef.current / LIST_ROW_HEIGHT) % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
    if (nextActive !== activeIndexRef.current) {
      activeIndexRef.current = nextActive;
      setActiveIndex(nextActive);
    }
  });

  const moveToIndex = useCallback((target: number) => {
    const normalized = ((target % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
    activeIndexRef.current = normalized;
    setActiveIndex(normalized);
    const newOffset = -normalized * LIST_ROW_HEIGHT;
    offsetRef.current = newOffset;
    const scrollProject = -newOffset / LIST_ROW_HEIGHT;
    updateTitleTransforms(scrollProject);
    updateRingTransforms(scrollProject, viewport);
  }, [updateTitleTransforms, updateRingTransforms, viewport]);

  const handleListKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); moveToIndex(activeIndexRef.current + 1); }
    if (e.key === "ArrowUp") { e.preventDefault(); moveToIndex(activeIndexRef.current - 1); }
  }, [moveToIndex]);

  // ponytail: static view for reduced motion with Prev/Next, no per-frame React state
  if (reduceMotion) {
    return (
      <div
        data-view="list"
        className="fixed inset-0 z-0 overflow-y-auto bg-white p-[8vw]"
        aria-label="Project list static view for reduced motion - all 17 projects with Prev/Next and arrow keys"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => (i + 1) % PROJECTS.length); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => (i - 1 + PROJECTS.length) % PROJECTS.length); }
        }}
      >
        <div className="mx-auto max-w-[800px] pt-20 pb-24">
          {PROJECTS.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project)}
              aria-label={`Open ${project.title} preview`}
              className="flex min-h-[44px] w-full items-center justify-between border-b border-black/10 py-4 text-left text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
            >
              <span className="text-sm tracking-[0.2em]">{project.title}</span>
              <span className="text-[11px] tracking-[0.2em] text-black/40">{project.year}</span>
            </button>
          ))}
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => setActiveIndex((i) => (i - 1 + PROJECTS.length) % PROJECTS.length)} className="min-h-[44px] min-w-[44px] border border-black/15 px-3 text-xs">Prev</button>
            <button type="button" onClick={() => setActiveIndex((i) => (i + 1) % PROJECTS.length)} className="min-h-[44px] min-w-[44px] border border-black/15 px-3 text-xs">Next</button>
          </div>
        </div>
      </div>
    );
  }

  const isSmall = viewport.width < MOBILE_BREAKPOINT;
  const focalLength = viewport.height / (2 * Math.tan((RING_FOV_DEGREES * Math.PI) / 360));

  return (
    <motion.section
      data-view="list"
      className="fixed inset-0 z-0 overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: VIEW_TRANSITION_SECONDS }}
      onPan={(_, info) => { nudgeVelocity(info.delta.y * -(isSmall ? 0.009 : 0.011)); }}
      aria-label="Project list. Scroll or drag to move through projects. Use arrow keys to navigate."
      tabIndex={0}
      onKeyDown={handleListKeyDown}
    >
      <div className="pointer-events-none absolute inset-0 z-[2]">
        {PROJECTS.map((project, index) => {
          const distance = wrapProjectDistance(index - activeIndex);
          const y = distance * LIST_ROW_HEIGHT;
          const vh = viewport.height || 800;
          const opacity = Math.max(0.08, 1 - Math.min(1, Math.abs(y) / (vh * 0.45)) ** 1.4);
          const isActive = index === activeIndex;
          return (
            <button
              key={project.id}
              ref={(el) => { titleRefs.current[index] = el; }}
              type="button"
              onClick={() => onOpenProject(project)}
              aria-label={`Open ${project.title} preview`}
              data-active={isActive || undefined}
              data-slug={project.slug}
              tabIndex={isActive ? 0 : -1}
              className="project-title-row pointer-events-auto absolute left-1/2 top-1/2 z-[2] whitespace-nowrap text-black min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
              style={{ transform: `translate3d(-50%, calc(-50% + ${y}px), 0)`, opacity }}
            >
              {project.title}
            </button>
          );
        })}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] [transform-style:preserve-3d]"
        style={{ perspective: `${focalLength}px`, perspectiveOrigin: "50% 50%" }}
        aria-hidden="true"
      >
        {PROJECTS.map((project, index) => (
          <button
            key={project.id}
            ref={(el) => { ringRefs.current[index] = el; }}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => onOpenProject(project)}
            className="pointer-events-auto absolute left-1/2 top-1/2 overflow-hidden bg-neutral-100"
          >
            <ProjectMedia project={project} playVideo={index === activeIndex} decorative sizes="(max-width: 767px) 40vw, 260px" className="object-cover" />
          </button>
        ))}
      </div>
    </motion.section>
  );
}
