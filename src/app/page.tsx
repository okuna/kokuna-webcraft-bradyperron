"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { AboutModal } from "@/components/AboutModal";
import { BottomBar, type ViewMode } from "@/components/BottomBar";
import { InfiniteCanvas } from "@/components/InfiniteCanvas";
import { ListView } from "@/components/ListView";
import { Loader } from "@/components/Loader";
import { ProjectPreview } from "@/components/ProjectPreview";
import { GRID_INTRO_SECONDS } from "@/lib/motion";
import type { Project } from "@/lib/projects";

export default function HomePage() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const modalOpen = aboutOpen || Boolean(previewProject);

  const finishLoading = useCallback(() => setLoaderDone(true), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);
  const closePreview = useCallback(() => setPreviewProject(null), []);

  useEffect(() => {
    if (!loaderDone) return;
    const timeoutId = setTimeout(
      () => setIntroComplete(true),
      GRID_INTRO_SECONDS * 1000,
    );
    return () => clearTimeout(timeoutId);
  }, [loaderDone]);

  return (
    <MotionConfig reducedMotion="user">
      <Loader onComplete={finishLoading} />

      <div inert={modalOpen ? true : undefined} aria-hidden={modalOpen || undefined}>
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:not-sr-only focus:bg-white focus:px-4 focus:py-3 focus:text-black"
        >
          Skip to main content
        </a>

        <main id="main-content" className="relative min-h-screen min-w-screen bg-white">
          <AnimatePresence mode="sync" initial={false}>
            {viewMode === "grid" ? (
              <InfiniteCanvas
                key="grid"
                ready={loaderDone}
                introActive={loaderDone && !introComplete}
                onOpenProject={setPreviewProject}
              />
            ) : (
              <ListView key="list" onOpenProject={setPreviewProject} />
            )}
          </AnimatePresence>
        </main>

        <BottomBar
          visible={loaderDone}
          viewMode={viewMode}
          onToggleView={() =>
            setViewMode((current) => (current === "grid" ? "list" : "grid"))
          }
          onOpenAbout={() => setAboutOpen(true)}
        />
      </div>

      <ProjectPreview project={previewProject} onClose={closePreview} />
      <AboutModal isOpen={aboutOpen} onClose={closeAbout} />
    </MotionConfig>
  );
}
