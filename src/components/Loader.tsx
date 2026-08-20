"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 12 + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 500);
        }, 400);
      } else {
        setProgress(current);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loader fixed inset-0 z-50 flex items-center justify-center bg-white h-screen w-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } }}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="overflow-hidden h-8 md:h-16">
              <motion.h1
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                className="font-acumin text-3xl md:text-5xl text-black"
              >
                bradyperron
              </motion.h1>
            </div>
            <div className="w-half left-0 w-full h-1 bg-black/10 mt-2" style={{ width: "240px" }}>
              <div
                className="h-full bg-black transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
