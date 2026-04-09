# Features

Business domain modules - each folder is an independent feature.

## Structure per feature (e.g., auth/):
```
auth/
├── pages/              # Smart components (container)
│   └── login-page/
├── components/         # Dumb components (UI)
│   └── login-form/
├── services/           # Business logic
│   └── auth.service.ts
├── models/             # Interfaces & types
│   └── auth.model.ts
└── auth-routing.module.ts
```

## Principles:
- ✔️ Self-contained feature modules
- ✔️ Lazy loading via routing
- ✔️ Smart components in pages/
- ✔️ Dumb components in components/
- ❌ Do not import from other features directly
- ❌ Use shared module for common components
