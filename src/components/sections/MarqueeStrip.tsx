'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useLenis } from '@/components/providers/SmoothScrollProvider';

import { useReducedMotion } from '@/lib/useReducedMotion';

export default function MarqueeStrip() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const tween1Ref = useRef<gsap.core.Tween | null>(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  const items = ['Grow Your Business', 'Digital Solutions', 'Increase Your Sales', 'Online Growth'];

  useEffect(() => {
    if (reduced) return;
    const track1 = track1Ref.current;
    if (!track1) return;
    const totalWidth1 = track1.scrollWidth;
    const wrap = (val: string | number, max: number): number => {
      const modulus = parseFloat(val as string) % max;
      return modulus <= 0 ? modulus : modulus - max;
    };
    tween1Ref.current = gsap.to(track1, {
      x: `-=${totalWidth1 / 2}`,
      duration: 45,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => wrap(x, totalWidth1 / 2)),
      },
    });
    return () => {
      if (tween1Ref.current) tween1Ref.current.kill();
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    if (!lenis) return;
    const handleScroll = ({ velocity }: { velocity: number }) => {
      if (tween1Ref.current) {
        const multiplier = Math.min(3, Math.max(1, 1 + Math.abs(velocity) * 0.5));
        tween1Ref.current.timeScale(velocity < -0.5 ? -multiplier : multiplier);
      }
    };
    lenis.on('scroll', handleScroll);
    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, reduced]);

  return (
    <div
      className="w-full relative z-20 overflow-hidden select-none border-t border-b border-border-dark"
      style={{ willChange: 'transform' }}
    >
      <div className="overflow-hidden bg-cream py-7 md:py-9">
        <div ref={track1Ref} className="inline-flex items-center gap-0 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-10 pr-10">
              {items.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="font-mono text-[clamp(1.4rem,3.5vw,2.5rem)] uppercase tracking-[0.12em] text-warm font-semibold">
                    {item}
                  </span>
                  <span className="text-forest text-[clamp(0.9rem,1.5vw,1.2rem)]">◆</span>
                </React.Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
