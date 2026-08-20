"use client";

import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/projects";

export function ListView({
  onHoverProject,
}: {
  onHoverProject: (p: Project | null) => void;
}) {
  return (
    <div className="relative z-10 min-h-screen w-full bg-white px-5 pb-24 pt-20 md:px-12 md:pt-28">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-baseline gap-4 border-b border-black/10 pb-4">
          <span className="font-acumin text-[11px] tracking-[0.3em] text-black/40">
            ({PROJECTS.length}) projects
          </span>
          <span className="font-acumin text-[11px] tracking-[0.3em] text-black/40">
            2023 — 2025
          </span>
        </div>

        <div className="flex flex-col">
          {PROJECTS.map((project, idx) => (
            <motion.a
              key={project.id}
              href={project.videoUrl || "#"}
              target={project.videoUrl ? "_blank" : undefined}
              rel={project.videoUrl ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, duration: 0.4 }}
              onMouseEnter={() => onHoverProject(project)}
              onMouseLeave={() => onHoverProject(null)}
              className="group flex items-center justify-between gap-4 border-b border-black/10 py-4 md:py-6 hover:bg-black/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-baseline gap-6 md:gap-12 flex-1 min-w-0">
                <span className="font-acumin text-[11px] tracking-[0.2em] text-black/30 hidden md:block w-8">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-acumin text-base md:text-2xl lg:text-3xl tracking-[-0.01em] truncate pr-4 group-hover:tracking-[0.01em] transition-all duration-300">
                  {project.title}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-8 text-[11px] font-acumin tracking-[0.2em] text-black/40">
                <span className="w-[160px] truncate text-right">{project.client}</span>
                <span className="w-[60px] text-right">{project.year}</span>
                <span className="w-[100px] truncate text-right">{project.type || "—"}</span>
              </div>

              <div className="h-10 w-16 md:h-14 md:w-20 overflow-hidden bg-black/5 flex-shrink-0 ml-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 font-acumin text-[11px] tracking-[0.3em] text-black/30">
          End of list — scroll to top to switch back to canvas view
        </div>
      </div>
    </div>
  );
}
