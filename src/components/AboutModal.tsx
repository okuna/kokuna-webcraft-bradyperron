"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SETTINGS } from "@/lib/projects";

export function AboutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      scrollRef.current?.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const words = SETTINGS.longDescription.split(/(\s+)/); // keep spaces

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-modal-scroll="true"
          ref={scrollRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            duration: 0.7,
            ease: [0.22, 0.61, 0.36, 1] as const,
          }}
          className="fixed inset-0 z-30 bg-white text-black pointer-events-auto overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-h-full flex-col px-5 pb-5 md:px-12 md:pb-10">
            <motion.header
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky top-0 z-20 -mx-5 flex items-start justify-between bg-white px-5 pb-3 pt-5 md:-mx-12 md:px-12 md:pb-4 md:pt-10"
            >
              <span className="about-reveal font-acumin text-[11px] md:text-xs tracking-[0.3em] text-black/40">
                about — {SETTINGS.siteTitle}
              </span>
              <button
                onClick={onClose}
                className="about-reveal font-acumin text-[11px] md:text-xs tracking-[0.25em] text-black/60 hover:text-black transition-colors cursor-pointer min-h-[44px] px-2 -mr-2"
                aria-label="Close about modal"
              >
                close
              </button>
            </motion.header>

            <main className="mt-14 grid flex-1 grid-cols-1 gap-y-12 pb-6 md:mt-24 md:grid-cols-12 md:gap-x-10">
              <motion.div
                className="font-acumin text-black md:col-span-12 md:row-start-1"
                style={{
                  fontSize: "clamp(1.7rem, 4.4vw, 3.75rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.018em",
                  maxWidth: "17em",
                }}
              >
                <p className="leading-[1.06]">
                  {words.map((w, i) => {
                    if (/^\s+$/.test(w)) {
                      return <span key={i}>{w}</span>;
                    }
                    return (
                      <span
                        key={i}
                        className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em] mr-[0.2em]"
                      >
                        <motion.span
                          initial={{ y: "110%" }}
                          animate={{ y: 0 }}
                          transition={{
                            delay: 0.35 + i * 0.018,
                            duration: 0.6,
                            ease: [0.22, 0.61, 0.36, 1] as const,
                          }}
                          className="about-word inline-block"
                        >
                          {w}
                        </motion.span>
                      </span>
                    );
                  })}
                </p>
              </motion.div>

              <motion.figure
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative order-last aspect-[4/5] w-2/3 overflow-hidden bg-black/[0.04] md:order-none md:col-span-4 md:col-start-9 md:row-start-2 md:w-full md:self-start"
              >
                <div className="absolute -inset-[5%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SETTINGS.portrait.url}
                    alt={SETTINGS.portrait.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: "50% 20%" }}
                    loading="lazy"
                  />
                </div>
              </motion.figure>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex flex-col justify-start md:col-span-4 md:col-start-1 md:row-start-2"
              >
                <span className="about-reveal font-acumin text-[11px] md:text-xs tracking-[0.3em] text-black/40">
                  (contact)
                </span>
                <nav className="mt-5 flex flex-col md:mt-7">
                  <a
                    href={SETTINGS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-reveal group flex items-baseline justify-between gap-4 border-t border-black/15 py-2.5 font-acumin text-sm text-black transition-colors hover:text-black/55 md:py-3.5 md:text-xl min-h-[44px]"
                  >
                    <span>instagram</span>
                    <span className="text-[0.45em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </a>
                  <a
                    href={`mailto:${SETTINGS.email}`}
                    className="about-reveal group flex items-baseline justify-between gap-4 border-y border-black/15 py-2.5 font-acumin text-sm text-black transition-colors hover:text-black/55 md:py-3.5 md:text-xl min-h-[44px]"
                  >
                    <span>email</span>
                    <span className="text-[0.45em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </a>
                </nav>
                <p className="about-reveal mt-6 font-acumin text-[11px] tracking-[0.3em] text-black/45 md:mt-8 md:text-xs">
                  Videographer / Editor / Director
                </p>
              </motion.div>
            </main>

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="about-reveal flex items-end justify-between border-t border-black/10 pt-6 font-acumin text-[10px] tracking-[0.3em] text-black/30 md:pt-8 md:text-[11px]"
            >
              <span>{SETTINGS.siteTitle}</span>
              <span>© 2026</span>
            </motion.footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
