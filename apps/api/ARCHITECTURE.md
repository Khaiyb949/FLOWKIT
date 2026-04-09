# API: Enterprise NestJS Architecture (Senior Level)

📌 **IMPORTANT**: This structure is **SPECIFIC to API app**  
Do NOT apply this to other apps (web-admin uses Angular, web-client uses Next.js)

## 🏗️ Architecture Overview

**Modular + Dependency Injection + Clean Architecture**

```
core/                       ← Global system setup
├─ config/                  (Environment, app settings)
├─ database/                (ORM setup)
├─ guards/                  (Auth guards)
├─ interceptors/            (Logging, error handling)
└─ filters/                 (Global exception handling)

common/                     ← Shared utilities
├─ decorators/              (Custom decorators)
├─ pipes/                   (Validation pipes)
├─ utils/                   (Helper functions)
└─ constants/               (Constants)

modules/                    ← Business domains (Clean Architecture per module)
├─ auth/
│  ├─ application/          (Use-cases)
│  ├─ domain/               (Entities + Repository interfaces)
│  ├─ infrastructure/       (Repository implementation)
│  ├─ presentation/         (Controllers + DTOs)
│  └─ auth.module.ts
│
└─ user/
   ├─ application/
   ├─ domain/
   ├─ infrastructure/
   ├─ presentation/
   └─ user.module.ts
```

## 🧠 Clean Architecture Layers (Per Module)

### 1. DOMAIN (Pure Business Logic)
- Entities: Business objects
- Repository Interfaces: Abstract data access

### 2. APPLICATION (Use-Cases)
- Use-Cases: Business logic execution
- Application Service: Orchestrate use-cases

### 3. INFRASTRUCTURE (Implementation)
- Repository: Implements domain interface
- ORM Models: Database models

### 4. PRESENTATION (API)
- Controllers: HTTP endpoints
- DTOs: Request/Response models

## 🔑 Golden Rules (MUST FOLLOW)

1️⃣ Domain ← Has NO dependencies (pure business logic)  
2️⃣ Application ← Depends only on domain  
3️⃣ Infrastructure ← Implements domain interfaces  
4️⃣ Presentation ← Calls application services  
5️⃣ Controllers ← Do NOT access database directly  
6️⃣ Services ← Are orchestrators, not business logic  
7️⃣ Use Dependency Injection for all dependencies
 *
 * ❌ ANTI-PATTERNS (NEVER DO THIS)
 * ============================================================================
 *
 *  ❌ Putting business logic directly in services
 *     // BAD
 *     @Injectable()
 *     export class UserService {
 *       createUser(data) { /* all logic here */ }
 *     }
 *
 *  ✔️ GOOD - Use-cases contain logic
 *     @Injectable()
 *     export class CreateUserUseCase {
 *       execute(data) { /* business logic */ }
 *     }
 *
 *  ❌ Controllers directly accessing database
 *     // BAD
 *     @Get()
 *     async getUsers() {
 *       return this.prisma.user.findMany(); // Direct DB access!
 *     }
 *
 *  ✔️ GOOD - Call service/use-case
 *     @Get()
 *     async getUsers() {
 *       return this.userService.getAllUsers(); // Via service
 *     }
 *
 *  ❌ Circular dependencies between modules
 *     // BAD: user module depends on auth, auth depends on user
 *
 *  ✔️ GOOD - Use shared module or message queue
 *
 *  ❌ Business logic in presentation layer
 *     // BAD
 *     @Post()
 *     @Controller()
 *     async login(dto) {
 *       const encrypted = await crypto.encrypt(dto.password);
 *       // More business logic...
 *     }
 *
 *  ✔️ GOOD - Delegate to use-case
 *     @Post()
 *     login(dto) {
 *       return this.authService.login(dto.email, dto.password);
 *     }
 *
 * 📋 PER-MODULE STRUCTURE CHECKLIST
 * ============================================================================
 *
 *  When creating a new module (e.g., exam):
 *
 *  1. Domain Layer
 *     ✔️ exam/domain/entities/exam.entity.ts
 *        - Pure business object
 *        - No ORM decorators
 *        - Has business methods
 *
 *     ✔️ exam/domain/repositories/exam.repository.interface.ts
 *        - Abstract interface
 *        - Defines data access contract
 *        - NO implementation
 *
 *  2. Application Layer
 *     ✔️ exam/application/usecases/create-exam.usecase.ts
 *        - Contains business logic
 *        - Uses repository interface
 *        - No DB knowledge
 *
 *     ✔️ exam/application/usecases/get-exams.usecase.ts
 *     ✔️ exam/application/usecases/delete-exam.usecase.ts
 *
 *     ✔️ exam/application/exam.application.service.ts
 *        - Orchestrates use-cases
 *        - Provided to DI
 *
 *  3. Infrastructure Layer
 *     ✔️ exam/infrastructure/exam.repository.ts
 *        - Implements repository interface
 *        - Contains DB queries
 *        - Uses Prisma/TypeORM
 *
 *  4. Presentation Layer
 *     ✔️ exam/presentation/dtos/
 *        - create-exam.dto.ts
 *        - update-exam.dto.ts
 *        - Validation decorators
 *
 *     ✔️ exam/presentation/controllers/exam.controller.ts
 *        - HTTP endpoints
 *        - Calls application service
 *        - Validates input
 *
 *  5. Module Registration
 *     ✔️ exam/exam.module.ts
 *        - Import dependencies
 *        - Provide DI config
 *        - Register controllers
 *
 * 🔀 DEPENDENCY FLOW (One Direction)
 * ============================================================================
 *
 *  Controller (HTTP Request)
 *     ↓
 *  Application Service (Orchestrate)
 *     ↓
 *  Use-Case (Business Logic)
 *     ↓
 *  Domain Interface (Repository Interface)
 *     ↓
 *  Infrastructure (Repository Implementation)
 *     ↓
 *  Database (Prisma/TypeORM)
 *
 *  ✔️ Always ONE direction
 *  ❌ NEVER depend on layers BELOW your layer
 *
 * 💉 DEPENDENCY INJECTION PATTERN
 * ============================================================================
 *
 *  // Module DI Configuration
 *  @Module({
 *    providers: [
 *      {
 *        provide: 'IExamRepository',      // Provide interface
 *        useClass: ExamRepository,        // Use implementation
 *      },
 *      {
 *        provide: ExamApplicationService,
 *        useFactory: (repo: IExamRepository) =>
 *          new ExamApplicationService(repo),
 *        inject: ['IExamRepository'],
 *      },
 *    ],
 *    exports: [ExamApplicationService],
 *  })
 *  export class ExamModule {}
 *
 *  ✔️ Benefits:
 *  - Easy to mock in tests
 *  - Easy to swap implementations
 *  - No circular dependencies
 *
 * 🎯 TESTING STRATEGY
 * ============================================================================
 *
 *  Unit Test (Use-Case)
 *  ✔️ Easy - Mock repository, test logic
 *
 *  ```typescript
 *  describe('CreateExamUseCase', () => {
 *    it('should create exam', async () => {
 *      const mockRepo = { create: jest.fn() };
 *      const useCase = new CreateExamUseCase(mockRepo);
 *      await useCase.execute(data);
 *      expect(mockRepo.create).toHaveBeenCalled();
 *    });
 *  });
 *  ```
 *
 *  Integration Test (Module)
 *  ✔️ Fair - Test full module with real DB
 *
 *  E2E Test (Controller)
 *  ✔️ Harder - Test full HTTP flow
 *

## 📊 Comparison: Basic vs Enterprise

| Type | Small Project | Large Project |
|------|---|---|
| **Pattern** | Controller → Service → DB | Controller → Service → Use-Case → Repository → DB |
| **Speed to Build** | Fast | Slower |
| **Testing** | Hard | Easy |
| **Maintainability** | Hard | Easy |
| **Scalability** | Hard | Easy |

## 🚀 Migration Path

Starting with basic architecture:
1. Follow basic structure (Service + Controller + DB)
2. When project grows, introduce use-cases gradually
3. Extract business logic from services into use-cases
4. Create domain layer with entities
5. Create repository interfaces

## 📚 Summary

**Architecture Pattern**: Modular + DI + Clean Architecture  
**Scope**: API app ONLY - do not apply to web-admin or web-client  
**Layers**: Domain → Application → Infrastructure → Presentation  
**Benefits**: 
- ✔️ Easy to unit test with mocks
- ✔️ Clear separation of concerns
- ✔️ Easy to add new features
- ✔️ Easy to swap implementations (ORM, DB, etc.)
