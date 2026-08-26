'use client';

import React, { useRef, startTransition, useState, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { TransitionRouter } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const getPageName = (path: string | null | undefined): string => {
  if (!path || path === '/') return 'HOME';
  const segment = path.split('/').filter(Boolean).pop();
  return segment ? segment.toUpperCase().replace(/-/g, ' ') : 'PORTFOLIO';
};

/**
 * Robustly restore scroll to `target` after page transition.
 */
function restoreScroll(target: number, lenisInst: Lenis | null) {
  const lenisObj = lenisInst || window.__lenis;
  if (lenisObj) {
    lenisObj.scrollTo(target, { immediate: true });
  }
  document.documentElement.scrollTop = target;
  document.body.scrollTop = target;

  let lockFrames = 12;
  const lockLoop = () => {
    document.documentElement.scrollTop = target;
    document.body.scrollTop = target;
    if (lenisObj) lenisObj.scrollTo(target, { immediate: true });
    lockFrames--;
    if (lockFrames > 0) requestAnimationFrame(lockLoop);
  };
  requestAnimationFrame(lockLoop);

  if (lenisInst) lenisInst.start();

  requestAnimationFrame(() => {
    if (lenisObj) lenisObj.stop();
    ScrollTrigger.refresh();
    document.documentElement.scrollTop = target;
    document.body.scrollTop = target;
    requestAnimationFrame(() => {
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;
      if (lenisObj) {
        lenisObj.scrollTo(target, { immediate: true });
        lenisObj.start();
      }
      setTimeout(() => {
        document.documentElement.scrollTop = target;
        document.body.scrollTop = target;
        if (lenisObj) lenisObj.scrollTo(target, { immediate: true });
      }, 200);
    });
  });
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<number>(0);
  const [pageName, setPageName] = useState<string>('');
  const lenis = useLenis();

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <TransitionRouter
      auto={true}
      leave={(next: () => void, from: string, to: string) => {
        if (lenis) lenis.stop();
        setPageName(getPageName(to));
        scrollTargetRef.current = 0;

        gsap.set(overlayRef.current, { scaleY: 0, transformOrigin: 'bottom', pointerEvents: 'auto' });
        gsap.set(textRef.current, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ onComplete: next });
        tl.to(overlayRef.current, { scaleY: 1, duration: 0.6, ease: 'power3.inOut' });
        tl.to(textRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
        tl.add(() => {
          document.documentElement.scrollTop = scrollTargetRef.current;
          document.body.scrollTop = scrollTargetRef.current;
          if (window.__lenis) window.__lenis.scrollTo(scrollTargetRef.current, { immediate: true });
        }, 0.5);
        return () => tl.kill();
      }}
      enter={(next: () => void) => {
        gsap.set(overlayRef.current, { transformOrigin: 'top' });
        let scrollLockActive = false;
        const runScrollLock = () => {
          if (!scrollLockActive) return;
          const y = scrollTargetRef.current;
          document.documentElement.scrollTop = y;
          document.body.scrollTop = y;
          requestAnimationFrame(runScrollLock);
        };

        const tl = gsap.timeline({
          onComplete: () => {
            const target = scrollTargetRef.current;
            if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true });
            document.documentElement.scrollTop = target;
            document.body.scrollTop = target;
            setTimeout(() => {
              scrollLockActive = false;
              gsap.set(overlayRef.current, { pointerEvents: 'none' });
              restoreScroll(target, lenis);
            }, 16);
          },
        });

        tl.add(() => {
          scrollTargetRef.current = 0;
          document.documentElement.scrollTop = scrollTargetRef.current;
          document.body.scrollTop = scrollTargetRef.current;
          if (window.__lenis) window.__lenis.scrollTo(scrollTargetRef.current, { immediate: true });
          scrollLockActive = true;
          requestAnimationFrame(runScrollLock);
        }, 0);

        tl.to(textRef.current, { y: -50, opacity: 0, duration: 0.25, ease: 'power3.in' }, 0.1);
        tl.to(overlayRef.current, { scaleY: 0, duration: 0.55, ease: 'power3.inOut' }, '-=0.15');
        tl.call(() => {
          requestAnimationFrame(() => startTransition(next));
        }, undefined, 0.3);

        return () => {
          scrollLockActive = false;
          tl.kill();
        };
      }}
    >
      <div>{children}</div>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9995] bg-ink flex items-center justify-center pointer-events-none scale-y-0"
        style={{ transformOrigin: 'bottom', willChange: 'transform' }}
      >
        <div
          ref={textRef}
          className="text-cream font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-widest opacity-0"
        >
          {pageName}
        </div>
      </div>
    </TransitionRouter>
  );
}
