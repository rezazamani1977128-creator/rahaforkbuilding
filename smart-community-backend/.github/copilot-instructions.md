# AI Agent Instructions for Smart Community Backend

## Project Overview

**Smart Community Backend** is a NestJS + Prisma API for the apartment management system. It handles authentication, charges, payments, residents, expenses, notifications, and more.

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Caching**: Redis (via cache-manager and ioredis)
- **Job queues**: Bull for async tasks
- **Authentication**: JWT + Passport (local & JWT strategies)
- **Infrastructure**: Docker Compose (PostgreSQL + Redis)

## Architecture Decisions

### Module Organization
- **Feature modules** in `src/modules/`: Each feature (charges, payments, auth, residents, etc.) is self-contained with `.module.ts`, `.controller.ts`, and services
- **Shared infrastructure** in `src/common/`: DTOs, guards, pipes, filters, decorators, utilities
- **Configuration-driven**: `src/config/` centralizes environment-based settings; injected via `@nestjs/config` and `ConfigService`
- **Prisma at the core**: All data access goes through PrismaService; no direct SQL
- **Global middleware**: Compression, helmet, cookie-parser applied in `main.ts`

### Database Schema
- **Enums define business logic**: UserRole, PaymentStatus, ChargeStatus, etc. defined in Prisma; auto-generated TypeScript enums for type safety
- **Multi-tenant awareness**: Most models include `buildingId` for multi-building support
- **Soft deletes**: Some models use `deletedAt` for audit trails
- **Relationships enforced**: Foreign keys with cascading behavior defined in schema

### Authentication & Authorization
- **JWT-based stateless auth**: Tokens issued on login; verified via Passport guard on protected routes
- **Role-based access**: UserRole enum (SUPER_ADMIN, MANAGER, BOARD_MEMBER, OWNER, TENANT) used in role guards
- **Passport strategies**: Local (username/password) for login, JWT for API endpoints
- **Decorators for guards**: Use `@UseGuards(AuthGuard('jwt'))` on controllers; custom role guards in `src/common/guards/`

## Key Patterns & Conventions

### Service Layer Patterns
1. **Dependency injection**: All dependencies (PrismaService, CacheManager, ConfigService) injected via constructor
2. **Error handling**: Throw `BadRequestException`, `UnauthorizedException`, `NotFoundException`, etc.; framework converts to HTTP responses
3. **Caching strategy**: Use `CacheManager.set(key, value, ttl)` for high-read endpoints; invalidate cache on mutations
4. **Prisma queries**:
   - Use `include` for related data (e.g., `include: { payments: true }`)
   - Use `where` with Prisma query operators (`gt`, `lt`, `in`, etc.)
   - Always handle `null` from unique queries (e.g., `findUnique` can return `null`)

### DTO & Validation
- **DTOs define input contracts**: Decorated with `@IsString()`, `@IsEmail()`, `@IsEnum()`, etc. from `class-validator`
- **Auto-validation via pipes**: `ValidationPipe` enabled globally in `main.ts`; NestJS auto-rejects invalid requests
- **Separate request/response DTOs**: Request DTOs for incoming data, response DTOs for API contracts

### Controller Patterns
1. **Route organization**: Use `@Controller('resource')` with REST conventions (`GET`, `POST`, `PUT`, `DELETE`)
2. **Route parameters**: `@Param('id')` for URL params, `@Query()` for query strings, `@Body()` for request body
3. **Custom decorators**: Check `src/common/decorators/` for `@CurrentUser()`, `@CurrentBuilding()`, etc.
4. **HTTP status codes**: Use appropriate codes (201 for create, 204 for delete, 400 for validation, 401 for auth, 403 for forbidden)

### Job Processing (Bull)
- **Queue definition**: Defined in `src/jobs/index.ts` or per-module
- **Producer**: Inject `Queue` and call `queue.add(jobData)`
- **Consumer**: Use `@Processor()` and `@Process()` decorators on job handlers
- **Retries**: Configure via Bull queue options (retries, backoff strategy)

## Critical Developer Workflows

### Development
```bash
# Start with Docker services
docker-compose up -d

# Watch mode (auto-reload on file changes)
npm run start:dev

# Debug mode (with inspector on port 9229)
npm run start:debug

# Format code (Prettier)
npm run format

# Lint code (ESLint with auto-fix)
npm run lint
```

### Testing
```bash
# Unit tests (jest config in package.json, rootDir: src)
npm run test

# Watch mode (re-run on changes)
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests (separate config: test/jest-e2e.json)
npm run test:e2e

# Debug tests
npm run test:debug
```

### Database Management
```bash
# Sync schema changes to DB
npx prisma db push

# Open Prisma Studio (GUI for data inspection/editing)
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate

# View migration history
npx prisma migrate status
```

### Production Build & Run
```bash
# Build TypeScript to dist/
npm run build

# Run compiled code
npm run start:prod
```

## Integration Points & Data Flow

1. **Authentication Flow**:
   - POST `/auth/login` validates credentials, returns JWT
   - JWT stored client-side; sent in `Authorization: Bearer <token>` header
   - `AuthGuard('jwt')` on protected routes verifies token and injects user into request

2. **Multi-Building Isolation**:
   - Most endpoints require `buildingId` (either in query/params or extracted from building scope)
   - Queries automatically filtered to current building via guards/decorators
   - Prevents data leakage between buildings

3. **Payment Processing**:
   - Charge service creates charge records and linked payment entries
   - Payment service handles state transitions (PENDING → COMPLETED)
   - External payment gateway integration via `src/integrations/payment/`
   - Notifications sent via Bull queue after payment completion

4. **Async Notification Pipeline**:
   - Mutations (new charge, payment received) enqueue notification jobs
   - Bull workers process queue; send SMS/email/in-app notifications
   - `src/modules/notifications/` handles notification state and delivery

## Conventions Specific to This Project

- **Always use TypeScript enums from Prisma**: Import from `@prisma/client` (e.g., `PaymentStatus.COMPLETED`)
- **Build scoped queries**: Use Prisma `where` with `buildingId` to prevent cross-tenant data access
- **Test pattern**: Files named `*.spec.ts` in Jest config; place tests next to implementation files
- **Config as environment source of truth**: Never hardcode values; always read from `ConfigService`
- **Cache invalidation**: On mutations (create, update, delete), invalidate related cache keys immediately
- **Error messages are user-facing**: Throw exceptions with clear, translated error strings when appropriate
- **No synchronous operations in job handlers**: Always use async/await; let Bull handle parallelism

## External Dependencies & Configuration

- **Database**: PostgreSQL 15 (docker-compose service `postgres` on port 5432)
- **Cache/Queue backend**: Redis 7 (docker-compose service `redis` on port 6379)
- **Payment gateway**: Configured in `src/config/payment.config.ts`; client credentials from env vars
- **SMS gateway**: `src/config/sms.config.ts` and `src/integrations/sms/`
- **File storage**: `src/integrations/storage/` (local or cloud)

## Quick Reference: Common Tasks

### Add a new endpoint
1. Create/update `{feature}.controller.ts`: Add method with `@Get()`, `@Post()`, etc.
2. Add service method in `{feature}.service.ts`
3. Create request DTO in `common/dto/` or module folder
4. Add Swagger decorators (`@ApiResponse()`, `@ApiOperation()`, etc.)
5. Add guard: `@UseGuards(AuthGuard('jwt'))` or custom role guard

### Add a new model
1. Edit `prisma/schema.prisma`: Add model with fields and relationships
2. Run `npx prisma db push` to sync to database
3. Prisma client auto-generates types; import from `@prisma/client`
4. Create service to access the model via `PrismaService`

### Add database migration
- Prisma Migrate: `npx prisma db push` for development (no explicit migration files needed)
- For version-controlled migrations: Use `npx prisma migrate dev --name descriptive_name`

### Add a job/queue task
1. Define job in `src/jobs/index.ts` (or per-module)
2. In service, inject `@Inject(QUEUE_NAME) private queue: Queue`
3. Call `this.queue.add(jobData)` to enqueue
4. Create processor in same/separate service with `@Processor()` and `@Process()`
