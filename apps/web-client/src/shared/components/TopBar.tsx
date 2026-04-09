'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRIMARY_COLORS, BRAND, SOCIAL_LINKS, TOPBAR_CSS_VARIABLES } from '../constants/theme';
// @ts-ignore - CSS module import
import './TopBar.css';

export const TopBar = () => {
  const [isDark, setIsDark] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [primaryColor, setPrimaryColor] = useState<typeof PRIMARY_COLORS[number]>(PRIMARY_COLORS[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Apply theme to document and set CSS variables
  useEffect(() => {
    setMounted(true);
    
    // Set CSS custom properties
    Object.entries(TOPBAR_CSS_VARIABLES).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Apply primary color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor.hex);
  }, [primaryColor]);

  // Handle scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) {
    return (
      <header className={`layout-topbar ${isDark ? 'dark' : ''}`}>
        <div className="layout-topbar-inner">
          <div className="layout-topbar-logo-container">
            <Link href="/" className="layout-topbar-logo">
              {BRAND.name}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`layout-topbar ${isDark ? 'dark' : ''} ${isSticky ? 'layout-topbar-sticky' : ''}`}>
      <div className="layout-topbar-inner">
        {/* Logo */}
        <div className="layout-topbar-logo-container">
          <Link href="/" className="layout-topbar-logo">
            {BRAND.name}
          </Link>
        </div>

        {/* Items */}
        <ul className="topbar-items">
          {/* Search */}
          <li>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="layout-topbar-icon"
              aria-label="Search"
              title="Search"
            >
              🔍
            </button>
          </li>

          {/* GitHub */}
          <li>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="layout-topbar-icon"
              aria-label="GitHub"
            >
              ⭐
            </a>
          </li>

          {/* Discord */}
          <li>
            <a
              href={SOCIAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="layout-topbar-icon"
              aria-label="Discord"
            >
              💬
            </a>
          </li>

          {/* Dark mode toggle */}
          <li>
            <button
              onClick={() => setIsDark(!isDark)}
              className="layout-topbar-icon"
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </li>

          {/* Theme customizer */}
          <li className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="layout-topbar-icon"
              aria-label="Customize theme"
            >
              🎨
            </button>

            {/* Color picker dropdown */}
            {showColorPicker && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 min-w-max border border-slate-200 dark:border-slate-700 z-50">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase">Primary Color</p>
                <div className="grid grid-cols-6 gap-2">
                  {PRIMARY_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setPrimaryColor(color);
                        setShowColorPicker(false);
                      }}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 ${
                        primaryColor.name === color.name ? 'border-slate-400 dark:border-slate-600 ring-2 ring-offset-2 dark:ring-offset-slate-800' : 'border-slate-300 dark:border-slate-600'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </li>

          {/* Version selector */}
          <li className="relative">
            <button
              onClick={() => setShowVersionMenu(!showVersionMenu)}
              className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 text-slate-700 dark:text-slate-300"
            >
              {BRAND.version}
              <span>⬇️</span>
            </button>

            {/* Versions dropdown */}
            {showVersionMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 border border-slate-200 dark:border-slate-700 z-50">
                <a href="#" className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
                  ✓ {BRAND.version} (latest)
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
                  v0.9
                </a>
                <a href="#" className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
                  v0.8
                </a>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Search bar (expanded) */}
      {searchOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
          <input
            type="text"
            placeholder="Search documentation, formats, features..."
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      )}
    </header>
  );
};
