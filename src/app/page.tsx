/**
 * Portfolio - Antonio Francis
 * Full Stack Web Developer | Kerala, India
 */


'use client';

import { gsap } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import HomeBanner from '@/components/sections/HomeBanner';
import About from '@/components/sections/About';
import MarqueeStrip from '@/components/sections/MarqueeStrip';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null);
  const reuniteRef = useRef<HTMLDivElement>(null);
  const techStackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Thin reading-progress bar across the top of the viewport.
  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const home = homeRef.current;
    const reunite = reuniteRef.current;
    const techStack = techStackRef.current;
    const projects = document.querySelector('section');
    if (!home || !reunite || !techStack || !projects) return;

    const ctx = gsap.context(() => {

      gsap.set(reunite, {
        zIndex: 2,
      });
      gsap.set(home, {
        zIndex: 1,
        y: 0,
        opacity: 1,
        pointerEvents: 'auto',
      });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: reunite,
            start: 'top bottom',
            end: 'top 10%',
            scrub: 1.2,
            onLeave: () => {
              home.style.pointerEvents = 'none';
            },
            onEnterBack: () => {
              home.style.pointerEvents = 'auto';
            },
          },
        })
        .to(home, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          pointerEvents: 'none',
          ease: 'power2.out',
        });
    });

    return () => ctx.revert();
  }, []);
  return (
    <>
      <div
        ref={progressRef}
        aria-hidden="true"
        className="scroll-progress-bar fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-neon"
        style={{ transform: 'scaleX(0)' }}
      />
      <Navbar />
      <main className="relative">
        <section ref={homeRef} className="sticky left-0 top-0 h-dvh w-full">
          <HomeBanner />
        </section>
        <div id="about-section-wrapper" className="relative bg-black">
          <div ref={reuniteRef} className="relative z-10 bg-ink min-h-screen overflow-hidden">
            <About techStackRef={techStackRef} />
          </div>
        </div>
        <MarqueeStrip />
        <section className="relative z-25 bg-black">
          <Contact />
        </section>
        <Footer />
      </main>
    </>
  );
}
