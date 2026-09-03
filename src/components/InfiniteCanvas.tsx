"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectMedia } from "@/components/ProjectMedia";
import {
  DESKTOP_ACTIVE_MEDIA,
  EASE_EXPO_OUT,
  EASE_POWER2_IN_OUT,
  EASE_POWER3_IN,
  EASE_POWER3_OUT,
  GRID_ACTIVE_INTRO_SCALE_SECONDS,
  GRID_ACTIVE_INTRO_TRAVEL_SECONDS,
  GRID_EXTRA_INTRO_SCALE_SECONDS,
  GRID_EXTRA_INTRO_TRAVEL_SECONDS,
  GRID_INTRO_DELAY_SECONDS,
  MOBILE_ACTIVE_MEDIA,
} from "@/lib/motion";

const MOBILE_BREAKPOINT = 768;
const BASE_PROGRESS_PER_SECOND = 0.027;
const VELOCITY_DECAY = 0.92;
const VELOCITY_LERP = 0.28;
const MAX_SCROLL_VELOCITY = 1.6;
const INTRO_EXTRA_PROJECT_COUNT = 12;
const INTRO_ACTIVE_STAGGER_SECONDS = 0.052;
const INTRO_ACTIVE_STAGGER_LIMIT_SECONDS = 0.32;
const INTRO_EXTRA_STAGGER_SECONDS = 0.016;
const INTRO_EXTRA_STAGGER_LIMIT_SECONDS = 0.38;
const INTRO_RADIAL_ANGLE_RADIANS = 2.18;
const INTRO_RADIAL_DISTANCE_MULTIPLIER = 1.28;
const INTRO_START_SCALE = 0.12;
const CAMERA_DISTANCE = 12;
const PATH_REFERENCE_DISTANCE = 8;
const CAMERA_FIELD_OF_VIEW_DEGREES = 50;
const DESKTOP_CARD_SHORT_SIDE_WORLD = 5.5;
const MOBILE_CARD_SHORT_SIDE_WORLD = 3.5;

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
  const visibleWorldHeight =
    2 * Math.tan((CAMERA_FIELD_OF_VIEW_DEGREES * Math.PI) / 360) * CAMERA_DISTANCE;
  const pixelsPerWorldUnit = viewport.height / visibleWorldHeight;
  const shortSide =
    (isSmall ? MOBILE_CARD_SHORT_SIDE_WORLD : DESKTOP_CARD_SHORT_SIDE_WORLD) * pixelsPerWorldUnit;

  return aspect >= 1
    ? { width: shortSide * aspect, height: shortSide }
    : { width: shortSide, height: shortSide / aspect };
}

function getPathPosition(pathIndex: number, progress: number, viewport: Viewport, cardWidth: number, cardHeight: number) {
  const pathViewportScale = PATH_REFERENCE_DISTANCE / CAMERA_DISTANCE;
  const rangeX = viewport.width * pathViewportScale + cardWidth * 1.1;
  const rangeY = viewport.height * pathViewportScale + cardHeight * 1.1;
  const leftToRight = -rangeX + rangeX * 2 * progress;
  const rightToLeft = rangeX - rangeX * 2 * progress;
  const topToBottom = -rangeY + rangeY * 2 * progress;
  const bottomToTop = rangeY - rangeY * 2 * progress;

  switch (pathIndex % 9) {
    case 0:
      return { x: leftToRight, y: 0 };
    case 1:
      return { x: 0, y: bottomToTop };
    case 2:
      return { x: rightToLeft, y: bottomToTop };
    case 3:
      return { x: leftToRight, y: topToBottom };
    case 4:
      return { x: leftToRight, y: -rangeY * 0.2 };
    case 5:
      return { x: rightToLeft, y: topToBottom };
    case 6:
      return { x: rightToLeft, y: 0 };
    case 7:
      return { x: leftToRight, y: bottomToTop };
    default:
      return { x: 0, y: topToBottom };
  }
}

function getIntroExtraIndexes(activeCount: number) {
  const remaining = PROJECTS.length - activeCount;
  const count = Math.min(INTRO_EXTRA_PROJECT_COUNT, remaining);
  if (count <= 0) return [];

  const step = Math.max(1, Math.floor(remaining / count));
  return Array.from({ length: count }, (_, index) => activeCount + index * step).filter(
    (projectIndex) => projectIndex < PROJECTS.length,
  );
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
  const pathRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const cardsRef = useRef(cards);
  const progressRef = useRef(
    Array.from({ length: DESKTOP_ACTIVE_MEDIA }, (_, index) =>
      getDistributedProgress(index, DESKTOP_ACTIVE_MEDIA),
    ),
  );
  const targetVelocityRef = useRef(0);
  const velocityRef = useRef(0);
  const settledIntroSlotsRef = useRef(new Set<number>());
  const nextProjectRef = useRef(DESKTOP_ACTIVE_MEDIA);
  const previousActiveCountRef = useRef(DESKTOP_ACTIVE_MEDIA);
  const reduceMotion = useReducedMotion();
  const activeCount = viewport.width < MOBILE_BREAKPOINT ? MOBILE_ACTIVE_MEDIA : DESKTOP_ACTIVE_MEDIA;

  const introExtraIndexes = useMemo(() => getIntroExtraIndexes(activeCount), [activeCount]);
  const introPhase = !ready ? "loading" : introActive && !reduceMotion ? "dispersing" : "grid";

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
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    if (!ready) settledIntroSlotsRef.current.clear();
  }, [ready]);

  const nudgeVelocity = useCallback((amount: number) => {
    targetVelocityRef.current = Math.max(
      -MAX_SCROLL_VELOCITY,
      Math.min(MAX_SCROLL_VELOCITY, targetVelocityRef.current + amount),
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const handleWheel = (event: WheelEvent) => {
      if ((event.target as Element | null)?.closest("[data-modal-scroll]")) return;
      event.preventDefault();
      nudgeVelocity(event.deltaY * 0.0024);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nudgeVelocity, reduceMotion]);

  useAnimationFrame((_, delta) => {
    if (!ready || reduceMotion) return;
    const seconds = Math.min(delta, 50) / 1000;
    velocityRef.current += (targetVelocityRef.current - velocityRef.current) * VELOCITY_LERP;
    targetVelocityRef.current *= VELOCITY_DECAY;
    if (Math.abs(targetVelocityRef.current) < 0.0005) targetVelocityRef.current = 0;

    const direction = velocityRef.current < -0.015 ? -1 : 1;
    const boost = Math.min(26, Math.abs(velocityRef.current) * 15);

    for (let slot = 0; slot < activeCount; slot += 1) {
      if (introActive && !settledIntroSlotsRef.current.has(slot)) continue;

      let progress = progressRef.current[slot] ?? 0;
      progress += BASE_PROGRESS_PER_SECOND * (1 + boost) * direction * seconds;

      if (progress >= 1) {
        progress -= 1;
        const nextIndex = nextProjectRef.current % PROJECTS.length;
        nextProjectRef.current += 1;
        setCards((current) =>
          current.map((card, index) =>
            index === slot ? { projectIndex: nextIndex, entryProgress: progress } : card,
          ),
        );
        cardsRef.current[slot] = { projectIndex: nextIndex, entryProgress: progress };
      } else if (progress < 0) {
        progress += 1;
        const previous = (cardsRef.current[slot].projectIndex - activeCount + PROJECTS.length) % PROJECTS.length;
        setCards((current) =>
          current.map((card, index) =>
            index === slot ? { projectIndex: previous, entryProgress: progress } : card,
          ),
        );
        cardsRef.current[slot] = { projectIndex: previous, entryProgress: progress };
      }

      progressRef.current[slot] = progress;
      const pathElement = pathRefs.current[slot];
      const cardElement = cardRefs.current[slot];
      const project = PROJECTS[cardsRef.current[slot].projectIndex];
      if (!pathElement || !cardElement || !project) continue;
      const cardSize = getCardSize(project, viewport);
      const position = getPathPosition(cardsRef.current[slot].projectIndex, progress, viewport, cardSize.width, cardSize.height);
      cardElement.style.width = `${cardSize.width}px`;
      cardElement.style.height = `${cardSize.height}px`;
      pathElement.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    }
  });

  // Reduced-motion static fallback: discrete navigation, no continuous motion
  if (reduceMotion) {
    if (!ready) {
      return (
        <div
          ref={containerRef}
          data-view="grid"
          data-intro-phase="loading"
          className="fixed inset-0 z-0 overflow-hidden bg-white"
          aria-label="Moving project grid. Static view for reduced motion."
        />
      );
    }
    return (
      <div
        ref={containerRef}
        data-view="grid"
        data-intro-phase="grid"
        className="fixed inset-0 z-0 overflow-hidden bg-white"
        aria-label={`Project grid static view for reduced motion showing ${activeCount} projects`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            const next = nextProjectRef.current % PROJECTS.length;
            nextProjectRef.current += 1;
            setCards((curr) => curr.map((c, i) => (i === 0 ? { projectIndex: next, entryProgress: getDistributedProgress(i, activeCount) } : c)));
            cardsRef.current[0] = { projectIndex: next, entryProgress: getDistributedProgress(0, activeCount) };
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            const prev = (cardsRef.current[0].projectIndex - 1 + PROJECTS.length) % PROJECTS.length;
            setCards((curr) => curr.map((c, i) => (i === 0 ? { projectIndex: prev, entryProgress: getDistributedProgress(i, activeCount) } : c)));
            cardsRef.current[0] = { projectIndex: prev, entryProgress: getDistributedProgress(0, activeCount) };
          }
        }}
      >
        <div className="absolute inset-0">
          {cards.slice(0, activeCount).map((card, slot) => {
            const project = PROJECTS[card.projectIndex];
            const size = getCardSize(project, viewport);
            const position = getPathPosition(card.projectIndex, card.entryProgress, viewport, size.width, size.height);
            return (
              <div
                key={`grid-static-${slot}-${project.id}`}
                className={`absolute left-1/2 top-1/2 ${slot >= MOBILE_ACTIVE_MEDIA ? "hidden md:block" : ""}`}
                style={{ transform: "translate(-50%, -50%)", zIndex: slot + 1 }}
              >
                <div className="will-change-transform" style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}>
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    aria-label={`Open ${project.title} preview`}
                    data-intro-card="active"
                    data-slug={project.slug}
                    className="group relative block overflow-hidden bg-neutral-100 focus-visible:z-20 min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                    style={{ width: size.width, height: size.height }}
                  >
                    <span className="relative block h-full w-full">
                      <ProjectMedia project={project} decorative eager sizes="400px" className="object-cover" />
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-auto fixed bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          <button
            type="button"
            onClick={() => {
              const next = nextProjectRef.current % PROJECTS.length;
              nextProjectRef.current += 1;
              setCards((curr) => curr.map((c, i) => (i === 0 ? { projectIndex: next, entryProgress: getDistributedProgress(i, activeCount) } : c)));
              cardsRef.current[0] = { projectIndex: next, entryProgress: getDistributedProgress(0, activeCount) };
            }}
            className="min-h-[44px] min-w-[44px] border border-black/15 bg-white px-3 text-xs tracking-[0.2em]"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => {
              const prev = (cardsRef.current[0].projectIndex - 1 + PROJECTS.length) % PROJECTS.length;
              setCards((curr) => curr.map((c, i) => (i === 0 ? { projectIndex: prev, entryProgress: getDistributedProgress(i, activeCount) } : c)));
              cardsRef.current[0] = { projectIndex: prev, entryProgress: getDistributedProgress(0, activeCount) };
            }}
            className="min-h-[44px] min-w-[44px] border border-black/15 bg-white px-3 text-xs tracking-[0.2em]"
          >
            Prev
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      data-view="grid"
      data-intro-phase={introPhase}
      className="canvas-surface fixed inset-0 z-0 overflow-hidden bg-white"
      onPan={(_, info) => nudgeVelocity(info.delta.y * -0.011)}
      aria-label="Moving project grid. Scroll or drag to move projects."
    >
      {(!ready || introActive) &&
        introExtraIndexes.map((projectIndex) => {
          const project = PROJECTS[projectIndex];
          const size = getCardSize(project, viewport);
          const angle = INTRO_RADIAL_ANGLE_RADIANS * projectIndex;
          const radius =
            INTRO_RADIAL_DISTANCE_MULTIPLIER *
            (PATH_REFERENCE_DISTANCE / CAMERA_DISTANCE) *
            Math.max(viewport.width, viewport.height);
          const delay =
            GRID_INTRO_DELAY_SECONDS +
            Math.min(INTRO_EXTRA_STAGGER_LIMIT_SECONDS, INTRO_EXTRA_STAGGER_SECONDS * projectIndex);

          return (
            <div
              key={`intro-extra-${project.id}`}
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{ transform: "translate(-50%, -50%)", zIndex: projectIndex + 1 }}
              aria-hidden="true"
            >
              <motion.div
                data-intro-card="departing"
                className="relative overflow-hidden bg-neutral-100"
                style={{ width: size.width, height: size.height }}
                initial={false}
                animate={
                  ready
                    ? { x: Math.cos(angle) * radius, y: -Math.sin(angle) * radius, scale: 1, opacity: 0 }
                    : { x: 0, y: 0, scale: INTRO_START_SCALE, opacity: 1 }
                }
                transition={
                  ready
                    ? {
                        x: { delay, duration: GRID_EXTRA_INTRO_TRAVEL_SECONDS, ease: EASE_POWER3_IN },
                        y: { delay, duration: GRID_EXTRA_INTRO_TRAVEL_SECONDS, ease: EASE_POWER3_IN },
                        scale: { delay, duration: GRID_EXTRA_INTRO_SCALE_SECONDS, ease: EASE_EXPO_OUT },
                        opacity: { delay: delay + 0.15, duration: 0.55, ease: EASE_POWER3_OUT },
                      }
                    : { duration: 0 }
                }
              >
                <Image
                  src={project.imageUrl}
                  alt=""
                  fill
                  unoptimized
                  loading="eager"
                  sizes="(max-width: 767px) 68vw, 58vw"
                  className="object-cover"
                  draggable={false}
                />
              </motion.div>
            </div>
          );
        })}

      <div className="absolute inset-0" inert={!ready || introActive ? true : undefined}>
        {cards.map((card, slot) => {
          const project = PROJECTS[card.projectIndex];
          const size = getCardSize(project, viewport);
          const position = getPathPosition(card.projectIndex, card.entryProgress, viewport, size.width, size.height);
          const introDelay =
            GRID_INTRO_DELAY_SECONDS +
            Math.min(INTRO_ACTIVE_STAGGER_LIMIT_SECONDS, INTRO_ACTIVE_STAGGER_SECONDS * card.projectIndex);
          const animateFromCenter = ready && introActive;
          const cardAnimation = ready ? { x: 0, y: 0, scale: 1 } : { x: -position.x, y: -position.y, scale: INTRO_START_SCALE };

          return (
            <div
              key={`grid-slot-${slot}`}
              className={`absolute left-1/2 top-1/2 ${slot >= MOBILE_ACTIVE_MEDIA ? "hidden md:block" : ""}`}
              style={{ transform: "translate(-50%, -50%)", zIndex: slot + 1 }}
            >
              <div
                ref={(element) => {
                  pathRefs.current[slot] = element;
                }}
                className="will-change-transform"
                style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
              >
                <motion.button
                  ref={(element) => {
                    cardRefs.current[slot] = element;
                  }}
                  layoutId={`project-${project.id}`}
                  data-intro-card="active"
                  data-slug={project.slug}
                  type="button"
                  disabled={!ready || introActive}
                  tabIndex={!ready || introActive ? -1 : 0}
                  onClick={() => onOpenProject(project)}
                  aria-label={`Open ${project.title} preview`}
                  className="group relative block overflow-hidden bg-neutral-100 focus-visible:z-20 min-h-[44px] min-w-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
                  style={{ width: size.width, height: size.height }}
                  initial={false}
                  animate={cardAnimation}
                  onAnimationComplete={() => {
                    if (!animateFromCenter) return;
                    settledIntroSlotsRef.current.add(slot);
                    cardRefs.current[slot]?.setAttribute("data-intro-settled", "true");
                  }}
                  transition={
                    animateFromCenter
                      ? {
                          x: { delay: introDelay, duration: GRID_ACTIVE_INTRO_TRAVEL_SECONDS, ease: EASE_POWER2_IN_OUT },
                          y: { delay: introDelay, duration: GRID_ACTIVE_INTRO_TRAVEL_SECONDS, ease: EASE_POWER2_IN_OUT },
                          scale: { delay: introDelay, duration: GRID_ACTIVE_INTRO_SCALE_SECONDS, ease: EASE_POWER3_OUT },
                        }
                      : { duration: 0 }
                  }
                >
                  <motion.span className="relative block h-full w-full" whileHover={ready && !introActive ? { scale: 1.015 } : undefined}>
                    <ProjectMedia
                      project={project}
                      playVideo={ready}
                      eager
                      sizes="(max-width: 767px) 68vw, 58vw"
                      className="select-none object-cover"
                    />
                  </motion.span>
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
