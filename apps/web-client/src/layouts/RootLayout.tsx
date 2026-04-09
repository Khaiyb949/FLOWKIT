'use client';

import React, { useEffect, useState } from 'react';
import { TopBar, Footer } from '../shared/components';

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout Component
 * 
 * Main layout wrapper for the entire application.
 * Handles:
 * - Dark mode theme management
 * - Hydration safety for client-side state
 * - TopBar and Footer positioning
 */
export function RootLayout({ children }: RootLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from system preference or localStorage
  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedDarkMode = localStorage?.getItem('darkMode');
    const isDark = savedDarkMode ? savedDarkMode === 'true' : prefersDark;
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Fallback render during hydration
  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50" style={{ backgroundImage: "url('/images/bg.png')", backgroundSize: 'auto', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
        <TopBar />
        <main className="flex-1 w-full pt-16">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors" style={{ backgroundImage: "url('/images/bg.png')", backgroundSize: 'auto', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <TopBar />
      <main className="flex-1 w-full pt-16">{children}</main>
      <Footer />
    </div>
  );
}
