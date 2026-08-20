"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PROJECTS, SETTINGS } from "@/lib/projects";
import {
  EASE_EXPO,
  EASE_OUT,
  LOADER_EXIT_SECONDS,
  LOADER_MINIMUM_MS,
} from "@/lib/motion";

const PRELOAD_SOURCES = [
  ...PROJECTS.map((project) => project.imageUrl),
  SETTINGS.portrait.url,
];

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const startedAt = performance.now();
    let completed = 0;

    const markComplete = () => {
      completed += 1;
      if (!cancelled) {
        setProgress(Math.round((completed / PRELOAD_SOURCES.length) * 100));
      }
    };

    const preload = (source: string) =>
      new Promise<void>((resolve) => {
        const image = new window.Image();
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          markComplete();
          resolve();
        };
        image.onload = done;
        image.onerror = done;
        image.src = source;
        if (image.complete) done();
      });

    Promise.all(PRELOAD_SOURCES.map(preload)).then(() => {
      const minimum = reduceMotion ? 150 : LOADER_MINIMUM_MS;
      const remaining = Math.max(0, minimum - (performance.now() - startedAt));
      timeoutId = setTimeout(() => {
        if (!cancelled) {
          onComplete();
          setVisible(false);
        }
      }, remaining);
    });

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: LOADER_EXIT_SECONDS, ease: EASE_OUT }}
          role="status"
          aria-label={`Loading portfolio, ${progress}%`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="h-8 overflow-hidden md:h-16">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: EASE_EXPO }}
                className="font-display text-3xl leading-none text-black md:text-5xl"
              >
                bradyperron
              </motion.div>
            </div>
            <div
              className="h-1 w-full bg-black/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-black transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
