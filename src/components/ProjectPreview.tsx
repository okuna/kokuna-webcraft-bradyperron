"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import type { Project } from "@/lib/projects";
import { EASE_EXPO, MODAL_TRANSITION_SECONDS } from "@/lib/motion";
import { useModalFocus } from "@/lib/useModalFocus";
import { ProjectMedia } from "@/components/ProjectMedia";

export function ProjectPreview({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useModalFocus(Boolean(project), modalRef, onClose);

  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0 });
  }, [project]);

  const handleScrollClose = useCallback(() => {
    const el = modalRef.current;
    if (!el || !project) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    if (atBottom && el.scrollTop > 10) {
      if (closeTimeoutRef.current !== null) return;
      closeTimeoutRef.current = window.setTimeout(() => {
        onClose();
      }, 140);
    } else {
      if (closeTimeoutRef.current !== null) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    }
  }, [project, onClose]);

  useEffect(() => {
    const el = modalRef.current;
    if (!el || !project) return;
    let wheelAcc = 0;
    const onWheel = (e: WheelEvent) => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 12;
      if (atBottom && e.deltaY > 0) {
        wheelAcc += e.deltaY;
        if (wheelAcc > 90) {
          onClose();
          wheelAcc = 0;
        }
      } else {
        wheelAcc = 0;
      }
    };
    // also handle touch scroll overscroll via scroll event
    el.addEventListener("scroll", handleScrollClose, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      el.removeEventListener("scroll", handleScrollClose);
      el.removeEventListener("wheel", onWheel);
      if (closeTimeoutRef.current !== null) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [project, onClose, handleScrollClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={modalRef}
          className="project-modal fixed inset-0 z-30 overflow-y-auto bg-[rgba(255,255,255,0.82)] backdrop-blur-[3px] text-black lg:bg-[rgba(255,255,255,0.16)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: EASE_EXPO }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-preview-title"
          data-modal-scroll="true"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project preview"
            className="fixed right-0 top-0 z-40 flex h-14 w-14 items-center justify-center text-4xl leading-none text-black md:h-16 md:w-16 md:text-[2.5rem] min-h-[44px] min-w-[44px]"
          >
            <span aria-hidden="true">×</span>
          </button>

          <section className="relative flex h-screen min-h-[560px] items-center justify-center overflow-hidden bg-transparent px-5 py-16 md:px-12 md:py-20">
            <motion.div
              layoutId={`project-${project.id}`}
              className="relative overflow-hidden bg-neutral-100 shadow-[0_20px_80px_rgba(0,0,0,0.18)] will-change-transform"
              style={{
                width: `min(82vw, ${(72 * project.width) / project.height}vh)`,
                maxHeight: "72vh",
                aspectRatio: `${project.width} / ${project.height}`,
              }}
              // ponytail: rely on layoutId for center-to-hero and reverse hero-to-grid, only fade opacity
              transition={{
                layout: { duration: MODAL_TRANSITION_SECONDS, ease: EASE_EXPO },
                opacity: { duration: 0.32 },
              }}
            >
              <ProjectMedia project={project} playVideo eager sizes="82vw" className="object-cover" />
            </motion.div>

            <button
              type="button"
              onClick={() => infoRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 min-h-[44px]"
              aria-label={`Read more about ${project.title}`}
            >
              <span className="bg-white/90 px-5 py-2 text-xs tracking-[0.32em] text-black backdrop-blur-md md:text-sm">
                more info
              </span>
              <span className="animate-bounce text-3xl leading-none text-black/55" aria-hidden="true">
                ⌄
              </span>
            </button>
          </section>

          <section ref={infoRef} className="flex min-h-[50vh] items-start bg-white px-6 py-20 md:px-10 md:py-28">
            <div className="mx-auto w-full max-w-3xl">
              <motion.h2
                id="project-preview-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: MODAL_TRANSITION_SECONDS, ease: EASE_EXPO }}
                className="max-w-[16em] text-3xl leading-[1.05] tracking-tight md:text-6xl"
              >
                {project.title}
              </motion.h2>
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-black/45 md:mt-6 md:text-sm">
                {project.client} · {project.year}
                {project.type ? ` · ${project.type}` : ""}
              </p>
              {project.description && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: MODAL_TRANSITION_SECONDS, delay: 0.08, ease: EASE_EXPO }}
                  className="mt-10 max-w-2xl text-lg leading-relaxed text-black/70 md:text-2xl"
                >
                  {project.description}
                </motion.p>
              )}
            </div>
          </section>

          <section className="relative aspect-video w-full overflow-hidden bg-black">
            <Image src={project.imageUrl} alt="" fill unoptimized sizes="100vw" className="object-contain opacity-90" />
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute left-1/2 top-1/2 flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center bg-white px-5 py-2 text-xs tracking-[0.22em] text-black md:text-sm"
              >
                watch film ↗
              </a>
            )}
          </section>

          <section className="flex h-[20vh] min-h-36 items-center justify-center bg-white">
            <button type="button" onClick={onClose} className="min-h-11 px-5 text-xs tracking-[0.3em] text-black/60 hover:text-black md:text-sm">
              close
            </button>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
