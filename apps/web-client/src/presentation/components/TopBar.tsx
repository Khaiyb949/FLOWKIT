'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const PRIMARY_COLORS = [
  { name: 'noir', hex: '#000' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'green', hex: '#22c55e' },
  { name: 'lime', hex: '#84cc16' },
  { name: 'orange', hex: '#f97316' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'sky', hex: '#0ea5e9' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'violet', hex: '#8b5cf6' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'fuchsia', hex: '#d946ef' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'rose', hex: '#f43f5e' },
];

export const TopBar = () => {
  const [isDark, setIsDark] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(PRIMARY_COLORS[0]);
  const [searchOpen, setSearchOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
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

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-slate-900 dark:text-white hover:opacity-80 transition">
              FileKit
            </Link>
            
            {/* Quick nav */}
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                Home
              </Link>
              <Link href="/docs" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
                Docs
              </Link>
            </nav>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
              aria-label="Search"
              title="Search (Ctrl+K)"
            >
              🔍
            </button>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
              aria-label="GitHub"
            >
              ⭐
            </a>

            {/* Discord */}
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
              aria-label="Discord"
            >
              💬
            </a>

            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
              aria-label="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Theme customizer */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-400"
                aria-label="Customize theme"
              >
                🎨
              </button>

              {/* Color picker dropdown */}
              {showColorPicker && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 min-w-max border border-slate-200 dark:border-slate-700 z-40">
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
            </div>

            {/* Version selector */}
            <div className="relative">
              <button
                onClick={() => setShowVersionMenu(!showVersionMenu)}
                className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1 text-slate-700 dark:text-slate-300"
              >
                v1.0
                <span>⬇️</span>
              </button>

              {/* Versions dropdown */}
              {showVersionMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 border border-slate-200 dark:border-slate-700 z-40">
                  <a href="#" className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
                    ✓ v1.0 (latest)
                  </a>
                  <a href="#" className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
                    v0.9
                  </a>
                  <a href="#" className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
                    v0.8
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar (expanded) */}
        {searchOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800 py-4 mb-4">
            <input
              type="text"
              placeholder="Search documentation, formats, features..."
              className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        )}
      </div>
    </header>
  );
};