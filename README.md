# Decouple

A calm separation workspace for people in England and Wales navigating separation, divorce, child arrangements, and financial disentanglement.

## Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Claude (primary), with provider abstraction for Gemini/OpenAI
- **Payments**: Stripe (stub mode until configured)
- **Analytics**: PostHog (dev mode logs to console)
- **Hosting**: Vercel + Supabase Cloud

## Getting started

```bash
npm install
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```
src/
  app/              # Next.js App Router pages
  components/
    ui/             # Design system primitives
    layout/         # Shell, navigation, layout
    shared/         # Reusable composite components
  lib/
    supabase/       # Supabase client configuration
    ai/             # AI provider orchestration
    analytics/      # PostHog integration
    stripe/         # Stripe stub/integration
  types/            # Shared TypeScript types
  constants/        # Enums, config values
  hooks/            # Custom React hooks
  utils/            # General utilities
docs/               # Project documentation
tests/              # Test files
```

## Documentation

- `docs/sprint-0/decisions.md` — Sprint 0 decisions register
- `docs/sprint-0/v0-platform-plan.md` — V0 platform foundation plan
- `docs/v1/` — V1 concept specs, research, and wireframes
