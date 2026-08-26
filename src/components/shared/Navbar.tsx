'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useTransitionState } from 'next-transition-router';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import AnimatedLink from '@/components/ui/AnimateLink';
import { useHandleLinkClick } from '@/lib/navigation';

import { safeSessionStorage } from '@/utils/storage';

interface AnimatedHamburgerProps {
  isOpen: boolean;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({ isOpen }) => {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const hasInitRef = useRef<boolean>(false);

  useEffect(() => {
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    if (!l1 || !l2) return;

    if (!hasInitRef.current) {
      hasInitRef.current = true;
      if (isOpen) {
        gsap.set(l1, { y: 0, rotation: 45 });
        gsap.set(l2, { y: 0, rotation: -45 });
      } else {
        gsap.set(l1, { y: -5, rotation: 0 });
        gsap.set(l2, { y: 5, rotation: 0 });
      }
      return;
    }

    if (isOpen) {
      gsap.to(l1, { y: 0, rotation: 45, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { y: 0, rotation: -45, duration: 0.35, ease: 'power3.inOut' });
    } else {
      gsap.to(l1, { y: -5, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
      gsap.to(l2, { y: 5, rotation: 0, duration: 0.35, ease: 'power3.inOut' });
    }
  }, [isOpen]);

  return (
    <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
      <span ref={line1Ref} className="absolute h-px w-full rounded-full bg-white transition-colors group-hover:bg-black" style={{ transformOrigin: 'center' }} />
      <span ref={line2Ref} className="absolute h-px w-full rounded-full bg-white transition-colors group-hover:bg-black" style={{ transformOrigin: 'center' }} />
    </div>
  );
};

interface LinkItem {
  name: string;
  href: string;
  menuOnly?: boolean;
}

interface FullscreenMenuProps {
  isOpen: boolean;
  isTransitioning: boolean;
  onClose: () => void;
  handleLinkClick: (href: string) => void;
  links: LinkItem[];
}

const FullscreenMenu: React.FC<FullscreenMenuProps> = ({ isOpen, isTransitioning, onClose, handleLinkClick, links }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const linksRef = useRef<(HTMLDivElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBotRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen && !isTransitioning) {
      if (tlRef.current) tlRef.current.kill();
      gsap.set(panelRef.current, { display: 'flex' });
      gsap.set(overlayRef.current, { display: 'block' });

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      tl.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power4.out' }, '-=0.2');
      tl.fromTo(lineTopRef.current, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.3, ease: 'power3.out' }, '-=0.2');
      tl.fromTo(lineBotRef.current, { scaleX: 0, transformOrigin: 'right' }, { scaleX: 1, duration: 0.3, ease: 'power3.out' }, '-=0.25');

      linksRef.current.forEach((link, i) => {
        if (!link) return;
        const chars = link.querySelectorAll('.char');
        tl.fromTo(
          chars, { y: '120%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.35, stagger: 0.015, ease: 'power4.out' },
          `-=${i === 0 ? 0.1 : 0.3}`,
        );
      });

      tl.fromTo(metaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.22');
    } else if (!isOpen) {
      if (tlRef.current) tlRef.current.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          if (panelRef.current) gsap.set(panelRef.current, { display: 'none' });
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' });
        },
      });
      tlRef.current = tl;

      const allChars = linksRef.current.flatMap((link) =>
        link ? Array.from(link.querySelectorAll('.char')) : [],
      );

      tl.to(metaRef.current, { y: 12, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0);
      tl.to(
        allChars,
        { y: '-110%', opacity: 0, duration: 0.16, stagger: 0.004, ease: 'power3.in' },
        0,
      );
      tl.to(
        [lineTopRef.current, lineBotRef.current],
        { scaleX: 0, duration: 0.16, ease: 'power2.in' },
        0.04,
      );
      tl.to(panelRef.current, { x: '100%', duration: 0.32, ease: 'power4.inOut' }, 0.08);
      tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, 0.08);
    }
  }, [isOpen, isTransitioning]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div ref={menuRef}>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9980] bg-black/60 backdrop-blur-sm"
        style={{ display: 'none' }}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        id="fullscreen-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        className="fixed right-0 top-0 z-[9981] flex h-dvh w-full flex-col overflow-hidden bg-surface md:w-[min(680px,72vw)]"
        style={{ display: 'none', transform: 'translateX(100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={lineTopRef}
          className="absolute left-0 right-0 top-20 h-px bg-border-subtler"
          style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
        />
        <div
          ref={lineBotRef}
          className="absolute bottom-[136px] left-0 right-0 h-px bg-border-subtler md:bottom-[104px]"
          style={{ transformOrigin: 'right', transform: 'scaleX(0)' }}
        />

        <div className="flex h-20 items-center justify-between border-b border-elevated-dark px-6 sm:px-10">
          <span className="text-gray-mid font-mono text-xs tracking-widest uppercase">Navigation</span>
        </div>

        <nav className="absolute inset-x-0 bottom-[136px] top-20 flex flex-col justify-center gap-1 overflow-y-auto overscroll-contain px-6 py-4 sm:px-10 md:bottom-[104px] md:px-16">
          {links.map((link, i) => (
            <div
              key={link.href}
              ref={(el) => { linksRef.current[i] = el; }}
              className="overflow-hidden py-1.5"
            >
              <button
                data-menu-link
                onClick={() => handleLinkClick(link.href)}
                className="animate-link-row group flex items-center gap-3 text-left sm:gap-4 md:gap-6"
              >
                <span className="text-gray-mid font-mono text-xs md:text-sm transition-colors duration-300 group-hover:text-neon">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex overflow-hidden font-display text-[clamp(2.25rem,12vw,4rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em] text-cream transition-colors duration-300 hover:text-neon md:text-[clamp(3.25rem,6vw,4.75rem)]">
                  {link.name.split('').map((char, ci) => (
                    <span
                      key={ci}
                      className="char inline-block"
                      style={{ transform: 'translateY(120%)', opacity: 0 }}
                    >
                      {char === ' ' ? ' ' : char}
                    </span>
                  ))}
                </span>
                <span className="text-neon text-2xl md:text-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  →
                </span>
              </button>
            </div>
          ))}
        </nav>

        <div
          ref={metaRef}
          className="absolute bottom-0 left-0 right-0 flex h-[136px] flex-col items-start justify-center gap-3 px-6 py-4 sm:px-10 md:h-[104px] md:flex-row md:items-end md:justify-between md:gap-0 md:px-16 md:py-6"
          style={{ opacity: 0 }}
        >
          <div className="space-y-1 text-left">
            <p className="text-gray-mid font-mono text-xs uppercase tracking-widest mb-2">Contact</p>
            <a
              href="mailto:info@tonix.in"
              className="break-all text-sm text-muted transition-colors duration-200 hover:text-white"
            >
              info@tonix.in
            </a>
          </div>

          <div className="flex gap-6 justify-start">
            {[
              { label: 'GitHub', href: 'https://github.com/antonio-francis' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-mid hover:text-cream text-xs font-mono uppercase tracking-widest transition-colors duration-200 underline-offset-4 hover:underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


interface NavbarProps {
  hamburgerOnly?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hamburgerOnly = false }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLElement>(null);
  const linksContainerRef = useRef<HTMLUListElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [preloaderComplete, setPreloaderComplete] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [shouldHideNav, setShouldHideNav] = useState<boolean>(false);
  const lenis = useLenis();
  const { stage, isReady } = useTransitionState();
  const isTransitioning = stage === 'entering' || stage === 'leaving';

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

  // Initial scroll position check — determines whether nav should hide on mount
  useEffect(() => {
    if (hamburgerOnly) return;
    const checkScrollPosition = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setShouldHideNav(scrollY > 80);
    };
    checkScrollPosition();
    const timer = setTimeout(checkScrollPosition, 50);
    return () => clearTimeout(timer);
  }, [hamburgerOnly, isReady]);

  // Set initial positions based on scroll state
  useEffect(() => {
    if (hamburgerOnly) {
      if (hamburgerRef.current) {
        gsap.set(hamburgerRef.current, { opacity: 1, scale: 1 });
      }
      return;
    }

    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    const logo = logoRef.current;
    const linksContainer = linksContainerRef.current;
    if (!nav || !hamburger) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollProgress = Math.min(scrollY / 80, 1);

    gsap.set(nav, { y: -120 * scrollProgress, opacity: 1 });
    if (mobileNav) gsap.set(mobileNav, { y: -190 * scrollProgress, opacity: 1 });

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      gsap.set(hamburger, { opacity: 1, scale: 1 });
    } else {
      gsap.set(hamburger, {
        opacity: scrollProgress,
        scale: 0.82 + scrollProgress * 0.18,
        pointerEvents: scrollProgress > 0.65 ? 'auto' : 'none',
      });
    }

    if (logo) gsap.set(logo, { x: shouldHideNav ? 0 : -50, opacity: shouldHideNav ? 1 : 0 });
    if (linksContainer) {
      const links = linksContainer.querySelectorAll('li');
      gsap.set(links, { y: shouldHideNav ? 0 : -20, opacity: shouldHideNav ? 1 : 0 });
    }
  }, [hamburgerOnly, shouldHideNav]);

  // Entry animation after preloader + page transition
  useEffect(() => {
    if (hamburgerOnly) return;
    if (!preloaderComplete || !isReady || isTransitioning) return;
    if (hasAnimated) return;
    if (shouldHideNav) {
      setHasAnimated(true);
      return;
    }

    const logo = logoRef.current;
    const linksContainer = linksContainerRef.current;

    const timer = setTimeout(() => {
      if (logo) {
        gsap.to(logo, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 });
      }
      if (linksContainer) {
        const links = linksContainer.querySelectorAll('li');
        gsap.to(links, { y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'power2.out', delay: 0.5 });
      }
      setHasAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [preloaderComplete, isReady, hasAnimated, hamburgerOnly, isTransitioning, shouldHideNav]);

  // Morph the full navbar into the compact menu control as the page leaves the top.
  useEffect(() => {
    if (hamburgerOnly) return;
    if (!hasAnimated || isTransitioning) return;

    const nav = navRef.current;
    const hamburger = hamburgerRef.current;
    const mobileNav = mobileNavRef.current;
    if (!nav || !hamburger) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: '+=80',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(nav, { y: -120 * progress, duration: 0 });
        if (mobileNav) gsap.to(mobileNav, { y: -190 * progress, duration: 0 });

        if (window.innerWidth < 768) {
          gsap.set(hamburger, { opacity: 1, scale: 1, pointerEvents: 'auto' });
        } else {
          gsap.set(hamburger, {
            opacity: progress,
            scale: 0.82 + progress * 0.18,
            pointerEvents: progress > 0.65 ? 'auto' : 'none',
          });
        }
      },
    });

    const syncResponsiveState = () => {
      const progress = Math.min((window.scrollY || window.pageYOffset) / 80, 1);
      if (window.innerWidth < 768) {
        gsap.set(hamburger, { opacity: 1, scale: 1, pointerEvents: 'auto' });
      } else {
        gsap.set(hamburger, {
          opacity: progress,
          scale: 0.82 + progress * 0.18,
          pointerEvents: progress > 0.65 ? 'auto' : 'none',
        });
      }
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', syncResponsiveState);

    return () => {
      scrollTrigger.kill();
      window.removeEventListener('resize', syncResponsiveState);
    };
  }, [hasAnimated, hamburgerOnly, isTransitioning]);

  useEffect(() => {
    if (!lenis) return;
    if (isMenuOpen) {
      lenis.stop();
    } else {
      lenis.start();
      ScrollTrigger.refresh();
    }
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
      lenis.start();
    };
  }, [isMenuOpen, lenis]);

  useEffect(() => {
    if (isTransitioning && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isTransitioning, isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const handleLinkClick = useHandleLinkClick(setIsMenuOpen);

  const links = [
    { name: 'Home', href: '/#top', menuOnly: true },
    { name: 'About Me', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Roadmap', href: '/#roadmap' },
    { name: 'Contact', href: '/#contact' },
  ];

  const navStyle: React.CSSProperties = {
    opacity: isTransitioning ? 0 : 1,
    pointerEvents: isTransitioning ? 'none' : 'auto',
    transition: 'opacity 0.5s ease-in-out',
  };

  return (
    <>
      {!hamburgerOnly && (
        <nav
          ref={navRef}
          className="fixed z-50 hidden w-full border-b border-black/[0.07] bg-cream/80 py-5 backdrop-blur-2xl md:block"
          style={navStyle}
        >
          <div className="site-container flex items-center justify-between">
            <strong
              ref={logoRef}
              className="font-sans text-lg font-semibold tracking-[-0.03em] text-ink"
            >
              Tonix
            </strong>
            <ul
              ref={linksContainerRef}
              className="flex gap-7 font-sans text-xs font-medium uppercase tracking-[0.14em] text-gray-mid"
            >
              {links.filter((l) => !l.menuOnly).map((link) => (
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
        </nav>
      )}

      {!hamburgerOnly && (
        <nav
          ref={mobileNavRef}
          className="mobile-navbar fixed z-50 w-full border-b border-black/[0.07] bg-cream/80 backdrop-blur-2xl md:hidden"
          style={navStyle}
        >
          <div className="site-container flex h-20 items-center justify-between">
            <strong className="font-sans text-lg font-semibold tracking-[-0.03em] text-ink">
              Tonix
            </strong>
            <div className="w-10 h-10" />
          </div>
        </nav>
      )}

      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className={`group fixed right-5 top-5 z-[9982] flex h-10 w-10 items-center justify-center rounded-full border border-white/10
          bg-black/80 shadow-[0_4px_20px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:border-neon/45 hover:bg-neon hover:text-black sm:right-8 md:right-6 md:top-6 md:h-12 md:w-12`}
        style={
          hamburgerOnly
            ? { opacity: 1, scale: 1 }
            : {
                opacity: isTransitioning ? 0 : 0,
                scale: isTransitioning ? 0 : 0,
                pointerEvents: isTransitioning ? 'none' : 'auto',
                transition: 'opacity 0.5s ease-in-out',
              }
        }
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        aria-controls="fullscreen-menu"
      >
        <AnimatedHamburger isOpen={isMenuOpen} />
      </button>

      <FullscreenMenu
        isOpen={isMenuOpen && !isTransitioning}
        isTransitioning={isTransitioning}
        onClose={() => setIsMenuOpen(false)}
        handleLinkClick={handleLinkClick}
        links={links}
      />
    </>
  );
};

export default Navbar;
