'use client';

import React from 'react';

interface SectionDividerProps {
  variant: 'kinetic' | 'number';
  label?: string;
  index?: number;
}

export default function SectionDivider({ variant, label = '', index = 1 }: SectionDividerProps) {
  void variant;

  return (
    <div
      className="relative w-full overflow-hidden border-t border-border-subtle bg-surface select-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-display font-bold leading-none"
          style={{
            fontSize: 'clamp(8rem, 25vw, 18rem)',
            color: 'rgba(247,246,243,0.03)',
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          {String(index).padStart(2, '0')}
        </span>
      </div>
      <div className="site-container relative z-10 flex items-center justify-between py-7 md:py-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-soft/40">
          Section {String(index).padStart(2, '0')}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-soft/60">
          {label}
        </span>
      </div>
    </div>
  );
}
