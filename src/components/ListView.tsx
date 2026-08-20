"use client";

import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
};

function wrapProjectDistance(value: number) {
  const count = PROJECTS.length;
  return ((((value + count / 2) % count) + count) % count) - count / 2;
}

export function ListView({ onOpenProject }: Props) {
  const [viewport, setViewport] = useState<Viewport>({ width: 1200, height: 800 });
  const [renderOffset, setRenderOffset] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const offsetRef = useRef(0);
  const targetVelocityRef = useRef(0);
  const velocityRef = useRef(0);
  const activeIndexRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const nudgeVelocity = useCallback((amount: number) => {
    targetVelocityRef.current = Math.max(
      -MAX_VELOCITY,
      Math.min(MAX_VELOCITY, targetVelocityRef.current + amount),
    );
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if ((event.target as Element | null)?.closest("[data-modal-scroll]")) return;
      event.preventDefault();
      nudgeVelocity(event.deltaY * (viewport.width < MOBILE_BREAKPOINT ? 0.0014 : 0.0024));
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nudgeVelocity, viewport.width]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const seconds = Math.min(delta, 50) / 1000;
    velocityRef.current +=
      (targetVelocityRef.current - velocityRef.current) * VELOCITY_LERP;
    targetVelocityRef.current *= VELOCITY_DECAY;
    if (Math.abs(targetVelocityRef.current) < 0.0005) targetVelocityRef.current = 0;

    offsetRef.current -= velocityRef.current * seconds * 480;
    const cycleHeight = PROJECTS.length * LIST_ROW_HEIGHT;
    if (Math.abs(offsetRef.current) > cycleHeight * 2) {
      offsetRef.current %= cycleHeight;
    }

    setRenderOffset(offsetRef.current);
    const nextActive =
      ((Math.round(-offsetRef.current / LIST_ROW_HEIGHT) % PROJECTS.length) +
        PROJECTS.length) %
      PROJECTS.length;
    if (nextActive !== activeIndexRef.current) {
      activeIndexRef.current = nextActive;
      setActiveIndex(nextActive);
    }
  });

  const scrollProject = -renderOffset / LIST_ROW_HEIGHT;
  const isSmall = viewport.width < MOBILE_BREAKPOINT;
  const ringRadius = isSmall ? 5.5 : 7.5;
  const focalLength =
    viewport.height /
    (2 * Math.tan((RING_FOV_DEGREES * Math.PI) / 360));
  const worldScale = focalLength / RING_CAMERA_Z;

  const titleItems = useMemo(
    () =>
      PROJECTS.map((project, index) => ({
        project,
        index,
      })),
    [],
  );

  return (
    <motion.section
      data-view="list"
      className="canvas-surface fixed inset-0 z-0 overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: VIEW_TRANSITION_SECONDS }}
      onPan={(_, info) => nudgeVelocity(info.delta.y * -(isSmall ? 0.009 : 0.011))}
      aria-label="Project list. Scroll or drag to move through projects."
    >
      <div className="pointer-events-none absolute inset-0 z-[2]">
        {titleItems.map(({ project, index }) => {
          const distance = wrapProjectDistance(index - scrollProject);
          const y = distance * LIST_ROW_HEIGHT;
          const isActive = index === activeIndex;
          const opacity = Math.max(
            0.08,
            1 - Math.min(1, Math.abs(y) / (viewport.height * 0.45)) ** 1.4,
          );
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project)}
              aria-label={`Open ${project.title} preview`}
              data-active={isActive || undefined}
              className="project-title-row pointer-events-auto absolute left-1/2 top-1/2 z-[2] whitespace-nowrap text-black"
              style={{
                transform: `translate3d(-50%, calc(-50% + ${y}px), 0)`,
                opacity,
              }}
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
        {PROJECTS.map((project, index) => {
          const distance = wrapProjectDistance(index - scrollProject);
          const angle =
            (distance / PROJECTS.length) * Math.PI * 2 + Math.PI;
          const cosine = Math.cos(angle);
          const depth = (cosine + 1) / 2;
          const worldX = Math.sin(angle) * ringRadius;
          const worldZ = cosine * ringRadius + RING_CENTER_Z;
          const cameraDeltaX = -worldX;
          const cameraDeltaY = RING_WORLD_Y;
          const cameraDeltaZ = RING_CAMERA_Z - worldZ;
          const yaw = Math.atan2(cameraDeltaX, cameraDeltaZ);
          const pitch = Math.atan2(
            -cameraDeltaY,
            Math.hypot(cameraDeltaX, cameraDeltaZ),
          );
          const perspectiveScale = 0.7 + 0.55 * depth;
          const aspect = project.width / project.height;
          const worldWidth =
            aspect >= 1
              ? RING_MEDIA_WORLD_SIZE
              : RING_MEDIA_WORLD_SIZE * aspect;
          const worldHeight =
            aspect >= 1
              ? RING_MEDIA_WORLD_SIZE / aspect
              : RING_MEDIA_WORLD_SIZE;
          const width = worldWidth * worldScale * perspectiveScale;
          const height = worldHeight * worldScale * perspectiveScale;
          const isVisibleArc = cosine <= RING_VISIBLE_COSINE_LIMIT;

          return (
            <button
              key={project.id}
              type="button"
              tabIndex={-1}
              onClick={() => onOpenProject(project)}
              className="pointer-events-auto absolute left-1/2 top-1/2 overflow-hidden bg-neutral-100"
              style={{
                width,
                height,
                transform: `translate3d(calc(-50% + ${worldX * worldScale}px), calc(-50% + ${-RING_WORLD_Y * worldScale}px), ${worldZ * worldScale}px) rotateY(${yaw}rad) rotateX(${pitch}rad)`,
                transformOrigin: "50% 50%",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                opacity: isVisibleArc ? 1 : 0,
                pointerEvents: isVisibleArc ? "auto" : "none",
                visibility: isVisibleArc ? "visible" : "hidden",
                zIndex: Math.round(depth * 100),
              }}
            >
              <ProjectMedia
                project={project}
                playVideo={index === activeIndex}
                decorative
                sizes="(max-width: 767px) 40vw, 260px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
