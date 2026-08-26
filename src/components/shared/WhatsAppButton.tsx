'use client';

import { useEffect, useState } from 'react';

const WA_NUMBER = '919526235753';

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    // Show after a short delay so it doesn't compete with the preloader
    const t = setTimeout(() => setVisible(true), 2500);
    const updatePosition = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  const isShown = visible && !pastHero;

  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=Hi%20Antonio%2C%20I%20would%20like%20to%20ask%20you%20something`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact via WhatsApp"
      className="group fixed bottom-4 right-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:bottom-7 sm:right-8 md:bottom-24 md:right-6"
      style={{
        zIndex: 9999,
        opacity: isShown ? 1 : 0,
        transform: isShown ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(20px)',
        transition: 'opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents: isShown ? 'auto' : 'none',
      }}
    >
      {/* Pulse ring */}
      <span
        className="hidden sm:block"
        style={{
          position: 'absolute',
          inset: '-6px',
          borderRadius: '50%',
          background: 'rgba(200, 255, 0, 0.2)',
          animation: 'wa-pulse 2.2s ease-out infinite',
          pointerEvents: 'none',
        }}
      />
      {/* Button */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#c8ff00',
          boxShadow: '0 4px 24px rgba(200,255,0,0.28), 0 2px 8px rgba(0,0,0,0.14)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
          zIndex: 1,
        }}
        className="h-12 w-12 group-hover:scale-105 group-hover:shadow-[0_6px_28px_rgba(200,255,0,0.4)] sm:h-[58px] sm:w-[58px]"
      >
        {/* Official WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-7 w-7 sm:h-8 sm:w-8"
          fill="none"
        >
          <path
            fill="#050505"
            d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 10L4 44l10.3-2.7C17 42.9 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36.5c-3.2 0-6.2-.9-8.8-2.5l-.6-.4-6.1 1.6 1.6-5.9-.4-.6C7.9 30.1 7 27.1 7 24 7 14.6 14.6 7 24 7s17 7.6 17 17-7.6 17-17 17z"
          />
          <path
            fill="#050505"
            d="M34.5 28.9c-.5-.3-3-1.5-3.5-1.7-.5-.2-.8-.3-1.2.3-.3.5-1.3 1.7-1.6 2-.3.4-.6.4-1.1.1-.5-.3-2.1-.8-4-2.5-1.5-1.3-2.5-3-2.8-3.5-.3-.5 0-.8.2-1 .2-.2.5-.6.7-.9.2-.3.3-.5.5-.8.2-.3.1-.6 0-.9-.1-.3-1.2-2.8-1.6-3.9-.4-1-.8-1-1.2-1h-1c-.3 0-.9.1-1.4.7-.5.5-1.9 1.8-1.9 4.4 0 2.6 1.9 5.1 2.2 5.5.3.4 3.8 5.8 9.2 8.1 1.3.5 2.3.9 3 1.1 1.3.4 2.4.3 3.3.2 1-.1 3-1.2 3.5-2.4.4-1.2.4-2.2.3-2.4-.2-.3-.5-.4-1-.6z"
          />
        </svg>
      </span>

      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </a>
  );
}
