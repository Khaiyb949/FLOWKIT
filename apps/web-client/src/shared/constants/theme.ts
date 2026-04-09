// Theme and branding constants
export const PRIMARY_COLORS = [
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
] as const;

export const BRAND = {
  name: 'FileKit',
  tagline: 'Fast, private image processing. No server uploads. Pure browser magic.',
  version: 'v1.0',
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/filekit',
  discord: 'https://discord.gg/filekit',
  twitter: 'https://twitter.com/filekit',
};

export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Updates', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Support', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'License', href: '#' },
  ],
};

export const TOPBAR_CSS_VARIABLES = {
  '--p-scrollbar-width': '0px',
  '--border-color': '#e2e8f0',
  '--border-color-dark': '#1f2937',
  '--topbar-background': '#ffffff',
  '--topbar-background-dark': '#111827',
  '--topbar-sticky-background': 'rgba(255, 255, 255, 0.9)',
  '--topbar-sticky-background-dark': 'rgba(17, 24, 39, 0.9)',
  '--topbar-text-color': '#4b5563',
  '--topbar-text-color-dark': '#9ca3af',
  '--topbar-item-hover-bg': '#f3f4f6',
  '--topbar-item-hover-bg-dark': '#1f2937',
} as const;
