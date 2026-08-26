"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

export function ProjectMedia({
  project,
  playVideo = false,
  decorative = false,
  eager = false,
  sizes = "(max-width: 767px) 68vw, 58vw",
  className = "object-cover",
}: {
  project: Project;
  playVideo?: boolean;
  decorative?: boolean;
  eager?: boolean;
  sizes?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playVideo) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [playVideo, project.previewVideoUrl]);

  if (project.previewVideoUrl) {
    return (
      <video
        ref={videoRef}
        src={project.previewVideoUrl}
        poster={project.imageUrl}
        autoPlay={playVideo}
        muted
        loop
        playsInline
        preload={eager ? "auto" : "metadata"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : project.title}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }

  return (
    <Image
      src={project.imageUrl}
      alt={decorative ? "" : project.title}
      fill
      unoptimized
      loading={eager ? "eager" : "lazy"}
      sizes={sizes}
      className={className}
      draggable={false}
    />
  );
}
