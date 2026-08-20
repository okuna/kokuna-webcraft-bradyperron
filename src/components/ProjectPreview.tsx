"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";

export function ProjectPreview({
  project,
  isVisible,
}: {
  project: Project | null;
  isVisible: boolean;
}) {
  if (!project) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-white">
      <AnimatePresence mode="wait">
        {isVisible && project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              duration: 0.45,
              ease: [0.22, 0.61, 0.36, 1] as const,
            }}
            className="relative w-[72vw] max-w-[900px] aspect-[4/3] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/10 mix-blend-multiply" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
