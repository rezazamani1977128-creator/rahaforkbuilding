# Backend Setup Guide - Smart Community Manager

## 🎯 Overview

This guide will help you set up a production-ready NestJS backend for the apartment management platform. The backend will be in a **separate project** from the frontend.

---

## 📋 Pre-Setup Checklist

Before starting, ensure you have:

- [x] Node.js 18+ installed
- [x] npm or yarn installed
- [x] Docker Desktop installed (for PostgreSQL and Redis)
- [x] Git installed
- [x] VS Code installed

---

## 🚀 Step 1: Create Backend Project

Open a **new terminal** (separate from your frontend project) and run these commands:

```bash
# Navigate to your projects folder (same level as smart-community-manager)
cd c:\Users\sahand\Downloads\my-building

# Create NestJS project (this will create a new folder)
npx @nestjs/cli new smart-community-backend --package-manager npm --strict

# When prompted, select:
# ❯ npm

# Navigate into the new project
cd smart-community-backend
```

**Expected Result**: A new folder `smart-community-backend` created with basic NestJS structure.

---

## 📦 Step 2: Install Dependencies

Run these commands inside the `smart-community-backend` folder:

```bash
# Core dependencies
npm install @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/swagger @nestjs/throttler @nestjs/bull @nestjs/cache-manager

# Auth & Security
npm install @prisma/client passport passport-jwt passport-local bcryptjs class-validator class-transformer

# Queue & Cache
npm install bull cache-manager cache-manager-redis-store ioredis

# Utilities
npm install uuid helmet compression swagger-ui-express cookie-parser

# Dev dependencies
npm install -D prisma @types/passport-jwt @types/passport-local @types/bcryptjs @types/bull @types/cache-manager-redis-store @types/cookie-parser

# Initialize Prisma
npx prisma init
```

**Expected Result**: 
- All packages installed successfully
- `prisma` folder created with `schema.prisma` file
- `.env` file created

**Time**: ~2-3 minutes depending on internet speed

---

## 📁 Step 3: Create Folder Structure

After completing Step 2, open the `smart-community-backend` folder in VS Code:

```bash
# Open in VS Code (run from smart-community-backend folder)
code .
```

Now you can use Copilot to create the folder structure. The AI assistant (me) will help you create all the necessary files.

**What we'll create**:
- `src/common/` - Shared utilities, guards, interceptors
- `src/config/` - Configuration files
- `src/modules/` - Feature modules (auth, users, buildings, etc.)
- `src/integrations/` - External services (SMS, payment, storage)
- `src/prisma/` - Database service
- `src/jobs/` - Background jobs

---

## 🔧 Step 4: Configuration Files

After the folder structure is created, we'll create:

1. **Configuration files** (6 files):
   - `src/config/app.config.ts`
   - `src/config/database.config.ts`
   - `src/config/jwt.config.ts`
   - `src/config/redis.config.ts`
   - `src/config/sms.config.ts`
   - `src/config/payment.config.ts`

2. **Environment files** (2 files):
   - `.env` (with real values)
   - `.env.example` (template)

3. **Docker files** (2 files):
   - `docker-compose.yml`
   - `scripts/init.sql`

4. **Prisma service** (2 files):
   - `src/prisma/prisma.service.ts`
   - `src/prisma/prisma.module.ts`

5. **Common constants** (2 files):
   - `src/common/constants/messages.constants.ts`
   - `src/common/constants/roles.constants.ts`

---

## 🐳 Step 5: Start Docker Services

After configuration files are ready:

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Check if containers are running
docker ps

# You should see:
# - building_postgres (port 5432)
# - building_redis (port 6379)
```

**Verify database connection**:
```bash
# Try to connect to PostgreSQL
docker exec -it building_postgres psql -U postgres -d building_management

# If successful, you'll see: building_management=#
# Type \q to exit
```

**Verify Redis**:
```bash
# Try to connect to Redis
docker exec -it building_redis redis-cli

# If successful, you'll see: 127.0.0.1:6379>
# Type PING, should respond PONG
# Type exit to quit
```

---

## ✅ Step 6: Verify Setup

Run the development server:

```bash
npm run start:dev
```

**Expected output**:
```
[Nest] LOG [Bootstrap] 🚀 Application is running on: http://localhost:3000
[Nest] LOG [Bootstrap] 📡 API endpoint: http://localhost:3000/api/v1
[Nest] LOG [Bootstrap] 📚 Swagger docs available at http://localhost:3000/docs
[Nest] LOG [Bootstrap] 🌍 Environment: development
[Nest] LOG [PrismaService] ✅ Database connected successfully
```

**Test endpoints**:
1. Open browser: `http://localhost:3000/docs` → Should show Swagger UI
2. Check health: `http://localhost:3000/api/v1` → Should return 404 (no routes yet, this is OK)

---

## 📊 Project Structure After Setup

```
smart-community-backend/
├── node_modules/
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── init.sql
├── src/
│   ├── common/
│   │   ├── constants/
│   │   │   ├── messages.constants.ts
│   │   │   ├── roles.constants.ts
│   │   │   └── index.ts
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   ├── pipes/
│   │   ├── dto/
│   │   ├── utils/
│   │   └── interfaces/
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   ├── sms.config.ts
│   │   ├── payment.config.ts
│   │   └── index.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── buildings/
│   │   ├── units/
│   │   ├── residents/
│   │   ├── charges/
│   │   ├── payments/
│   │   ├── expenses/
│   │   ├── fund/
│   │   ├── announcements/
│   │   ├── polls/
│   │   ├── maintenance/
│   │   ├── documents/
│   │   ├── marketplace/
│   │   ├── events/
│   │   ├── discussions/
│   │   └── notifications/
│   ├── integrations/
│   │   ├── sms/
│   │   ├── payment/
│   │   └── storage/
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   ├── prisma.module.ts
│   │   └── index.ts
│   ├── jobs/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.build.json
```

---

## 🔐 Environment Variables Explained

### Database
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/building_management?schema=public"
```
- **postgres:password** - Username:Password (change in production!)
- **localhost:5432** - Host:Port (use Docker container name in production)
- **building_management** - Database name

### JWT
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-at-least-32-chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```
- **JWT_SECRET** - Generate a strong random string (min 32 characters)
- **ACCESS_EXPIRY** - Short-lived token (15 minutes recommended)
- **REFRESH_EXPIRY** - Long-lived token for refreshing (7 days)

### Redis
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```
- Used for caching, sessions, and job queues
- No password in development (add in production)

### SMS (Kavenegar)
```env
SMS_ENABLED=false
KAVENEGAR_API_KEY=
KAVENEGAR_SENDER=
```
- Leave **disabled** until you sign up for Kavenegar
- Get API key from: https://panel.kavenegar.com/
- `SENDER` is your registered sender number (10-digit)

### Payment (Zarinpal)
```env
PAYMENT_ENABLED=false
ZARINPAL_MERCHANT_ID=
ZARINPAL_CALLBACK_URL=http://localhost:3000/api/v1/payments/verify
```
- Leave **disabled** until you sign up for Zarinpal
- Get merchant ID from: https://www.zarinpal.com/
- Callback URL must be publicly accessible in production

---

## 🚨 Common Issues & Solutions

### Issue 1: Docker containers not starting

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
```bash
# Check Docker is running
docker --version

# Start Docker Desktop, then:
npm run docker:up

# Check container logs
npm run docker:logs
```

### Issue 2: Port 3000 already in use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Option 1: Kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Change port in .env
PORT=3001
```

### Issue 3: Prisma connection failed

**Error**: `Can't reach database server at localhost:5432`

**Solution**:
```bash
# 1. Ensure PostgreSQL container is running
docker ps | grep building_postgres

# 2. Check DATABASE_URL in .env
# Should match: postgresql://postgres:password@localhost:5432/building_management

# 3. Try connecting manually
docker exec -it building_postgres psql -U postgres

# 4. Regenerate Prisma client
npx prisma generate
```

### Issue 4: Module not found errors

**Error**: `Cannot find module '@nestjs/config'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install @nestjs/config
```

---

## 📚 Useful Commands Reference

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugger
npm run build              # Build for production
npm run start:prod         # Run production build

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Create & run migration
npm run db:push            # Push schema without migration
npm run db:studio          # Open Prisma Studio (GUI)
npm run db:seed            # Seed database with test data
npm run db:reset           # Reset database (WARNING: deletes all data)

# Docker
npm run docker:up          # Start containers
npm run docker:down        # Stop containers
npm run docker:logs        # View container logs

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run end-to-end tests
npm run test:cov           # Run with coverage report

# Code Quality
npm run lint               # Lint and auto-fix
npm run format             # Format code with Prettier
```

---

## 🎯 Next Steps After Setup

1. **Phase 2**: Create complete Prisma schema
   - Define all database tables
   - Set up relations
   - Create migrations

2. **Phase 3**: Build authentication module
   - Phone + OTP authentication
   - JWT token management
   - Role-based access control

3. **Phase 4**: Create core modules
   - Buildings, Units, Residents
   - Charges and Payments
   - Expenses and Fund

4. **Phase 5**: Integrate external services
   - SMS provider (Kavenegar)
   - Payment gateway (Zarinpal)
   - File storage (Local/S3)

5. **Phase 6**: Testing & deployment
   - Unit tests
   - E2E tests
   - Production deployment

---

## 🔗 Important Links

- **NestJS Docs**: https://docs.nestjs.com/
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Redis Docs**: https://redis.io/docs/
- **Kavenegar (SMS)**: https://kavenegar.com/
- **Zarinpal (Payment)**: https://www.zarinpal.com/

---

## 📞 Support

If you encounter any issues:

1. Check the "Common Issues & Solutions" section above
2. Review NestJS documentation
3. Check Docker container logs: `npm run docker:logs`
4. Verify all environment variables in `.env`
5. Ensure all dependencies are installed: `npm install`

---

**Status**: Ready for setup! ✅

Follow Steps 1-6 in order, and you'll have a fully functional backend development environment.
