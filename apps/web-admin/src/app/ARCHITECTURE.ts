
/**
 * ============================================================================
 *  WEB-ADMIN: ENTERPRISE ANGULAR ARCHITECTURE (SENIOR LEVEL)
 * ============================================================================
 *
 * 📌 IMPORTANT: This structure is SPECIFIC to web-admin app
 *    Do NOT apply this to other apps (web-client uses different pattern)
 *
 * 🏗️ ARCHITECTURE OVERVIEW
 * ============================================================================
 *
 *  Core Layer (singleton)
 *  ├─ Global services (AuthService, HttpService)
 *  ├─ Route guards (AuthGuard)
 *  └─ HTTP interceptors
 *
 *  Shared Layer (reusable UI)
 *  ├─ Dumb components (Button, Table, Modal)
 *  ├─ Custom directives
 *  └─ Custom pipes
 *
 *  Features Layer (business domains - lazy-loaded)
 *  ├─ auth/
 *  │  ├─ pages/          → Smart components (LoginPageComponent)
 *  │  ├─ components/     → Dumb components (LoginFormComponent)
 *  │  ├─ services/       → Feature logic (AuthFeatureService)
 *  │  ├─ models/         → Types (User, LoginRequest)
 *  │  └─ README.md
 *  │
 *  ├─ dashboard/
 *  │  ├─ pages/
 *  │  ├─ components/
 *  │  ├─ services/
 *  │  ├─ models/
 *  │  └─ README.md
 *  │
 *  └─ user/
 *     ├─ pages/
 *     ├─ components/
 *     ├─ services/
 *     ├─ models/
 *     └─ README.md
 *
 *  Layout Layer (persistent UI)
 *  ├─ header.component.ts      → Top navigation
 *  ├─ sidebar.component.ts     → Left navigation
 *  └─ layout.component.ts      → Main wrapper
 *
 * 🧠 SMART VS DUMB COMPONENTS
 * ============================================================================
 *
 *  SMART (pages/)           │  DUMB (components/)
 *  ─────────────────────────┼──────────────────────────
 *  Calls services/APIs      │  No service calls
 *  Manages state            │  Receives data via @Input()
 *  Handles events           │  Emits events via @Output()
 *  Example:                 │  Example:
 *  LoginPageComponent       │  LoginFormComponent
 *
 * 🔑 GOLDEN RULES
 * ============================================================================
 *
 *  1️⃣  Core services only imported ONCE globally (providedIn: 'root')
 *  2️⃣  Shared components are stateless - NO business logic!
 *  3️⃣  Features are self-contained - no importing from other features
 *  4️⃣  Use lazy loading for all features
 *  5️⃣  Pages/ have smart containers, components/ are dumb UI
 *  6️⃣  Every feature needs: pages/, components/, services/, models/
 *
 * ❌ ANTI-PATTERNS (NEVER DO THIS)
 * ============================================================================
 *
 *  ❌ Mixing logic in shared components
 *  ❌ Importing features from other features
 *  ❌ Not lazy loading feature modules
 *  ❌ All logic in one component (no smart/dumb split)
 *  ❌ Services in shared module
 *
 * 📝 ROUTING & LAZY LOADING
 * ============================================================================
 *
 *  // ✔️ GOOD: Lazy loading
 *  {
 *    path: 'users',
 *    loadChildren: () => import('./features/user/user.module')
 *      .then(m => m.UserModule)
 *  }
 *
 *  // ✔️ GOOD: Protected routes
 *  {
 *    path: '',
 *    component: LayoutMainComponent,
 *    canActivate: [authGuard],
 *    children: [...]
 *  }
 *
 * 🎯 ADDING A NEW FEATURE CHECKLIST
 * ============================================================================
 *
 *  1. Create features/feature-name/ folder
 *  2. Create pages/ subfolder with smart components
 *  3. Create components/ subfolder with dumb components
 *  4. Create services/ subfolder with business logic
 *  5. Create models/ subfolder with interfaces
 *  6. Create feature-name.module.ts exporting everything
 *  7. Create feature-name-routing.module.ts with routes
 *  8. Add lazy loading in app.routes.ts
 *  9. Use shared components for UI (don't recreate)
 *  10. Document with README.md
 *
 * 📚 DOCUMENTATION REFERENCES
 * ============================================================================
 *
 *  - /memories/repo/web-admin-architecture.md  (Full guide)
 *  - src/app/core/README.md                     (Core layer rules)
 *  - src/app/shared/README.md                   (Shared layer rules)
 *  - src/app/features/README.md                 (Features layer rules)
 *  - src/app/layout/README.md                   (Layout guidelines)
 *
 * ============================================================================
 */

export const ARCHITECTURE_DOCS = {
  description: 'Enterprise Angular Architecture for web-admin',
  pattern: 'Feature-based + Core + Shared + Smart/Dumb + Lazy Loading',
  version: '1.0.0',
  lastUpdated: '2024',
  scope: 'web-admin ONLY - do not apply to other apps'
};
