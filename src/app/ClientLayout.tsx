'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import GlobalPreloader, { INTRO_DURATION_MS } from '@/components/shared/GlobalPreloader';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import CustomCursor from '@/components/shared/CustomCursor';
import Providers from './providers';

declare global {
  interface Window {
    __preloaderDone?: boolean;
  }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const doneRef = useRef(false);

  const complete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    window.__preloaderDone = true;
    document.body.classList.remove('preloader-active');
    document.body.classList.add('preloader-complete');
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
  }, []);

  useEffect(() => {
    window.__preloaderDone = false;
    document.body.classList.add('preloader-active');

    const timer = window.setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0);
      // Guarantee the reveal even if the exit animation is throttled or stalls.
      window.setTimeout(complete, 700);
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [complete]);

  return (
    <>
      <div className="film-grain pointer-events-none" />

      <AnimatePresence mode="wait" onExitComplete={complete}>
        {isLoading && <GlobalPreloader key="preloader" />}
      </AnimatePresence>

      <div className="page-overlay" />
      <CustomCursor />
      <WhatsAppButton />
      <SmoothScrollProvider>
        <Providers>{children}</Providers>
      </SmoothScrollProvider>
    </>
  );
}
