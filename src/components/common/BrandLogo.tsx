'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showWordmark?: boolean;
  asLink?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 26, text: 'text-sm', badge: 'text-[9px] px-1 py-0.2' },
  md: { icon: 32, text: 'text-base', badge: 'text-[10px] px-1.5 py-0.5' },
  lg: { icon: 40, text: 'text-xl', badge: 'text-[11px] px-2 py-0.5' },
  xl: { icon: 52, text: 'text-2xl', badge: 'text-xs px-2.5 py-1' },
};

/**
 * Architectural Brandmark for AnTPDF
 * Blends a high-tech geometric 'A' monogram, precision origami folded document facets,
 * sleek aerospace antennae, and an emerald client-side WASM core.
 */
export function BrandLogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none group/icon ${className}`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(99,102,241,0.32)] transition-transform duration-200 group-hover/icon:scale-105"
      >
        <defs>
          {/* Main Brand Squircle Gradient */}
          <linearGradient id="antpdf-ant-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="55%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          {/* Ant Body Highlight */}
          <linearGradient id="antpdf-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EEF2FF" />
          </linearGradient>
        </defs>

        {/* Base Squircle Container */}
        <rect width="40" height="40" rx="10" fill="url(#antpdf-ant-bg)" />

        {/* Inner Precision Border */}
        <rect
          x="0.75"
          y="0.75"
          width="38.5"
          height="38.5"
          rx="9.25"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1.2"
        />

        {/* The 6 Dynamic Ant Legs */}
        {/* Front Legs */}
        <path
          d="M 17.5 16 L 12 12.5 L 8 9"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 22.5 16 L 28 12.5 L 32 9"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Middle Legs */}
        <path
          d="M 17 17.5 L 10 18 L 6.5 21.5"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 23 17.5 L 30 18 L 33.5 21.5"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Rear Legs */}
        <path
          d="M 17.5 19 L 11 23 L 8.5 29.5"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 22.5 19 L 29 23 L 31.5 29.5"
          stroke="#FFFFFF"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Curved Expressive Antennae with Glowing Nodes */}
        <path
          d="M 18.5 9.5 C 16.5 6 13 4.8 9.5 5.5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="9.5" cy="5.5" r="1.3" fill="#FFFFFF" />

        <path
          d="M 21.5 9.5 C 23.5 6 27 4.8 30.5 5.5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="30.5" cy="5.5" r="1.3" fill="#FFFFFF" />

        {/* Ant Mandibles */}
        <path d="M 18.5 7.5 L 17 5.8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 21.5 7.5 L 23 5.8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Ant Head */}
        <path
          d="M 16.8 10.5 C 16.8 8.2 18.2 6.8 20 6.8 C 21.8 6.8 23.2 8.2 23.2 10.5 C 23.2 12.8 21.8 14 20 14 C 18.2 14 16.8 12.8 16.8 10.5 Z"
          fill="url(#antpdf-body-grad)"
        />

        {/* Ant Thorax */}
        <ellipse cx="20" cy="17.2" rx="3.3" ry="2.7" fill="url(#antpdf-body-grad)" />

        {/* Emerald WASM Core on Thorax */}
        <circle cx="20" cy="17.2" r="1.1" fill="#10B981" />

        {/* Ant Petiole (Thin Waist Node) */}
        <circle cx="20" cy="20.8" r="1.4" fill="url(#antpdf-body-grad)" />

        {/* Ant Abdomen (Large Iconic Gaster) */}
        <path
          d="M 20 22.5 C 16.2 22.5 14.2 25.5 14.2 29 C 14.2 32.8 16.8 35.2 20 35.2 C 23.2 35.2 25.8 32.8 25.8 29 C 25.8 25.5 23.8 22.5 20 22.5 Z"
          fill="url(#antpdf-body-grad)"
        />

        {/* Document Page / Abdominal Segment Grooves */}
        <path
          d="M 16.2 27.5 Q 20 29.2 23.8 27.5"
          stroke="#4F46E5"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 16.8 30.5 Q 20 32.2 23.2 30.5"
          stroke="#4F46E5"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function BrandLogo({
  size = 'md',
  showBadge = true,
  showWordmark = true,
  asLink = false,
  className = '',
}: BrandLogoProps) {
  const config = SIZE_MAP[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Brand Icon */}
      <BrandLogoIcon size={config.icon} />

      {/* Brand Identity Wordmark */}
      {showWordmark && (
        <div className="flex items-center gap-2">
          <div className="flex items-baseline">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${config.text}`}
            >
              AnT
            </span>
            <span
              className={`font-black tracking-tight text-indigo-600 dark:text-indigo-400 ${config.text}`}
            >
              PDF
            </span>
          </div>

          {showBadge && (
            <span
              className={`font-mono uppercase tracking-wider rounded-md font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 ${config.badge}`}
            >
              STUDIO
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex focus:outline-none focus:ring-2 focus:ring-indigo-500/30 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
