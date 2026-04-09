# API: Enterprise NestJS Architecture Quick Reference

> 🎯 **IMPORTANT**: This structure is **SPECIFIC to API**. Do NOT apply to other apps!

## 📁 Directory Layout

```
api/src/
├── core/              ← Global setup (config, DB, guards, interceptors)
├── common/            ← Shared utilities (decorators, pipes, constants)
└── modules/           ← Business domains (Clean Architecture per module)
    ├── auth/
    │   ├── application/      (Use-cases)
    │   ├── domain/           (Entities, Interfaces)
    │   ├── infrastructure/   (Repository)
    │   └── presentation/     (Controller, DTOs)
    └── user/ (same structure)
```

## 🏗️ Clean Architecture Layers (Per Module)

| Layer | Purpose | Has Dependencies? |
|-------|---------|---|
| **Domain** | Pure business logic, entities, interfaces | ❌ NO - Independent |
| **Application** | Use-cases, business logic execution | ✔️ Domain only |
| **Infrastructure** | DB implementation, repositories | ✔️ Domain, framework |
| **Presentation** | Controllers, HTTP, DTOs | ✔️ Application only |

## 🔑 Core Principles

1. ✔️ **One direction dependency flow**: Presentation → Application → Domain ← Infrastructure
2. ✔️ **Domain has ZERO dependencies** (no framework, no DB)
3. ✔️ **Use-cases contain business logic** (not services)
4. ✔️ **Controllers call services** (never access DB directly)
5. ✔️ **Dependency Injection** for all dependencies
6. ✔️ **Repository Interface** for data access abstraction

## ❌ Anti-Patterns to AVOID

```typescript
// ❌ BAD: Logic in service
@Injectable()
export class UserService {
  createUser(data) { /* all logic */ }
}

// ✔️ GOOD: Logic in use-case
export class CreateUserUseCase {
  execute(data) { /* business logic */ }
}

// ❌ BAD: Direct DB in controller
@Post()
async create(dto) {
  return this.prisma.user.create(dto);
}

// ✔️ GOOD: Use service
@Post()
create(dto) {
  return this.userService.createUser(dto);
}
```

## 📋 Adding a New Module

1. Create `modules/feature-name/`
2. Create domain/ (Entities + Repository interfaces)
3. Create application/ (Use-cases + Application service)
4. Create infrastructure/ (Repository implementation)
5. Create presentation/ (Controllers + DTOs)
6. Create feature-name.module.ts (DI configuration)

## 🔀 Dependency Flow Example

```
HTTP Request
    ↓
Controller (presentation/)
    ↓
Application Service (application/)
    ↓
Use-Case (application/usecases)
    ↓
Domain (business logic)
    ↓
Repository Interface
    ↓
Repository Implementation (infrastructure/)
    ↓
Database (Prisma/TypeORM)
```

## 📚 Full Documentation

See `/memories/repo/api-nestjs-architecture.md` for complete guide.

## 🎯 Quick Checklist

- [ ] Module created with domain/application/infrastructure/presentation
- [ ] Domain layer has NO dependencies
- [ ] Use-cases contain business logic
- [ ] Repository implements domain interface
- [ ] Controller calls application service
- [ ] DTOs for request/response validation
- [ ] DI configuration in module

---

**Questions?** Check `src/ARCHITECTURE.ts` or layer-specific README files.
