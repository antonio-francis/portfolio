'use client';

import React, { useRef, ElementType } from 'react';

interface AnimatedButtonProps {
  onClick?: (e: React.MouseEvent<any>) => void;
  topText: React.ReactNode;
  bottomText: React.ReactNode;
  variant?: 'light' | 'primary' | 'outline' | 'dark';
  className?: string;
  as?: ElementType;
  disabled?: boolean;
  [key: string]: any;
}

const VARIANT_STYLES: Record<
  string,
  { button: string }
> = {
  light: {
    button: 'bg-transparent text-elevated border border-black/15 hover:border-black/35',
  },
  primary: {
    button: 'bg-neon text-ink hover:bg-forest-light',
  },
  outline: {
    button: 'bg-transparent text-ink border border-ink/20 hover:border-ink/60 hover:bg-ink/[0.03]',
  },
  dark: {
    button: 'bg-ink text-white border border-ink hover:bg-[#26262a]',
  },
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  topText,
  bottomText,
  variant = 'primary',
  className = '',
  as = 'button',
  disabled = false,
  ...props
}) => {
  const buttonRef = useRef<any>(null);
  const Component = as;
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;

  return (
    <div className="pointer-events-auto inline-flex">
      <Component
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        className={`group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-7 text-xs font-semibold tracking-[0.06em] outline-none transition-colors duration-300 sm:px-8 md:h-13 md:text-[13px] ${styles.button} ${className}`}
        {...props}
      >
        <span className="flex h-full items-center justify-center transition-transform duration-400 ease-in-out group-hover:-translate-y-full">
          {topText}
        </span>
        <span className="absolute inset-0 top-full flex h-full items-center justify-center transition-transform duration-400 ease-in-out group-hover:-translate-y-full">
          {bottomText}
        </span>
      </Component>
    </div>
  );
};

export default AnimatedButton;
