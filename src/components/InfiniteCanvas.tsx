"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectMedia } from "@/components/ProjectMedia";
import {
  DESKTOP_ACTIVE_MEDIA,
  EASE_EXPO,
  MOBILE_ACTIVE_MEDIA,
} from "@/lib/motion";

const MOBILE_BREAKPOINT = 768;
const BASE_PROGRESS_PER_SECOND = 0.027;
const VELOCITY_DECAY = 0.92;
const VELOCITY_LERP = 0.28;
const MAX_SCROLL_VELOCITY = 1.6;
const INTRO_PROJECT_COUNT = 12;

const INTRO_POSITIONS = [
  [-0.34, -0.26, -2],
  [0.04, -0.34, 1],
  [0.29, -0.23, 0],
  [-0.18, -0.1, 2],
  [0.19, -0.06, -1],
  [-0.39, 0.08, 1],
  [-0.06, 0.11, 0],
  [0.33, 0.13, 2],
  [-0.27, 0.28, -1],
  [0.08, 0.3, 1],
  [0.38, 0.31, -2],
  [-0.02, 0.43, 0],
] as const;

type Viewport = { width: number; height: number };

type Props = {
  ready: boolean;
  introActive: boolean;
  onOpenProject: (project: Project) => void;
};

type CanvasCard = {
  projectIndex: number;
  entryProgress: number;
};

function getDistributedProgress(index: number, count: number) {
  return (index + 0.5) / count;
}

function getCardSize(project: Project, viewport: Viewport) {
  const isSmall = viewport.width < MOBILE_BREAKPOINT;
  const aspect = project.width / project.height;
  const targetHeight = Math.min(
    viewport.height * (isSmall ? 0.4 : 0.49),
    isSmall ? 340 : 460,
  );
  const maximumWidth = viewport.width * (isSmall ? 0.68 : 0.58);
  const width = Math.min(targetHeight * aspect, maximumWidth);
  return { width, height: width / aspect };
}

function getPathPosition(
  pathIndex: number,
  progress: number,
  viewport: Viewport,
  cardWidth: number,
  cardHeight: number,
) {
  const rangeX = viewport.width / 2 + cardWidth * 1.1;
  const rangeY = viewport.height / 2 + cardHeight * 1.1;
  const across = -rangeX + rangeX * 2 * progress;
  const reverseAcross = rangeX - rangeX * 2 * progress;
  const down = -rangeY + rangeY * 2 * progress;
  const up = rangeY - rangeY * 2 * progress;

  switch (pathIndex % 9) {
    case 0:
      return { x: across, y: 0 };
    case 1:
      return { x: 0, y: down };
    case 2:
      return { x: reverseAcross, y: down };
    case 3:
      return { x: across, y: up };
    case 4:
      return { x: across, y: rangeY * 0.2 };
    case 5:
      return { x: reverseAcross, y: up };
    case 6:
      return { x: reverseAcross, y: 0 };
    case 7:
      return { x: across, y: down };
    default:
      return { x: 0, y: up };
  }
}

export function InfiniteCanvas({ ready, introActive, onOpenProject }: Props) {
  const [viewport, setViewport] = useState<Viewport>({ width: 1200, height: 800 });
  const [cards, setCards] = useState<CanvasCard[]>(() =>
    Array.from({ length: DESKTOP_ACTIVE_MEDIA }, (_, index) => ({
      projectIndex: index,
      entryProgress: getDistributedProgress(index, DESKTOP_ACTIVE_MEDIA),
    })),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const cardsRef = useRef(cards);
  const progressRef = useRef(
    Array.from({ length: DESKTOP_ACTIVE_MEDIA }, (_, index) =>
      getDistributedProgress(index, DESKTOP_ACTIVE_MEDIA),
    ),
  );
  const targetVelocityRef = useRef(0);
  const velocityRef = useRef(0);
  const nextProjectRef = useRef(DESKTOP_ACTIVE_MEDIA);
  const previousActiveCountRef = useRef(DESKTOP_ACTIVE_MEDIA);
  const reduceMotion = useReducedMotion();

  const activeCount =
    viewport.width < MOBILE_BREAKPOINT ? MOBILE_ACTIVE_MEDIA : DESKTOP_ACTIVE_MEDIA;

  useEffect(() => {
    if (previousActiveCountRef.current === activeCount) return;
    previousActiveCountRef.current = activeCount;
    nextProjectRef.current = activeCount;

    const nextProgress = Array.from(
      { length: DESKTOP_ACTIVE_MEDIA },
      (_, index) =>
        index < activeCount
          ? getDistributedProgress(index, activeCount)
          : getDistributedProgress(index, DESKTOP_ACTIVE_MEDIA),
    );
    progressRef.current = nextProgress;
    setCards((current) =>
      current.map((card, index) => ({
        ...card,
        entryProgress: nextProgress[index],
      })),
    );
  }, [activeCount]);

  useEffect(() => {
    const updateViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const nudgeVelocity = useCallback((amount: number) => {
    targetVelocityRef.current = Math.max(
      -MAX_SCROLL_VELOCITY,
      Math.min(MAX_SCROLL_VELOCITY, targetVelocityRef.current + amount),
    );
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if ((event.target as Element | null)?.closest("[data-modal-scroll]")) return;
      event.preventDefault();
      nudgeVelocity(event.deltaY * 0.0024);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nudgeVelocity]);

  useAnimationFrame((_, delta) => {
    if (!ready || introActive || reduceMotion) return;
    const seconds = Math.min(delta, 50) / 1000;
    velocityRef.current +=
      (targetVelocityRef.current - velocityRef.current) * VELOCITY_LERP;
    targetVelocityRef.current *= VELOCITY_DECAY;
    if (Math.abs(targetVelocityRef.current) < 0.0005) targetVelocityRef.current = 0;

    const direction = velocityRef.current < -0.015 ? -1 : 1;
    const boost = Math.min(26, Math.abs(velocityRef.current) * 15);

    for (let slot = 0; slot < activeCount; slot += 1) {
      let progress = progressRef.current[slot] ?? 0;
      progress += BASE_PROGRESS_PER_SECOND * (1 + boost) * direction * seconds;

      if (progress >= 1) {
        progress -= 1;
        const nextIndex = nextProjectRef.current % PROJECTS.length;
        nextProjectRef.current += 1;
        setCards((current) =>
          current.map((card, index) =>
            index === slot
              ? { projectIndex: nextIndex, entryProgress: progress }
              : card,
          ),
        );
        cardsRef.current[slot] = { projectIndex: nextIndex, entryProgress: progress };
      } else if (progress < 0) {
        progress += 1;
        const previous =
          (cardsRef.current[slot].projectIndex - activeCount + PROJECTS.length) %
          PROJECTS.length;
        setCards((current) =>
          current.map((card, index) =>
            index === slot
              ? { projectIndex: previous, entryProgress: progress }
              : card,
          ),
        );
        cardsRef.current[slot] = { projectIndex: previous, entryProgress: progress };
      }

      progressRef.current[slot] = progress;
      const element = cardRefs.current[slot];
      const project = PROJECTS[cardsRef.current[slot].projectIndex];
      if (!element || !project) continue;
      const cardSize = getCardSize(project, viewport);
      const position = getPathPosition(
        cardsRef.current[slot].projectIndex,
        progress,
        viewport,
        cardSize.width,
        cardSize.height,
      );
      const rotation = Math.sin((progress + slot * 0.17) * Math.PI * 2) * 1.8;
      element.style.width = `${cardSize.width}px`;
      element.style.height = `${cardSize.height}px`;
      element.style.transform = `translate3d(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px), 0) rotate(${rotation}deg)`;
    }
  });

  const introProjects = useMemo(
    () => PROJECTS.slice(0, INTRO_PROJECT_COUNT),
    [],
  );

  return (
    <motion.div
      ref={containerRef}
      data-view="grid"
      className="canvas-surface fixed inset-0 z-0 overflow-hidden bg-white"
      onPan={(_, info) => nudgeVelocity(info.delta.y * -0.011)}
      aria-label="Moving project grid. Scroll or drag to move projects."
    >
      <AnimatePresence>
        {ready && introActive && !reduceMotion && (
          <motion.div
            key="intro"
            className="pointer-events-none fixed inset-0 overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {introProjects.map((project, index) => {
              const [xFactor, yFactor, rotation] = INTRO_POSITIONS[index];
              const size = getCardSize(project, viewport);
              return (
                <div
                  key={project.id}
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: "translate(-50%, -50%)", zIndex: index + 1 }}
                >
                  <motion.div
                    className="relative overflow-hidden bg-neutral-100"
                    style={{ width: size.width, height: size.height }}
                    initial={{ x: 0, y: 0, rotate: 0, scale: 0.02, opacity: 0 }}
                    animate={{
                      x: viewport.width * xFactor,
                      y: viewport.height * yFactor,
                      rotate: rotation,
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.22 + Math.min(0.56, index * 0.04),
                      duration: 1.15,
                      ease: EASE_EXPO,
                    }}
                  >
                    <Image
                      src={project.imageUrl}
                      alt=""
                      fill
                      unoptimized
                      loading="eager"
                      sizes="(max-width: 767px) 68vw, 58vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: ready && (!introActive || reduceMotion) ? 1 : 0 }}
        transition={{ duration: 0.45 }}
        aria-hidden={introActive && !reduceMotion}
      >
        {cards.map((card, slot) => {
          const project = PROJECTS[card.projectIndex];
          const size = getCardSize(project, viewport);
          const position = getPathPosition(
            card.projectIndex,
            card.entryProgress,
            viewport,
            size.width,
            size.height,
          );
          return (
            <button
              key={`grid-slot-${slot}-${project.id}`}
              ref={(element) => {
                cardRefs.current[slot] = element;
              }}
              type="button"
              onClick={() => onOpenProject(project)}
              aria-label={`Open ${project.title} preview`}
              className={`group absolute left-1/2 top-1/2 overflow-hidden bg-neutral-100 focus-visible:z-20 ${slot >= MOBILE_ACTIVE_MEDIA ? "hidden md:block" : ""}`}
              style={{
                width: size.width,
                height: size.height,
                transform: `translate3d(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px), 0)`,
                zIndex: slot + 1,
              }}
            >
              <motion.span
                className="relative block h-full w-full"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE_EXPO }}
                whileHover={{ scale: 1.015 }}
              >
                <ProjectMedia
                  project={project}
                  playVideo
                  eager
                  sizes="(max-width: 767px) 68vw, 58vw"
                  className="select-none object-cover"
                />
              </motion.span>
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
