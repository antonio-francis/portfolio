'use client';

import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Image from 'next/image';
import AnimateDescription from '@/components/ui/AnimateDescription';
import AnimatedHeading from '@/components/ui/AnimateHeading';

const About = () => {
  const headingText = 'About Me';
  const descriptionText =
    'I am a software developer driven by a passion for building clean, intuitive, and reliable digital experiences.';
  const bio =
    'I build web applications that combine carefully crafted frontend interfaces with robust backend systems. To me, software is more than code on a screen; it is about making technology feel seamless and genuinely useful to people.';

  const stats = [
    { value: 5, suffix: '+', label: 'Years of experience' },
    { value: 15, suffix: '+', label: 'Projects' },
  ];

  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.about-image-wrapper',
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-image-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        '.about-bio-para',
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-bio-para', start: 'top 85%', toggleActions: 'play none none reverse' },
        },
      );
      gsap.fromTo(
        '.about-label',
        { opacity: 0, letterSpacing: '0.5em' },
        {
          opacity: 1, letterSpacing: '0.3em', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-label', start: 'top 88%', toggleActions: 'play none none reverse' },
        },
      );

      // Count-up stats, triggered once when the strip enters the viewport.
      const statEls = sectionRef.current?.querySelectorAll<HTMLElement>('.stat-value');
      statEls?.forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const suffix = el.dataset.suffix ?? '';
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.v)}${suffix}`;
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <div className="bg-cream">
      <section
        ref={sectionRef}
        id="about"
        className="min-h-screen bg-ink text-light py-24 md:py-32 rounded-t-4xl overflow-hidden"
      >
        <div className="site-container">
          <div className="mb-10 md:mb-20">
            <AnimatedHeading
              text={headingText}
              className="text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight leading-none uppercase mb-4"
            />
            <AnimateDescription
              text={descriptionText}
              className="text-xl sm:text-2xl text-gray-soft font-sans"
            />
          </div>

          <div className="grid min-w-0 grid-cols-12 items-center gap-y-8 pb-20 lg:gap-12">

            {/* ── Image card ── */}
            <div className="col-span-12 flex min-w-0 items-center justify-center lg:col-span-5">
              <div className="about-image-wrapper group relative h-[360px] w-full max-w-full overflow-hidden rounded-2xl border border-border-subtler bg-elevated-dark transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:max-w-[350px] md:h-[480px] md:max-w-[380px] [will-change:transform,opacity]">
                <Image
                  src="/about-hands.webp"
                  alt="Stylized hands connected by threads across a star field"
                  fill
                  sizes="(max-width: 768px) 350px, 380px"
                  className="object-cover object-center"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
              </div>
            </div>

            {/* ── Text ── */}
            <div className="col-span-12 flex min-w-0 flex-col justify-center space-y-8 lg:col-span-7 lg:col-start-6">
              <span className="about-label inline-block text-center text-sm font-medium uppercase tracking-[0.3em] text-neon sm:text-base lg:text-left">
                (About Me)
              </span>
              <p className="about-bio-para text-light/85 text-xl sm:text-2xl md:text-2xl leading-relaxed font-sans">
                {bio}
              </p>

              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-border-subtle pt-8 sm:gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <span
                      className="stat-value font-display text-3xl md:text-5xl font-bold leading-none text-light"
                      data-target={stat.value}
                      data-suffix={stat.suffix}
                    >
                      0{stat.suffix}
                    </span>
                    <p className="mt-3 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-mid">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
