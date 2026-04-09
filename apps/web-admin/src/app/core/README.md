# Core Module

Singleton layer for application-wide services.

⚠️ **Import only once in AppComponent**

## Contains:
- **services/**: Global services (AuthService, HttpService, etc.)
- **guards/**: Route guards (AuthGuard, etc.)
- **interceptors/**: HTTP interceptors

## Principles:
- ✔️ Services should be provided with `providedIn: 'root'`
- ✔️ One-time initialization only
- ❌ Do not import in features directly (inject via constructor)
