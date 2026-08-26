'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import AnimatedHeading from '@/components/ui/AnimateHeading';
import AnimateDescription from '@/components/ui/AnimateDescription';

interface Milestone {
  year: string;
  title: string;
  description: string;
  horizon?: boolean;
}

const MILESTONES: ReadonlyArray<Milestone> = [
  {
    year: '2022',
    title: 'Started Coding',
    description: 'Programming & problem solving',
  },
  {
    year: '2023',
    title: 'Web Development',
    description: 'Frontend, backend & APIs',
  },
  {
    year: '2024',
    title: 'Full-Stack & Systems',
    description: 'Servers, infrastructure & networking',
  },
  {
    year: '2025',
    title: 'AI & Automation',
    description: 'Intelligent applications & tooling',
  },
  {
    year: '2026',
    title: 'Blockchain & Products',
    description: 'Web3, infrastructure & product development',
  },
  {
    year: '2027',
    title: 'AI × Blockchain × Quant',
    description:
      'Full-stack development, advanced algorithmic trading & Monte Carlo research',
    horizon: true,
  },
] as const;

export default function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-roadmap-item]');
      const progress = sectionRef.current?.querySelector<HTMLElement>('[data-roadmap-progress]');

      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 });
        if (progress) gsap.set(progress, { scaleY: 1 });
        return;
      }

      if (progress) {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 68%',
              end: 'bottom 72%',
              scrub: 0.6,
            },
          },
        );
      }

      items.forEach((item) => {
        const year = item.querySelector('[data-roadmap-year]');
        const content = item.querySelector('[data-roadmap-content]');

        gsap.fromTo(
          item,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        if (year && content) {
          gsap.fromTo(
            [year, content],
            { x: (index) => (index === 0 ? -24 : 24) },
            {
              x: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 86%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      });
    },
    {
      scope: sectionRef,
      dependencies: [prefersReducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      aria-labelledby="roadmap-heading"
      className="relative overflow-hidden border-t border-border-subtle bg-ink py-24 text-light md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-neon/[0.035] blur-[110px]"
      />

      <div className="site-container relative">
        <div className="mb-16 md:mb-24">
          <AnimatedHeading
            text="Roadmap"
            className="mb-6 text-[clamp(2.8rem,7vw,6.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.055em]"
          />

          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-neon sm:text-xs">
                2022 — 2027
              </span>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <AnimateDescription
                text="A continuous path from first principles to intelligent systems, decentralized infrastructure, and quantitative research."
                className="max-w-3xl font-sans text-lg leading-relaxed text-gray-soft sm:text-xl md:text-2xl"
              />
            </div>
          </div>
        </div>

        <div className="relative" aria-label="Development journey from 2022 to 2027">
          <div
            aria-hidden="true"
            className="absolute bottom-12 left-[0.625rem] top-12 w-px overflow-hidden bg-border-subtle md:left-[29.1667%]"
          >
            <span
              data-roadmap-progress
              className="absolute inset-0 block origin-top bg-neon shadow-[0_0_18px_rgba(200,255,0,0.28)]"
            />
          </div>

          <ol className="relative">
            {MILESTONES.map((milestone, index) => (
              <li
                key={milestone.year}
                data-roadmap-item
                className="group relative grid grid-cols-1 border-t border-border-subtle/80 py-10 first:border-t-0 md:grid-cols-12 md:py-12"
              >
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-[3.55rem] z-10 flex w-5 flex-col items-center md:hidden"
                >
                  <span
                    className={`block h-5 w-5 rounded-full border transition-all duration-500 ${
                      milestone.horizon
                        ? 'border-neon bg-neon shadow-[0_0_0_6px_rgba(200,255,0,0.08),0_0_24px_rgba(200,255,0,0.3)]'
                        : 'border-border-dark bg-ink group-hover:border-neon group-hover:bg-neon'
                    }`}
                  />
                  {index < MILESTONES.length - 1 && (
                    <span className="arrow-pulse-down mt-5 font-mono text-xs text-neon/60">↓</span>
                  )}
                </div>

                <div data-roadmap-year className="pl-10 md:col-span-3 md:pl-0">
                  <div className="flex items-start gap-4 md:block">
                    <span className="font-display text-[clamp(3.4rem,7vw,7.4rem)] font-bold leading-[0.78] tracking-[-0.065em] text-light transition-colors duration-500 group-hover:text-neon">
                      {milestone.year}
                    </span>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-gray-mid md:mt-5 md:block">
                      Step {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="relative z-10 hidden flex-col items-center pt-2 md:col-span-1 md:flex"
                >
                  <span
                    className={`block h-5 w-5 rounded-full border transition-all duration-500 ${
                      milestone.horizon
                        ? 'border-neon bg-neon shadow-[0_0_0_7px_rgba(200,255,0,0.08),0_0_28px_rgba(200,255,0,0.32)]'
                        : 'border-border-dark bg-ink group-hover:border-neon group-hover:bg-neon group-hover:shadow-[0_0_0_6px_rgba(200,255,0,0.06)]'
                    }`}
                  />
                  {index < MILESTONES.length - 1 && (
                    <span className="arrow-pulse-down mt-7 font-mono text-sm text-neon/55">↓</span>
                  )}
                </div>

                <article
                  data-roadmap-content
                  className={`ml-10 rounded-2xl border p-6 transition-[background-color,border-color,transform] duration-500 group-hover:translate-x-1 md:col-span-8 md:ml-0 md:p-8 ${
                    milestone.horizon
                      ? 'border-neon/25 bg-neon/[0.045] shadow-[inset_0_1px_0_rgba(200,255,0,0.08)]'
                      : 'border-transparent bg-transparent group-hover:border-border-subtle group-hover:bg-white/[0.018]'
                  }`}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="max-w-3xl font-display text-2xl font-bold leading-[1.02] tracking-[-0.035em] text-light sm:text-3xl md:text-4xl lg:text-5xl">
                        {milestone.title}
                      </h3>
                      <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-gray-soft sm:text-lg md:text-xl">
                        {milestone.description}
                      </p>
                    </div>

                    {milestone.horizon && (
                      <span className="w-fit shrink-0 rounded-full border border-neon/35 bg-neon px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink sm:text-[10px]">
                        Next horizon
                      </span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
