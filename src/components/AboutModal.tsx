"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { SETTINGS } from "@/lib/projects";
import { EASE_EXPO, MODAL_TRANSITION_SECONDS } from "@/lib/motion";
import { useModalFocus } from "@/lib/useModalFocus";

function splitAnimatedWords(value: string) {
  const words = value.split(/\s+/).filter(Boolean);
  return words.flatMap((word, wordIndex) => {
    const fragments = word.split(/(?<=\/)/);
    return fragments.map((text, fragmentIndex) => ({
      text,
      separator:
        fragmentIndex < fragments.length - 1
          ? "\u200B"
          : wordIndex < words.length - 1
            ? " "
            : "",
    }));
  });
}

export function AboutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalFocus(isOpen, modalRef, onClose);

  const words = useMemo(
    () => splitAnimatedWords(SETTINGS.longDescription),
    [],
  );

  const revealTransition = (delay: number) => ({
    delay,
    duration: 0.6,
    ease: EASE_EXPO,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          data-modal-scroll="true"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: MODAL_TRANSITION_SECONDS, ease: EASE_EXPO }}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-white text-black [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
        >
          <div className="flex min-h-full flex-col px-5 pb-5 md:px-12 md:pb-10">
            <header className="sticky top-0 z-20 -mx-5 flex items-start justify-between bg-white px-5 pb-3 pt-5 md:-mx-12 md:px-12 md:pb-4 md:pt-10">
              <motion.span
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={revealTransition(0.35)}
                className="text-[11px] tracking-[0.3em] text-black/40 md:text-xs"
              >
                about — {SETTINGS.siteTitle}
              </motion.span>
              <motion.button
                type="button"
                onClick={onClose}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={revealTransition(0.42)}
                className="-mr-2 -mt-3 flex min-h-11 min-w-11 items-center justify-center px-2 pt-3 text-[11px] tracking-[0.25em] text-black/60 transition-colors hover:text-black md:text-xs"
                aria-label="Close about modal"
              >
                close
              </motion.button>
            </header>

            <div className="mt-10 grid flex-1 grid-cols-1 gap-y-12 pb-6 md:mt-20 md:grid-cols-12 md:gap-x-10">
              <h2
                id="about-title"
                className="max-w-[17em] text-black md:col-span-12 md:row-start-1"
                style={{
                  fontSize: "clamp(1.7rem, 4.4vw, 3.75rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.018em",
                }}
              >
                {words.map((word, index) => (
                  <span key={`${word.text}-${index}`}>
                    <span className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em]">
                      <motion.span
                        className="about-word inline-block"
                        initial={{ y: "115%" }}
                        animate={{ y: 0 }}
                        transition={{
                          delay: 0.18 + index * 0.025,
                          duration: 0.7,
                          ease: EASE_EXPO,
                        }}
                      >
                        {word.text}
                      </motion.span>
                    </span>
                    {word.separator}
                  </span>
                ))}
              </h2>

              <motion.figure
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: 0.95, delay: 0.3, ease: EASE_EXPO }}
                className="relative order-last w-2/3 overflow-hidden bg-black/[0.04] md:order-none md:col-span-4 md:col-start-9 md:row-start-2 md:w-full md:self-start"
                style={{ aspectRatio: `${SETTINGS.portrait.width} / ${SETTINGS.portrait.height}` }}
              >
                <motion.div
                  className="absolute -inset-[5%]"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1, x: ["0%", "3%", "0%"], y: ["0%", "-3%", "0%"] }}
                  transition={{
                    scale: { duration: 1.1, ease: EASE_EXPO },
                    x: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
                    y: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
                  }}
                >
                  <Image
                    src={SETTINGS.portrait.url}
                    alt={SETTINGS.portrait.alt}
                    width={SETTINGS.portrait.width}
                    height={SETTINGS.portrait.height}
                    unoptimized
                    sizes="(max-width: 767px) 67vw, 34vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.figure>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={revealTransition(0.55)}
                className="flex flex-col justify-start md:col-span-4 md:col-start-1 md:row-start-2"
              >
                <span className="text-[11px] tracking-[0.3em] text-black/40 md:text-xs">
                  (contact)
                </span>
                <nav className="mt-5 flex flex-col md:mt-7" aria-label="Contact">
                  <a
                    href={SETTINGS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-11 items-center justify-between gap-4 border-t border-black/15 py-2.5 text-sm text-black transition-colors hover:text-black/55 md:py-3.5 md:text-xl"
                  >
                    <span>instagram</span>
                    <span className="text-[0.45em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </a>
                  <a
                    href={`mailto:${SETTINGS.email}`}
                    className="group flex min-h-11 items-center justify-between gap-4 border-y border-black/15 py-2.5 text-sm text-black transition-colors hover:text-black/55 md:py-3.5 md:text-xl"
                  >
                    <span>email</span>
                    <span className="text-[0.45em] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </a>
                </nav>
                <p className="mt-6 text-[11px] tracking-[0.3em] text-black/45 md:mt-8 md:text-xs">
                  {SETTINGS.description.replace(/\//g, " / ")}
                </p>
              </motion.div>
            </div>

            <motion.footer
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={revealTransition(0.7)}
              className="flex items-end justify-between border-t border-black/10 pt-6 text-[10px] tracking-[0.3em] text-black/30 md:pt-8 md:text-[11px]"
            >
              <span>{SETTINGS.siteTitle}</span>
              <span>© {new Date().getFullYear()}</span>
            </motion.footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
