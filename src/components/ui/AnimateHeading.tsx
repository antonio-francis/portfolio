'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ text, className = '' }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: '24px' });

    const triggerInstance = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: '0px',
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });

    return () => {
      triggerInstance.kill();
    };
  }, [text]);

  return (
    <div className="mb-8">
      <div className="overflow-hidden">
        <h2 ref={headingRef} className={`font-display font-bold uppercase tracking-tighter ${className}`}>
          {text}
        </h2>
      </div>
      <div className="mt-1.5 h-0.5 w-10 bg-neon" />
    </div>
  );
};

export default AnimatedHeading;
