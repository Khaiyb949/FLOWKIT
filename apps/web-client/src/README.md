# Web Client Project Structure

Clean, maintainable folder structure organized by type/purpose.

## Directory Layout

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root HTML layout
│   ├── page.tsx                 # Home page
│   ├── global.css               # Global styles (Tailwind + custom CSS)
│   ├── page.module.css          # Page-specific styles
│   ├── api/                     # API routes
│   └── [locale]/                # Locale-based routing
│
├── layouts/                      # Page layouts
│   ├── RootLayout.tsx           # Main app layout wrapper
│   └── index.ts                 # Exports
│
├── shared/                       # Shared utilities & components
│   ├── components/              # UI & layout components
│   │   ├── TopBar.tsx           # Navigation bar with theme toggle
│   │   ├── Footer.tsx           # Footer component
│   │   └── index.ts             # Exports
│   │
│   ├── constants/               # Constants & configuration
│   │   ├── theme.ts             # Theme colors, branding, links
│   │   └── index.ts             # Exports
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── index.ts             # Exports
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # Exports
│   │
│   └── utils/                   # Utility functions
│       └── index.ts             # Exports
│
└── presentation/                # Feature-specific components
    └── components/
        ├── image-converter/     # Image converter feature
        │   ├── ImageControls.tsx
        │   ├── ImageDropzone.tsx
        │   ├── ImageQueue.tsx
        │   └── index.ts
        └── index.ts
```

## Folder Purpose

| Folder | Purpose | When to Use |
|--------|---------|------------|
| `app/` | Next.js routing & pages | Page structure, layout, API routes |
| `layouts/` | Page layouts | Full-page layout wrappers (no business logic) |
| `shared/components/` | Reusable UI components | Components used across multiple features |
| `shared/constants/` | Constants & config | Theme, branding, links, static data |
| `shared/hooks/` | Custom React hooks | Reusable state/logic hooks |
| `shared/types/` | TypeScript definitions | Global types, interfaces, enums |
| `shared/utils/` | Utility functions | Helper functions, formatters, validators |
| `presentation/` | Feature components | Feature-specific UI (image converter, etc) |

## Import Path Aliases

```typescript
// Use configured path aliases (see tsconfig.json)
import { RootLayout } from '@/layouts';
import { TopBar, Footer } from '@/shared/components';
import { BRAND, PRIMARY_COLORS } from '@/shared/constants';
import { useImageUpload } from '@/shared/hooks';
import type { ImageFormat } from '@/shared/types';
import { formatBytes } from '@/shared/utils';
import { ImageControls } from '@/presentation/components/image-converter';
```

## Adding New Features

### New Page/Section
1. Create feature folder in `src/presentation/components/{feature-name}/`
2. Create `{Feature}.tsx` main component
3. Export from `index.ts`
4. Import in relevant page

### New Shared Component
1. Create in `src/shared/components/`
2. Keep it generic, reusable
3. Export from `index.ts`

### New Utility
1. Create in `src/shared/utils/`
2. Add type definitions if needed
3. Export from `index.ts`

## Best Practices

✅ **Do:**
- Keep shared components generic and reusable
- Use constants for repeated values
- Group related files by feature
- Use barrel exports (index.ts files)
- Follow component naming: PascalCase

❌ **Don't:**
- Put business logic in layout components
- Create deeply nested folder structures
- Mix shared utilities with feature-specific code
- Hardcode values (use constants instead)
- Leave unused files

## Quick Reference

```typescript
// Shared components (used everywhere)
src/shared/components/TopBar.tsx
src/shared/components/Footer.tsx

// Feature components (image-converter specific)
src/presentation/components/image-converter/ImageControls.tsx

// Constants & config
src/shared/constants/theme.ts

// Utilities
src/shared/utils/helpers.ts

// Types
src/shared/types/models.ts

// Hooks
src/shared/hooks/useImageUpload.ts
```
