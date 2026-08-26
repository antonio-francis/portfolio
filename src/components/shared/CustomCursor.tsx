'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor="hover"], .cursor-pointer';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hasMovedRef = useRef(false);
  const hiddenRef = useRef(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);

    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updatePointerType = () => setHasFinePointer(pointerQuery.matches);

    updatePointerType();
    pointerQuery.addEventListener('change', updatePointerType);
    return () => pointerQuery.removeEventListener('change', updatePointerType);
  }, []);

  useEffect(() => {
    if (!mounted || !hasFinePointer) return;

    document.body.classList.add('custom-cursor-active');
    return () => document.body.classList.remove('custom-cursor-active');
  }, [mounted, hasFinePointer]);

  useGSAP(
    () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!mounted || !hasFinePointer || !dot || !ring) return;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

      const dotX = prefersReducedMotion
        ? (value: number) => gsap.set(dot, { x: value })
        : gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power3.out' });
      const dotY = prefersReducedMotion
        ? (value: number) => gsap.set(dot, { y: value })
        : gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power3.out' });
      const ringX = prefersReducedMotion
        ? (value: number) => gsap.set(ring, { x: value })
        : gsap.quickTo(ring, 'x', { duration: 0.12, ease: 'power3.out' });
      const ringY = prefersReducedMotion
        ? (value: number) => gsap.set(ring, { y: value })
        : gsap.quickTo(ring, 'y', { duration: 0.12, ease: 'power3.out' });

      const setHidden = (value: boolean) => {
        if (hiddenRef.current === value) return;
        hiddenRef.current = value;
        setIsHidden(value);
      };

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType && event.pointerType !== 'mouse') return;

        if (!hasMovedRef.current) {
          hasMovedRef.current = true;
          gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
        } else {
          dotX(event.clientX);
          dotY(event.clientY);
          ringX(event.clientX);
          ringY(event.clientY);
        }

        setHidden(false);
      };

      const onMouseLeave = () => setHidden(true);
      const onMouseEnter = () => {
        if (hasMovedRef.current) setHidden(false);
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mouseenter', onMouseEnter);

      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('mouseleave', onMouseLeave);
        document.removeEventListener('mouseenter', onMouseEnter);
      };
    },
    {
      dependencies: [mounted, hasFinePointer, prefersReducedMotion],
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    if (!mounted || !hasFinePointer) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!event.pointerType || event.pointerType === 'mouse') setIsClicked(true);
    };
    const onPointerUp = () => setIsClicked(false);
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      setIsHovered(target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    document.addEventListener('pointerover', onPointerOver);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.removeEventListener('pointerover', onPointerOver);
    };
  }, [mounted, hasFinePointer]);

  if (!mounted || !hasFinePointer) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 will-change-transform transition-opacity duration-150 ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span
          className={`block h-full w-full rounded-full border border-ink/70 bg-neon shadow-[0_0_0_1px_rgba(245,245,247,0.2)] transition-[scale,opacity] duration-150 ${
            isClicked ? 'scale-125' : isHovered ? 'scale-75' : 'scale-100'
          }`}
        />
      </div>

      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[9998] h-7 w-7 will-change-transform transition-opacity duration-150 ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <span
          className={`block h-full w-full rounded-full border shadow-[0_0_0_1px_rgba(5,5,5,0.32)] transition-[scale,background-color,border-color] duration-200 ${
            isClicked
              ? 'scale-80 border-neon bg-neon/15'
              : isHovered
                ? 'scale-125 border-neon bg-neon/[0.06]'
                : 'scale-100 border-neon/60 bg-transparent'
          }`}
        />
      </div>
    </>
  );
}
