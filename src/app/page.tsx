"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const isInteractive = loaderDone && introComplete && !modalOpen;

  const lastFocusRef = useRef<HTMLElement | null>(null);

  const finishLoading = useCallback(() => setLoaderDone(true), []);
  const closeAbout = useCallback(() => {
    setAboutOpen(false);
    // ponytail: restore focus after inert removal, with retry for disabled state
    setTimeout(() => {
      lastFocusRef.current?.removeAttribute("disabled");
      if (lastFocusRef.current) lastFocusRef.current.tabIndex = 0;
      lastFocusRef.current?.focus();
    }, 160);
  }, []);
  const closePreview = useCallback(() => {
    setPreviewProject(null);
    setTimeout(() => {
      lastFocusRef.current?.removeAttribute("disabled");
      if (lastFocusRef.current) lastFocusRef.current.tabIndex = 0;
      lastFocusRef.current?.focus();
    }, 160);
  }, []);

  const openAbout = useCallback(() => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setAboutOpen(true);
  }, []);

  const openProject = useCallback((project: Project) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setPreviewProject(project);
  }, []);

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

      <div
        inert={!isInteractive ? true : undefined}
        aria-hidden={modalOpen ? true : undefined}
      >
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
                onOpenProject={openProject}
              />
            ) : (
              <ListView key="list" onOpenProject={openProject} ready={loaderDone} />
            )}
          </AnimatePresence>
        </main>

        <BottomBar
          visible={loaderDone}
          viewMode={viewMode}
          onToggleView={() =>
            setViewMode((current) => (current === "grid" ? "list" : "grid"))
          }
          onOpenAbout={openAbout}
          disabled={!isInteractive}
        />
      </div>

      <ProjectPreview project={previewProject} onClose={closePreview} />
      <AboutModal isOpen={aboutOpen} onClose={closeAbout} />
    </MotionConfig>
  );
}
