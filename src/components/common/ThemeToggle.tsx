'use client';

import React, { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';

const emptySubscribe = () => () => {};

function subscribe(callback: () => void) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class') {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('storage', callback);
  return () => {
    observer.disconnect();
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('antpdf-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('antpdf-theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-surface-border bg-slate-100/50 dark:bg-white/5" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-xl border border-surface-border bg-white dark:bg-card hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600" />
      )}
    </button>
  );
}
