# Core Module

Global system-wide setup and configuration.

## Contains:
- **config/**: Environment variables, application settings
- **database/**: Database connection, ORM setup
- **guards/**: Global authentication/authorization guards
- **interceptors/**: Global HTTP interceptors (logging, error handling, transformation)
- **filters/**: Global exception filters

## Principles:
- ✔️ One-time setup only
- ✔️ Imported globally in AppModule
- ❌ No business logic
