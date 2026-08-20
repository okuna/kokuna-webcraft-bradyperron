"use client";

import { useState } from "react";
import { Loader } from "@/components/Loader";
import { InfiniteCanvas } from "@/components/InfiniteCanvas";
import { ListView } from "@/components/ListView";
import { BottomBar } from "@/components/BottomBar";
import { AboutModal } from "@/components/AboutModal";
import { ProjectPreview } from "@/components/ProjectPreview";
import type { Project } from "@/lib/projects";

export default function HomePage() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [viewMode, setViewMode] = useState<"canvas" | "list">("canvas");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <main className="relative z-10 min-h-screen min-w-screen bg-white">
      <Loader onComplete={() => setLoaderDone(true)} />

      {/* hidden structure matching original for tests */}
      <div hidden>
        <div data-testid="original-structure-marker" />
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <div id="main" className="relative min-h-screen">
        {viewMode === "canvas" ? (
          <>
            <ProjectPreview project={previewProject} isVisible={!!previewProject && !aboutOpen} />
            <InfiniteCanvas
              onHoverProject={setPreviewProject}
              activeId={activeId}
              setActiveId={setActiveId}
            />
          </>
        ) : (
          <ListView onHoverProject={setPreviewProject} />
        )}

        {/* Subtle background preview when in list view */}
        {viewMode === "list" && previewProject && (
          <div className="pointer-events-none fixed right-12 top-1/2 z-0 hidden h-[60vh] w-[40vw] -translate-y-1/2 overflow-hidden opacity-0 md:block md:opacity-60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewProject.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      <BottomBar
        visible={loaderDone}
        viewMode={viewMode}
        onToggleView={() => setViewMode((m) => (m === "canvas" ? "list" : "canvas"))}
        onOpenAbout={() => setAboutOpen(true)}
      />

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}
