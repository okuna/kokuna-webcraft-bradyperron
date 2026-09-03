"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export type ViewMode = "grid" | "list";

export function BottomBar({
  visible,
  viewMode,
  onToggleView,
  onOpenAbout,
  disabled,
}: {
  visible: boolean;
  viewMode: ViewMode;
  onToggleView: () => void;
  onOpenAbout: () => void;
  disabled?: boolean;
}) {
  const isDisabled = !visible || Boolean(disabled);
  return (
    <>
      <header aria-label="Portfolio identity" aria-hidden={!visible || undefined}>
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 p-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
            className="layout-name bg-white/85 font-display text-xl leading-7 text-black backdrop-blur-md md:text-3xl md:leading-9"
          >
            bradyperron
          </motion.h1>
        </div>
      </header>

      <footer aria-label="Portfolio controls" aria-hidden={!visible || undefined}>
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
          onClick={onToggleView}
          disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
          aria-label={
            viewMode === "grid" ? "Switch to list view" : "Switch to grid view"
          }
          className="bottom-control right-16"
        >
          {viewMode === "grid" ? "list" : "grid"}
        </motion.button>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.7 }}
          onClick={onOpenAbout}
          disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
          aria-label="Open about modal"
          className="bottom-control right-4"
        >
          about
        </motion.button>
      </footer>
    </>
  );
}
