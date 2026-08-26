'use client';

import React, { useState, useEffect, useRef } from 'react';
import AnimatedLink from '@/components/ui/AnimateLink';
import { FaArrowUp, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter, FaDiscord } from 'react-icons/fa6';
import { useHandleLinkClick } from '@/lib/navigation';
import { useLenis } from '@/components/providers/SmoothScrollProvider';

const SOCIALS = [
  { label: 'WhatsApp', handle: '+91 95262 35753', href: 'https://wa.me/919526235753', Icon: FaWhatsapp, color: '#25D366' },
  { label: 'Instagram', handle: '@t6nix', href: 'https://instagram.com/t6nix', Icon: FaInstagram, color: '#E4405F' },
  { label: 'X', handle: '@anto6io', href: 'https://x.com/anto6io', Icon: FaXTwitter, color: '#000000' },
  { label: 'Discord', handle: 't6nix', href: 'https://discord.com/app', Icon: FaDiscord, color: '#5865F2' },
  { label: 'GitHub', handle: 'antonio-francis', href: 'https://github.com/antonio-francis', Icon: FaGithub, color: '#181717' },
];


const Footer = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    setIsMounted(true);
    let interval: NodeJS.Timeout | number | undefined;

    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
      });
      setCurrentTime(timeString);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          updateTime();
          interval = setInterval(updateTime, 30000);
        } else {
          if (interval) { clearInterval(interval); interval = undefined; }
        }
      },
      { threshold: 0 },
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleLinkClick = useHandleLinkClick();
  const links = [
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Roadmap', href: '/#roadmap' },
    { name: 'Contact', href: '/#contact' },
  ];

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="relative z-30 border-t border-footer-border bg-cream py-14 md:py-20">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 border-b border-footer-border pb-12 md:grid-cols-3 md:gap-8 md:pb-16 lg:grid-cols-12">
          <div className="md:col-span-3 lg:col-span-5">
            <p className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] text-ink">
              Antonio Francis<span className="text-neon">.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm md:text-base leading-relaxed text-gray-mid">
              Full stack developer crafting fast, thoughtful web and mobile products.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-mid mb-4 md:mb-6">
              Menu
            </h3>
            <ul className="flex flex-col gap-3 text-warm text-sm font-sans font-medium">
              {links.map((link) => (
                <AnimatedLink key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                  >
                    {link.name}
                  </a>
                </AnimatedLink>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-mid mb-4 md:mb-6">
              Socials
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {SOCIALS.map(({ label, handle, href, Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label}: ${handle}`}
                  title={`${label}: ${handle}`}
                  style={{ '--brand': color } as React.CSSProperties}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-footer-border bg-footer-bg text-[var(--brand)] transition-colors duration-300 hover:border-transparent hover:bg-[var(--brand)] hover:text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-mid mb-4 md:mb-6">
              Local Time
            </h3>
            <p className="text-sm font-medium tracking-wide text-ink">
              {isMounted && currentTime ? `${currentTime} · Kerala, India` : '—'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-mid">
            © 2026 Antonio Francis — All rights reserved
          </p>
          <button
            onClick={scrollToTop}
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-footer-border bg-footer-bg text-warm transition-colors duration-300 hover:border-neon hover:text-ink hover:bg-neon focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
