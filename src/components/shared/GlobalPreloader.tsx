'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

const preloaderWords = [
  { text: 'السلام علیکم', lang: 'ur', dir: 'rtl' },
  { text: 'नमस्ते', lang: 'hi', dir: 'ltr' },
  { text: 'Hola', lang: 'es', dir: 'ltr' },
  { text: 'مرحباً', lang: 'ar', dir: 'rtl' },
  { text: 'په خیر راغلي', lang: 'ps', dir: 'rtl' },
  { text: 'Welcome', lang: 'en', dir: 'ltr' },
] as const;

const WORD_INTERVAL_MS = 520;
export const INTRO_DURATION_MS = 3600;

const slideUp: Variants = {
  initial: { top: 0, backgroundColor: '#000000' },
  exit: {
    top: '-100vh',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.12 },
  },
};

const wordMotion: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.985, filter: 'blur(8px)' },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 1.01,
    filter: 'blur(6px)',
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

export default function GlobalPreloader() {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const handleResize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (index === preloaderWords.length - 1) return;
    const timeout = window.setTimeout(() => setIndex((current) => current + 1), WORD_INTERVAL_MS);
    return () => window.clearTimeout(timeout);
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;
  const curve: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[99999] flex cursor-wait select-none items-center justify-center bg-black text-white"
    >
      <div
        className="relative z-10 flex h-20 min-w-72 items-center justify-center px-6 text-center text-[2.15rem] font-medium leading-none tracking-[-0.035em] text-[#f5f5f7] sm:min-w-96 sm:text-[2.75rem] md:text-[3.35rem]"
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif" }}
      >
        <AnimatePresence mode="sync" initial>
          <motion.p
            key={preloaderWords[index].text}
            variants={wordMotion}
            initial="initial"
            animate="enter"
            exit="exit"
            lang={preloaderWords[index].lang}
            dir={preloaderWords[index].dir}
            className="absolute whitespace-nowrap"
          >
            {preloaderWords[index].text}
          </motion.p>
        </AnimatePresence>
      </div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -z-10 h-[calc(100%+300px)] w-full"
      >
        <motion.path
          className="fill-black"
          variants={curve}
          initial="initial"
          exit="exit"
        />
      </svg>
    </motion.div>
  );
}
