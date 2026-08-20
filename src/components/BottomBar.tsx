"use client";

import { motion } from "framer-motion";

type ViewMode = "canvas" | "list";

export function BottomBar({
  visible,
  viewMode,
  onToggleView,
  onOpenAbout,
}: {
  visible: boolean;
  viewMode: ViewMode;
  onToggleView: () => void;
  onOpenAbout: () => void;
}) {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 pointer-events-none">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="layout-name font-acumin text-xl md:text-3xl text-black bg-white/85 backdrop-blur-md inline-block px-2 py-1"
        >
          bradyperron
        </motion.h1>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        onClick={onToggleView}
        aria-label={
          viewMode === "canvas" ? "Switch to list view" : "Switch to canvas view"
        }
        className="layout-button fixed bottom-4 right-16 z-20 pointer-events-auto font-acumin text-black text-sm md:text-base leading-none hover:opacity-60 transition-opacity cursor-pointer"
        style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
      >
        {viewMode === "canvas" ? "list" : "canvas"}
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
        onClick={onOpenAbout}
        aria-label="Open about modal"
        className="layout-button fixed bottom-4 right-4 z-20 pointer-events-auto font-acumin text-black text-sm md:text-base leading-none hover:opacity-60 transition-opacity cursor-pointer"
        style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
      >
        about
      </motion.button>
    </>
  );
}
