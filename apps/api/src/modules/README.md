# Modules (Business Domains)

Each module represents a business domain with clean architecture pattern.

## Per-Module Structure:

```
exam/
├── application/          # Use-cases (business logic)
│   ├── usecases/
│   │   ├── create-exam.usecase.ts
│   │   ├── get-exams.usecase.ts
│   │   └── delete-exam.usecase.ts
│   └── exam.application.service.ts
│
├── domain/               # Business rules & entities
│   ├── entities/
│   │   └── exam.entity.ts
│   └── repositories/
│       └── exam.repository.interface.ts
│
├── infrastructure/       # Implementation & ORM
│   ├── exam.repository.ts     (Implements interface)
│   └── exam.model.ts          (ORM model - Prisma/TypeORM)
│
├── presentation/         # Controllers & DTOs
│   ├── controllers/
│   │   └── exam.controller.ts
│   └── dtos/
│       ├── create-exam.dto.ts
│       └── update-exam.dto.ts
│
└── exam.module.ts        # Module definition & DI config
```

## Layer Responsibilities:

### Domain
- **Entities**: Pure business objects (no ORM)
- **Repository Interface**: Abstract data access contract
- NO dependencies on framework or infrastructure

### Application
- **Use-cases**: Execute business logic
- **Services**: Orchestrate use-cases
- Depends on domain interfaces only

### Infrastructure
- **Repository Implementation**: Database operations
- **ORM Models**: Prisma/TypeORM entities
- Implements domain repository interface

### Presentation
- **Controllers**: Handle HTTP requests
- **DTOs**: Data transfer objects for API
- Calls application services

## Module Principles:
- ✔️ Self-contained & independent
- ✔️ Loose coupling between modules
- ✔️ High cohesion within module
- ✔️ Use DI for dependencies
- ❌ No circular dependencies
- ❌ No direct database access in services
