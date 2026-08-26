'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useTransitionState } from 'next-transition-router';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { safeSessionStorage } from '@/utils/storage';

const FIRST_NAME = 'ANTONIO';
const LAST_NAME = 'FRANCIS.';

const HomeBanner = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const antonioLineRef = useRef<HTMLSpanElement>(null);
  const bandRef = useRef<HTMLSpanElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const nameStageRef = useRef<HTMLDivElement>(null);
  const [preloaderComplete, setPreloaderComplete] = useState<boolean>(false);
  const { isReady } = useTransitionState();
  const reduced = useReducedMotion();

  // Quiet, editorial reveal: the name settles in with a clean rise and the
  // band wipes in. Everything else simply fades up in sequence.
  useEffect(() => {
    if (reduced) {
      gsap.set(
        [
          sectionRef.current,
          antonioLineRef.current,
          kickerRef.current,
          paragraphRef.current,
          buttonsRef.current,
        ],
        { opacity: 1, y: 0 },
      );
      gsap.set(bandRef.current, { clipPath: 'inset(0 0% 0 0)' });
      return;
    }
    if (sectionRef.current) gsap.set(sectionRef.current, { opacity: 0 });
    if (antonioLineRef.current) gsap.set(antonioLineRef.current, { y: 24, opacity: 0 });
    if (bandRef.current) gsap.set(bandRef.current, { clipPath: 'inset(0 100% 0 0)' });
    [kickerRef, paragraphRef, buttonsRef].forEach((ref) => {
      if (ref.current) gsap.set(ref.current, { y: 20, opacity: 0 });
    });
  }, [reduced]);

  useEffect(() => {
    const hasShownPreloader = safeSessionStorage.getItem('preloader-shown');
    if (hasShownPreloader) {
      setPreloaderComplete(true);
    } else {
      const handler = () => setPreloaderComplete(true);
      window.addEventListener('preloaderComplete', handler);
      return () => window.removeEventListener('preloaderComplete', handler);
    }
  }, []);

  useEffect(() => {
    if (!preloaderComplete || !isReady) return;
    if (reduced) {
      gsap.set(
        [
          sectionRef.current,
          antonioLineRef.current,
          kickerRef.current,
          paragraphRef.current,
          buttonsRef.current,
        ],
        { opacity: 1, y: 0 },
      );
      gsap.set(bandRef.current, { clipPath: 'inset(0 0% 0 0)' });
      return;
    }

    const timer = setTimeout(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(sectionRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
        .to(antonioLineRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0.15)
        .to(bandRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.0, ease: 'power4.inOut' }, 0.3)
        .to(
          [kickerRef.current, paragraphRef.current, buttonsRef.current],
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          '-=0.25',
        );
    }, 100);
    return () => clearTimeout(timer);
  }, [preloaderComplete, isReady, reduced]);

  // Barely-there parallax so the hero releases gently as the page scrolls.
  useGSAP(
    () => {
      if (reduced || !sectionRef.current || !innerContentRef.current) return;
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(innerContentRef.current, { y: '-10vh', ease: 'none' }),
      });
      return () => trigger.kill();
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(section, { offset: 0, duration: 1.2 });
    } else {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Immersive hover: a soft neon spotlight follows the cursor across the hero,
  // the name gently magnets toward the pointer, and a wave ripple passes
  // through the letters left to right while the glow intensifies. Single-copy
  // letters, so nothing is ever hidden. Pointer-only, skipped for reduced motion.
  const canHover = () =>
    !reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const handleSectionPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!canHover() || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // Coordinates live on the section so the base and boost glow layers share them.
    sectionRef.current.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
    sectionRef.current.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
  };

  const handleNameMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover()) return;
    const stage = nameStageRef.current;
    if (!stage) return;

    const bounds = stage.getBoundingClientRect();
    const dx = (event.clientX - bounds.left) / bounds.width - 0.5;
    const dy = (event.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(stage, { x: dx * 14, y: dy * 10, duration: 0.6, ease: 'power2.out' });
  };

  const handleNameLeave = () => {
    if (nameStageRef.current) {
      gsap.to(nameStageRef.current, { x: 0, y: 0, duration: 0.9, ease: 'power3.out' });
    }
  };

  // Each letter carries a stagger delay; hovering the name sends a wave
  // ripple through them, left to right across both lines.
  const renderLetters = (word: string, offset: number) =>
    word.split('').map((letter, i) => (
      <span
        key={`${letter}-${i}`}
        className={`name-letter${letter === '.' ? ' text-neon' : ''}`}
        style={{ '--wave-delay': `${(offset + i) * 30}ms` } as React.CSSProperties}
      >
        {letter}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      onPointerMove={handleSectionPointerMove}
      className="hero-shell relative min-h-screen overflow-hidden bg-cream pb-0 pt-20 text-ink md:pt-24"
      style={{ opacity: reduced ? 1 : 0 }}
    >
      <div aria-hidden="true" className="hero-glow" />
      <div aria-hidden="true" className="hero-glow-boost" />
      <div
        ref={innerContentRef}
        className="hero-layout relative z-10 flex min-h-[calc(100dvh-5rem)] w-full flex-col md:min-h-[calc(100dvh-6rem)]"
      >
        <div className="hero-launch flex flex-1 flex-col pt-7 sm:pt-9 md:pt-12">
          <p
            ref={kickerRef}
            className="hero-meta site-container mb-5 md:mb-8"
          >
            <span className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-gray-mid md:text-xs">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
              </span>
              Available for new projects
              <span className="hidden sm:inline">— Kerala, India</span>
            </span>
          </p>

          <div
            ref={nameStageRef}
            data-name-hover
            className="relative w-full"
            onPointerMove={handleNameMove}
            onPointerLeave={handleNameLeave}
          >
            <h1
              aria-label="Antonio Francis"
              className="hero-heading relative z-10 w-full select-none whitespace-nowrap font-display text-[clamp(2.75rem,20.5vw,6.5rem)] font-bold uppercase leading-[0.8] tracking-[-0.05em] text-ink md:text-[clamp(6.5rem,14vw,11.5rem)]"
            >
              <span
                ref={antonioLineRef}
                aria-hidden="true"
                className="site-container block"
              >
                {renderLetters(FIRST_NAME, 0)}
              </span>
              <span ref={bandRef} data-hero-band aria-hidden="true" className="mt-2 block w-full bg-ink text-white md:mt-3">
                <span className="site-container block py-2 md:py-3">
                  {renderLetters(LAST_NAME, FIRST_NAME.length + 1)}
                </span>
              </span>
            </h1>
          </div>

          <div className="site-container mt-auto grid items-end gap-5 pb-8 pt-6 sm:pb-10 md:grid-cols-12 md:gap-8 md:pt-8">
            <p
              ref={paragraphRef}
              className="hero-statement max-w-2xl text-pretty font-sans text-[clamp(1.15rem,2vw,2rem)] font-medium leading-[1.25] tracking-[-0.02em] text-charcoal md:col-span-7"
            >
              I&rsquo;m a Full Stack Developer building fast, thoughtful web and mobile products with{' '}
              <span className="underline decoration-neon decoration-2 underline-offset-8">
                clarity, character, and care
              </span>
              .
            </p>

            <div
              ref={buttonsRef}
              className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:col-span-5 md:justify-end"
            >
              <AnimatedButton
                onClick={() => handleScroll('about')}
                topText="ABOUT"
                bottomText="ME →"
                variant="primary"
              />
              <AnimatedButton
                onClick={() => handleScroll('contact')}
                topText="CONTACT"
                bottomText="LET'S TALK →"
                variant="outline"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
