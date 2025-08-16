# Tasky - Project Management Platform

A modern, full-stack project management application built with Next.js 15, featuring task boards, team collaboration, and role-based access control.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=flat-square)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green?style=flat-square)

## ✨ Features

- 🔐 **Authentication & User Management** - Powered by Clerk with organization support
- 👥 **Role-based Access Control** - Granular permissions for team management
- 📋 **Task Board** - Kanban-style boards with drag-and-drop functionality
- 🏢 **Project Management** - Comprehensive project organization and tracking
- 📊 **Activity Logging** - Track all project activities and changes
- 📢 **Lead Management** - Capture and manage leads from funnels
- 🌓 **Dark/Light Mode** - Beautiful theme switching with system preference support
- 📱 **Responsive Design** - Works seamlessly across all devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **State Management**: Jotai + TanStack Query
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Type Safety**: TypeScript with strict mode

### Backend
- **API Layer**: tRPC for end-to-end type safety
- **Database**: Turso (libSQL) with Drizzle ORM
- **Authentication**: Clerk
- **Validation**: Zod schemas
- **Runtime**: Bun for fast package management

### Developer Experience
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier with Tailwind plugin
- **Git Hooks**: Lefthook for pre-commit validation
- **Type Checking**: TypeScript strict mode
- **Commit Linting**: Conventional commits with commitlint

## 🚀 Quick Start

### Prerequisites

- **Bun** >= 1.0.0 (recommended) or Node.js >= 18.0.0
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tasky
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   # Database (Turso)
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   
   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   # Generate database schema
   bun run db:generate
   
   # Apply migrations
   bun run db:migrate
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server with Turbo |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run preview` | Build and start production server |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Fix ESLint issues |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run format:check` | Check code formatting |
| `bun run format:write` | Format code with Prettier |
| `bun run check` | Run lint and typecheck together |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Apply database migrations |
| `bun run db:push` | Push schema changes to database |
| `bun run db:studio` | Open Drizzle Studio |

## 🏗️ Project Structure

```
tasky/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (clerk)/         # Authentication pages
│   │   ├── (landing)/       # Landing page
│   │   ├── (plataform)/     # Main application
│   │   ├── actions/         # Server actions
│   │   └── api/             # API routes
│   ├── components/          # Reusable UI components
│   ├── config/              # Configuration files
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── server/              # Server-side code
│   ├── styles/              # Global styles
│   └── trpc/                # tRPC configuration
├── drizzle/                 # Database migrations
├── public/                  # Static assets
└── ...config files
```

## 🔧 Configuration

### Environment Setup

#### Turso Database
1. Create a Turso account at [turso.tech](https://turso.tech)
2. Create a new database
3. Get your database URL and auth token
4. Add them to your `.env` file

#### Clerk Authentication
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable key and secret key
4. Configure sign-in/sign-up URLs
5. Add the keys to your `.env` file

### Database Management

The project uses Drizzle ORM with Turso (libSQL) for the database layer.

```bash
# View your database in Drizzle Studio
bun run db:studio

# Generate new migrations after schema changes
bun run db:generate

# Apply migrations to your database
bun run db:migrate

# Push schema changes directly (dev only)
bun run db:push
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI primitives. Components are located in `src/components/ui/` and can be easily customized through the `components.json` configuration.

## 🔒 Authentication & Authorization

Authentication is handled by Clerk, providing:
- User registration and login
- Organization management
- Role-based access control
- Session management
- Social login options

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🧪 Code Quality

This project maintains high code quality through:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Lefthook** for Git hooks
- **Commitlint** for conventional commits

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Docker

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment:

- Database credentials (Turso)
- Clerk authentication keys
- Application URL
- Any additional API keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`bun run check`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Turso](https://turso.tech)
- [shadcn/ui](https://ui.shadcn.com)
- [tRPC](https://trpc.io)

## 📧 Support

For support and questions, please contact the development team or create an issue in the repository.