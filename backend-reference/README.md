# Backend Reference Files

This folder contains all the configuration files and setup instructions for the NestJS backend.

## How to Use These Files

### Step 1: Create the Backend Project

Open a **separate terminal** and run:

```bash
# Navigate to your projects folder
cd c:\Users\sahand\Downloads\my-building

# Create NestJS project
npx @nestjs/cli new smart-community-backend --package-manager npm --strict

# Navigate into project
cd smart-community-backend

# Install dependencies
npm install @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/swagger @nestjs/throttler @nestjs/bull @nestjs/cache-manager @prisma/client passport passport-jwt passport-local bcryptjs class-validator class-transformer bull cache-manager cache-manager-redis-store ioredis uuid helmet compression swagger-ui-express cookie-parser

npm install -D prisma @types/passport-jwt @types/passport-local @types/bcryptjs @types/bull @types/cache-manager-redis-store @types/cookie-parser

# Initialize Prisma
npx prisma init
```

### Step 2: Copy Configuration Files

After creating the project, copy files from this `backend-reference` folder to your `smart-community-backend` folder:

- Copy `config/*` → `smart-community-backend/src/config/`
- Copy `prisma/*` → `smart-community-backend/src/prisma/`
- Copy `common/*` → `smart-community-backend/src/common/`
- Copy `.env.example` → `smart-community-backend/.env`
- Copy `docker-compose.yml` → `smart-community-backend/`
- Copy scripts → `smart-community-backend/scripts/`

### Step 3: Update Core Files

Replace these files in your NestJS project:
- `app.module.ts`
- `main.ts`
- Update `package.json` scripts

### Step 4: Start Development

```bash
# Start Docker
cd smart-community-backend
npm run docker:up

# Start dev server
npm run start:dev
```

## File Structure

```
backend-reference/
├── README.md                          # This file
├── SETUP_INSTRUCTIONS.md              # Detailed setup guide
├── .env.example                       # Environment template
├── docker-compose.yml                 # Docker services
├── package.json.reference             # Additional scripts
├── app.module.ts.reference            # AppModule code
├── main.ts.reference                  # Bootstrap code
├── scripts/
│   └── init.sql                       # Database init
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   ├── redis.config.ts
│   ├── sms.config.ts
│   ├── payment.config.ts
│   └── index.ts
├── prisma/
│   ├── prisma.service.ts
│   ├── prisma.module.ts
│   └── index.ts
└── common/
    └── constants/
        ├── messages.constants.ts
        ├── roles.constants.ts
        └── index.ts
```

## Next Steps

1. Follow the setup instructions in SETUP_INSTRUCTIONS.md
2. Run the commands to create the NestJS project
3. Copy these reference files to your project
4. Start Docker and verify connection
5. Begin Phase 2: Create Prisma schema

## Questions?

See BACKEND_SETUP_GUIDE.md in the parent folder for troubleshooting.
