# AI Agent Instructions for Smart Community Manager

## Project Overview

**Smart Community Manager** is a full-stack apartment/building management system with separate React frontend and NestJS backend repos. The system supports dual-role workflows for managers and residents, with multi-building support and feature-based phases.

- **Frontend** (`smart-community-manager`): React 18 + TypeScript + Vite + shadcn/ui
- **Backend** (`smart-community-backend`): NestJS + Prisma + PostgreSQL + Redis
- **Database**: PostgreSQL (via Docker), Redis for caching/queues
- **State**: React Context (Auth, Theme, Demo mode)

## Architecture Decisions

### Frontend Structure (`src/`)
- **Components by domain**: `announcements/`, `payments/`, `charges/`, `voting/`, etc.—each folder groups UI components for a feature area
- **Shared UI components**: `ui/` contains shadcn/ui primitives
- **Contexts**: `AuthContext` manages user/building selection with reducer pattern; `DemoContext` handles demo mode; `ThemeContext` for dark/light modes
- **Layout distinction**: `DashboardLayout` (manager), `ResidentLayout` (resident), routes wrap these with `ProtectedRoute`/`ManagerRoute`/`ResidentRoute`
- **Pages reflect roles**: `/manager/*` vs `/resident/*` split logic by user role; no shared page logic between roles
- **Mock data**: `data/mockData.ts` for demo/development

### Backend Architecture
- **Modular by domain**: `src/modules/` contains feature modules (charges, payments, residents, auth, etc.) following NestJS convention
- **Database schema**: `prisma/schema.prisma` defines enums (UserRole, PaymentStatus, etc.) and models; auto-generates Prisma client
- **Config-driven**: `src/config/` centralizes app, database, JWT, payment, Redis, SMS config
- **Infrastructure**: Docker Compose provides PostgreSQL and Redis; services accessed via config injection
- **Authentication**: JWT + Passport (local + JWT strategies); role-based guards in modules

## Key Patterns & Conventions

### Frontend Patterns
1. **Form handling**: React Hook Form + Zod validation (`@hookform/resolvers`)
2. **Data fetching**: TanStack React Query (`@tanstack/react-query`) with QueryClient
3. **UI library**: shadcn/ui (Radix UI primitives + Tailwind); icons from Lucide React
4. **Role-based rendering**: Check `currentBuilding.role` from `useAuth()` to conditionally render manager vs resident views
5. **Toast notifications**: Use `@/components/ui/sonner` (Sonner) or `@/components/ui/toaster` (shadcn)

### Backend Patterns
1. **Module structure**: Each feature has a `.module.ts`, `.controller.ts`, and services; use `@nestjs/swagger` decorators for API docs
2. **DTO validation**: Use `class-validator` decorators on DTOs for auto-validation via pipes
3. **Prisma queries**: Access via `PrismaService` (injected); use `@prisma/client` enums for type safety
4. **Error handling**: Custom exception filters in `src/common/filters/`; throw specific HTTP exceptions
5. **Caching**: Use `CacheManager` for Redis caching; configure TTL in module metadata
6. **Job queues**: Bull queues for async tasks; configured in `src/jobs/`

## Critical Developer Workflows

### Frontend (smart-community-manager)
```bash
# Development
npm run dev              # Start Vite dev server (port 5173)
npm run build           # Production build to dist/
npm run build:dev       # Dev build (sourcemaps enabled)
npm run lint            # ESLint check + fix

# No tests configured; linting is the QA gate
```

### Backend (smart-community-backend)
```bash
# Development
npm run start:dev       # NestJS watch mode (port 3000)
npm run start:debug     # Debug mode with inspector

# Production
npm run build           # Compile to dist/
npm run start:prod      # Run compiled code

# Testing & Quality
npm run test            # Jest unit tests (rootDir: src, pattern: *.spec.ts)
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
npm run test:e2e        # E2E tests
npm run lint            # ESLint + fix

# Database
npx prisma db push     # Sync schema to database
npx prisma studio     # Open Prisma GUI
```

### Docker Orchestration
```bash
# In smart-community-backend/
docker-compose up -d    # Start PostgreSQL + Redis
docker-compose down     # Stop services
# Services: postgres:5432, redis:6379 (healthchecks included)
```

## Integration Points & Data Flow

1. **Authentication Flow**:
   - Frontend `AuthContext` maintains user + buildings state
   - Login endpoint returns JWT token (stored client-side)
   - `useAuth()` hook provides `currentBuilding.role` for route/permission logic
   - Backend validates JWT via Passport guard on protected routes

2. **Multi-Building Support**:
   - Users can belong to multiple buildings; `currentBuilding` tracks active selection
   - All API requests implicitly scoped to `currentBuilding.id`
   - Manager role governs access to management features

3. **Cross-Module Communication**:
   - Charges → Payments: Charges service creates payment records; Payment module handles fulfillment
   - Residents → Charges: Residents see charges linked to their unit
   - Notifications sent via Bull queues after payments, requests, etc.

## Conventions Specific to This Project

- **Enums in Prisma**: Define all business enums (UserRole, PaymentStatus, etc.) in schema; Prisma generates TypeScript enums automatically
- **Role-based guards**: Backend uses NestJS guards; frontend uses route wrappers (`ManagerRoute`, `ResidentRoute`)
- **Demo mode**: Frontend DemoContext can mock API responses for UI testing without backend
- **Feature phases**: README documents phase-by-phase rollout (Phase 1 core, Phase 5 residents, Phase 6 marketplace); code may have feature flags or incomplete modules
- **Bilingual UI**: UI text includes Farsi (Persian) alongside English; check `README.md` for context
- **No shared page logic**: Manager and resident pages are separate (not shared containers with conditional logic)—reduces coupling

## External Dependencies & Configuration

- **Payment processors**: Configured in `src/config/payment.config.ts` and `src/integrations/payment/`
- **SMS gateway**: `src/integrations/sms/` with config in `src/config/sms.config.ts`
- **Storage**: `src/integrations/storage/` for file uploads
- **Redis caching**: Managed by `cache-manager`; TTLs set per feature in module metadata
- **Throttling**: Global rate limiting via `@nestjs/throttler` (configured in `app.module.ts`)

## Quick Reference: File Location Examples

- Add a new component: `src/components/{feature}/*.tsx`
- Add a new page: `src/pages/{role}/{Feature}Page.tsx` (e.g., `pages/resident/MyChargesPage.tsx`)
- Add a new backend module: `src/modules/{feature}/{feature}.module.ts`, `.controller.ts`, `.service.ts`
- Create DTOs: `src/common/dto/` or module-specific subfolder
- DB migrations: Edit `prisma/schema.prisma`, then `npx prisma db push`
- Add route protection: Wrap route in `<ManagerRoute>` or `<ResidentRoute>` in `App.tsx`
