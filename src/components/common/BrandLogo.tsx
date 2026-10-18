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
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(99,102,241,0.28)] transition-transform duration-200 group-hover/icon:scale-105"
      >
        <defs>
          {/* Main Brand Squircle Gradient */}
          <linearGradient id="antpdf-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="55%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          {/* Left Wing Facet (Brilliant Light) */}
          <linearGradient id="antpdf-left-facet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EEF2FF" />
          </linearGradient>

          {/* Right Folded Paper Facet (Layered Depth) */}
          <linearGradient id="antpdf-right-facet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.85" />
          </linearGradient>

          {/* Subtle Ambient Bottom Shadow */}
          <radialGradient id="antpdf-bottom-glow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#4338CA" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Squircle Container */}
        <rect width="40" height="40" rx="10" fill="url(#antpdf-bg-gradient)" />
        <rect width="40" height="40" rx="10" fill="url(#antpdf-bottom-glow)" />

        {/* Inner Precision Border */}
        <rect
          x="0.75"
          y="0.75"
          width="38.5"
          height="38.5"
          rx="9.25"
          fill="none"
          stroke="rgba(255, 255, 255, 0.28)"
          strokeWidth="1.2"
        />

        {/* Aerodynamic Ant Antennae with Vector Precision */}
        <path
          d="M 17.5 11.5 L 12 5.5"
          stroke="#E0E7FF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="5.5" r="1.5" fill="#FFFFFF" />

        <path
          d="M 22.5 11.5 L 28 5.5"
          stroke="#E0E7FF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="28" cy="5.5" r="1.5" fill="#FFFFFF" />

        {/* Monogram A / Folded PDF Left Facet */}
        <path
          d="M 20 11 L 9.5 32 H 15.2 L 17 27 H 20 V 17 L 20 11 Z"
          fill="url(#antpdf-left-facet)"
        />

        {/* Monogram A / Folded PDF Right Overlap Facet */}
        <path
          d="M 20 11 V 17 L 20 27 H 23 L 24.8 32 H 30.5 L 20 11 Z"
          fill="url(#antpdf-right-facet)"
        />

        {/* Geometric Crossbar Bridge */}
        <polygon
          points="15.8,27 24.2,27 22.4,24 17.6,24"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* Client-side WASM Heartbeat Verification Node */}
        <circle cx="20" cy="20.5" r="1.35" fill="#10B981" />
        <circle cx="20" cy="20.5" r="2.8" fill="#10B981" opacity="0.3" />
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
