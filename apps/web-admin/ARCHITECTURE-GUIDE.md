# WEB-ADMIN: Enterprise Angular Structure Quick Reference

> 🎯 **IMPORTANT**: This structure is **SPECIFIC to web-admin**. Do NOT apply to other apps!

## 📁 Directory Layout

```
src/app/
├── core/              ⭐ Singleton (global services, guards, interceptors)
├── shared/            ⭐ Reusable UI (NO business logic)
├── features/          ⭐ Business domains (auth, dashboard, user)
├── layout/            ⭐ Persistent UI (header, sidebar)
├── app.routes.ts      ← Main routing (lazy loading here)
└── ARCHITECTURE.ts    ← Full architecture docs
```

## 🧠 Smart vs Dumb Pattern

| Type | Location | Can Call APIs? | Can Inject Services? | Status |
|------|----------|---|---|---|
| **Smart** | `pages/` | ✔️ Yes | ✔️ Yes | Containers |
| **Dumb** | `components/` | ❌ No | ❌ Only $Input/$Output | Presentation |

## 🔑 Golden Rules

1. ✔️ Core services use `providedIn: 'root'` (singleton)
2. ✔️ Shared components have NO logic (stateless)
3. ✔️ Features don't import from other features
4. ✔️ Always use lazy loading for features
5. ✔️ Pages/ are smart, components/ are dumb

## ❌ Anti-Patterns

- ❌ Mixing business logic in shared components
- ❌ Importing from other features
- ❌ Eager loading feature modules
- ❌ All logic in one component

## 📚 Full Documentation

See `/memories/repo/web-admin-architecture.md` for complete guide.

## 🎯 Adding a Feature

1. Create `features/feature-name/pages/` → Smart components
2. Create `features/feature-name/components/` → Dumb components
3. Create `features/feature-name/services/` → Business logic
4. Create `features/feature-name/models/` → Types
5. Add lazy loading to `app.routes.ts`

---

**Questions?** Check `src/app/ARCHITECTURE.ts` or the layer-specific README files.
