"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/projects";

const ROW_HEIGHT = 88; // base row gap
const VISIBLE_BUFFER = 4;

type Props = {
  onHoverProject: (p: Project | null) => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

export function InfiniteCanvas({ onHoverProject, activeId, setActiveId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [offset, setOffset] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);

  // Duplicate list 3x for infinite illusion
  const duplicated = [...PROJECTS, ...PROJECTS, ...PROJECTS];
  const totalHeight = PROJECTS.length * ROW_HEIGHT;

  const updateActive = useCallback(
    (currentOffset: number) => {
      // Find index closest to viewport center (0 offset meaning centered)
      // Center is at 0, offset shifts
      const normalized = ((currentOffset % totalHeight) + totalHeight) % totalHeight;
      const approxIndex = Math.round(normalized / ROW_HEIGHT) % PROJECTS.length;
      const project = PROJECTS[approxIndex];
      if (project && project.id !== activeId) {
        // Don't set active here too aggressively, let hover dominate
      }
    },
    [activeId, totalHeight]
  );

  useEffect(() => {
    const animate = () => {
      const diff = targetRef.current - scrollRef.current;
      scrollRef.current += diff * 0.08; // smooth lerp
      if (Math.abs(diff) > 0.1) {
        setOffset(scrollRef.current);
        updateActive(scrollRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [updateActive]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current += e.deltaY * 0.8;
    };

    let startY = 0;
    let startTarget = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTarget = targetRef.current;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = startY - e.touches[0].clientY;
      targetRef.current = startTarget + delta;
    };

    let isDragging = false;
    let dragStartY = 0;
    let dragStartTarget = 0;
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartY = e.clientY;
      dragStartTarget = targetRef.current;
      el.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = dragStartY - e.clientY;
      targetRef.current = dragStartTarget + delta;
    };
    const onMouseUp = () => {
      isDragging = false;
      if (el) el.style.cursor = "grab";
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    el.style.cursor = "grab";

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Render rows within viewport + buffer
  const centerY = typeof window !== "undefined" ? window.innerHeight / 2 : 400;

  return (
    <div
      ref={containerRef}
      className="relative z-10 h-screen w-screen overflow-hidden bg-transparent"
      style={{ touchAction: "none" }}
    >
      {/* Canvas element to match original DOM structure */}
      <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div style={{ width: "100%", height: "100%" }}>
            <canvas style={{ display: "block" }} width={1} height={1} />
          </div>
        </div>
      </div>

      {/* Title rows layer */}
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-full h-full">
          {duplicated.map((project, i) => {
            // Calculate position relative to infinite scroll
            const baseIndex = i - PROJECTS.length; // center the triple around 0
            const y = baseIndex * ROW_HEIGHT - offset;

            // Only render if within viewport +/- buffer
            const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;
            if (Math.abs(y) > viewportHeight * 0.9) return null;

            const distanceFromCenter = Math.abs(y);
            const isCentered = distanceFromCenter < ROW_HEIGHT * 0.6;
            const normalizedDist = Math.min(distanceFromCenter / (viewportHeight * 0.5), 1);

            // Font size and letter-spacing mimic original proximity effect
            // Center: larger, wider; Far: smaller, tighter
            const fontSize = isCentered
              ? "clamp(20px, 4.2vw, 56px)"
              : `clamp(12px, ${2.2 + (1 - normalizedDist) * 1.2}vw, ${22 + (1 - normalizedDist) * 18}px)`;
            const letterSpacing = isCentered ? "0.02em" : `${-0.05 + (1 - normalizedDist) * 0.06}em`;
            const opacity = 1 - normalizedDist * 0.7;
            const scale = isCentered ? 1 : 0.85 + (1 - normalizedDist) * 0.1;

            return (
              <button
                key={`${project.id}-${i}`}
                aria-label={project.title}
                onMouseEnter={() => {
                  setHovered(project.id);
                  setActiveId(project.id);
                  onHoverProject(project);
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  setActiveId(null);
                  onHoverProject(null);
                }}
                onFocus={() => {
                  setHovered(project.id);
                  setActiveId(project.id);
                  onHoverProject(project);
                }}
                onBlur={() => {
                  setHovered(null);
                  onHoverProject(null);
                }}
                style={{
                  willChange: "transform, opacity, letter-spacing, font-size",
                  transition:
                    "letter-spacing 450ms cubic-bezier(0.22, 0.61, 0.36, 1), font-size 450ms cubic-bezier(0.22, 0.61, 0.36, 1), color 450ms ease",
                  transform: `translate3d(-50%, calc(-50% + ${y}px), 0) scale(${scale})`,
                  letterSpacing,
                  fontSize,
                  opacity: Math.max(0.15, opacity),
                  pointerEvents: "auto",
                }}
                className={`project-title-row absolute left-1/2 top-1/2 whitespace-nowrap font-acumin cursor-pointer select-none ${
                  isCentered || hovered === project.id ? "text-black" : "text-black/80"
                }`}
              >
                <span className="project-title-text px-4">
                  {project.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center indicator subtle */}
      <div className="pointer-events-none fixed left-0 right-0 top-1/2 z-0 h-[1px] -translate-y-1/2 bg-black/[0.04]" />
    </div>
  );
}
