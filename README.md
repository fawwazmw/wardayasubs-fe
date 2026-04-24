# wardayasubs — Frontend

Subscription tracking and spending analytics SPA built with **Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Feature Components](#feature-components)
- [UI Primitives](#ui-primitives)
- [Pages](#pages)
- [Services](#services)
- [Contexts](#contexts)
- [Dashboard Tabs](#dashboard-tabs)
- [Theme System](#theme-system)
- [Routing](#routing)
- [Testing](#testing)
- [npm Scripts](#npm-scripts)
- [Deployment](#deployment)
- [Path Aliases](#path-aliases)

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Build Tool | Vite | 8.x |
| UI Library | React | 19.x |
| Language | TypeScript | 6.x |
| Styling | Tailwind CSS | 4.x |
| Routing | React Router | 7.x |
| Server State | TanStack React Query | 5.x |
| Charts | Recharts | 3.x |
| HTTP Client | Axios | 1.x |
| Icons | Lucide React | 1.x |
| Toasts | Sonner | 2.x |
| Forms | React Hook Form | 7.x |
| Variant API | class-variance-authority (CVA) | 0.7.x |
| Class Merging | tailwind-merge + clsx | latest |
| Slot Primitive | @radix-ui/react-slot | 1.x |
| Unit Testing | Vitest + React Testing Library | 4.x / 16.x |
| E2E Testing | Playwright (Chromium) | 1.x |
| Linting | ESLint + typescript-eslint | 9.x |

---

## Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- Backend API running on `http://localhost:3001` (for local development)

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.development

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

The Vite dev server proxies all `/api` requests to `http://localhost:3001`, so the backend must be running locally for full functionality.

---

## Environment Variables

Vite auto-loads `.env.development` during `npm run dev` and `.env.production` during `npm run build`.

| Variable | Dev Default | Production | Description |
|---|---|---|---|
| `VITE_API_URL` | `/api` | Full backend URL (e.g. `https://api.example.com/api`) | Base URL for all API requests |

**`.env.development`** — uses `/api` so the Vite proxy forwards requests to the local backend:

```env
VITE_API_URL=/api
```

**`.env.production`** — set the full backend URL in your hosting platform's environment settings (e.g. Vercel dashboard) or directly in the file:

```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## Project Structure

```
frontend/
├── e2e/                          # Playwright E2E tests
│   ├── auth.spec.ts              #   Auth flow tests (7 tests)
│   ├── dashboard.spec.ts         #   Dashboard navigation tests (7 tests)
│   ├── subscriptions.spec.ts     #   Subscription management tests (3 tests)
│   └── helpers.ts                #   Shared E2E utilities
├── public/                       # Static assets
├── src/
│   ├── __tests__/                # Unit / component tests
│   │   ├── setup.ts              #   Vitest setup (jsdom, jest-dom matchers)
│   │   └── components/
│   │       ├── Layout.test.tsx           # 5 tests
│   │       ├── ProtectedRoute.test.tsx   # 4 tests
│   │       ├── SubscriptionForm.test.tsx # 9 tests
│   │       └── SubscriptionList.test.tsx # 6 tests
│   ├── assets/                   # Images, SVGs
│   ├── components/               # Feature components (17)
│   │   ├── ui/                   # UI primitives (3)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── BillingComparison.tsx
│   │   ├── CategoryManager.tsx
│   │   ├── ChatPage.tsx
│   │   ├── CurrencyOverview.tsx
│   │   ├── KeyboardShortcutsHelp.tsx
│   │   ├── Layout.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── OnboardingTour.tsx
│   │   ├── PaymentHistory.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── SpendingForecast.tsx
│   │   ├── SubscriptionForm.tsx
│   │   ├── SubscriptionList.tsx
│   │   ├── SubscriptionScore.tsx
│   │   ├── SubscriptionTemplatePicker.tsx
│   │   └── UpcomingRenewals.tsx
│   ├── contexts/                 # React contexts (2)
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/                     # Static data (templates, etc.)
│   ├── hooks/                    # Custom hooks
│   │   └── useKeyboardShortcuts.ts
│   ├── lib/                      # Shared utilities
│   │   └── utils.ts              #   cn() — clsx + tailwind-merge
│   ├── pages/                    # Route-level page components (10)
│   ├── services/                 # API service modules (9)
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                    # General utilities
│   ├── App.tsx                   # Router + route definitions
│   ├── index.css                 # Global styles + dark theme overrides
│   └── main.tsx                  # Entry point (React root, providers)
├── .env.development
├── .env.example
├── .env.production
├── Dockerfile                    # Docker build (nginx)
├── eslint.config.js              # ESLint flat config
├── index.html                    # HTML entry point
├── nginx.conf                    # Nginx config for Docker
├── playwright.config.ts          # Playwright configuration
├── postcss.config.js             # PostCSS (Tailwind v4 plugin)
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript project references
├── tsconfig.app.json             # App TypeScript config (ES2023, bundler mode)
├── tsconfig.node.json            # Node TypeScript config (Vite, configs)
├── vercel.json                   # Vercel deployment config
├── vite.config.ts                # Vite config (proxy, aliases)
└── vitest.config.ts              # Vitest config (jsdom, setup)
```

---

## Architecture

```
main.tsx
  └─ <StrictMode>
       └─ <ThemeProvider>              ← dark/light theme context
            └─ <QueryClientProvider>   ← TanStack React Query
                 ├─ <App />           ← BrowserRouter + Routes
                 └─ <Toaster />       ← Sonner toast notifications

App.tsx
  └─ <AuthProvider>                    ← auth state context
       └─ <BrowserRouter>
            └─ <Routes>
                 ├─ /                  → HomePage (landing)
                 ├─ /login             → LoginPage
                 ├─ /register          → RegisterPage
                 ├─ /forgot-password   → ForgotPasswordPage
                 ├─ /reset-password    → ResetPasswordPage
                 ├─ /verify-email      → VerifyEmailPage
                 ├─ /resend-verification → ResendVerificationPage
                 ├─ /auth/callback     → AuthCallbackPage
                 ├─ /dashboard         → ProtectedRoute → DashboardPage
                 ├─ /profile           → ProtectedRoute → ProfilePage
                 ├─ /admin             → ProtectedRoute → AdminPage
                 └─ *                  → Redirect to /
```

**Provider hierarchy:** `ThemeProvider` > `QueryClientProvider` > `AuthProvider` > `Router`

**Query Client defaults:**
- `refetchOnWindowFocus: false`
- `retry: 1`

---

## Feature Components

17 components in `src/components/`:

| Component | Description |
|---|---|
| **AnalyticsDashboard** | Spending analytics with pie and bar charts (Recharts). Category breakdowns, monthly trends. |
| **BillingComparison** | Annual vs monthly cost comparison table. Shows potential savings from switching billing cycles. |
| **CategoryManager** | Full CRUD for subscription categories with color picker. Create, edit, delete categories. |
| **ChatPage** | Full-page AI chatbot interface with session management sidebar. Conversational spending advice. |
| **CurrencyOverview** | Multi-currency subscription view with live conversion rates. Aggregated totals per currency. |
| **KeyboardShortcutsHelp** | Modal displaying all available keyboard shortcuts for power users. |
| **Layout** | App shell — collapsible sidebar navigation, notification bell, theme support, mobile overlay sidebar. |
| **NotificationBell** | Header notification dropdown with polling. Displays unread count badge and notification list. |
| **OnboardingTour** | 7-step guided onboarding for new users. Highlights key features with step-by-step walkthrough. |
| **PaymentHistory** | Payment records table with date range filters, status filters, and search. |
| **ProtectedRoute** | Auth guard wrapper. Waits for loading state, checks token, redirects to `/login` if unauthenticated. |
| **SpendingForecast** | 12-month spending projection using Recharts AreaChart. Trend-based future cost estimation. |
| **SubscriptionForm** | Create/edit subscription form with trial toggle, sharing toggle, and usage rating stars (1-5). |
| **SubscriptionList** | Card grid with search, category/status filters, bulk select, pagination, trial/sharing/rating badges. |
| **SubscriptionScore** | Value scores with progress bars and AI-suggested cheaper alternatives. |
| **SubscriptionTemplatePicker** | Quick-add from 28 pre-built subscription templates (Netflix, Spotify, etc.). |
| **UpcomingRenewals** | Upcoming billing dates list with urgency badges (due today, this week, this month). |

---

## UI Primitives

3 shadcn-style primitives in `src/components/ui/`, built with CVA + Radix Slot:

| Primitive | Variants | Description |
|---|---|---|
| `button.tsx` | `variant` (default, destructive, outline, secondary, ghost, link), `size` (default, sm, lg, icon) | Polymorphic button with `asChild` support via Radix Slot |
| `card.tsx` | — | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| `input.tsx` | — | Styled input with consistent focus ring and dark mode support |

**Utility function** (`src/lib/utils.ts`):

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Pages

10 page components in `src/pages/`:

| Page | Route | Auth Required | Description |
|---|---|---|---|
| **LoginPage** | `/login` | No | Email/password login with Google OAuth option |
| **RegisterPage** | `/register` | No | User registration with email verification |
| **ForgotPasswordPage** | `/forgot-password` | No | Request password reset email |
| **ResetPasswordPage** | `/reset-password` | No | Set new password via reset token |
| **VerifyEmailPage** | `/verify-email` | No | Email verification confirmation |
| **ResendVerificationPage** | `/resend-verification` | No | Resend verification email |
| **AuthCallbackPage** | `/auth/callback` | No | OAuth callback handler (Google) |
| **DashboardPage** | `/dashboard` | Yes | Main app — 7 tabbed sections (see below) |
| **ProfilePage** | `/profile` | Yes | User profile, appearance/theme settings |
| **AdminPage** | `/admin` | Yes | Admin panel for user/system management |

---

## Services

9 API service modules in `src/services/`:

| Service | Description |
|---|---|
| **api.ts** | Axios instance with base URL from `VITE_API_URL`. Request interceptor attaches `Authorization: Bearer <token>`. Response interceptor handles 401 (token refresh / logout). |
| **auth.ts** | Login, register, logout, refresh token, verify email, forgot/reset password, Google OAuth |
| **subscriptions.ts** | CRUD operations, import/export, bulk actions, template-based creation |
| **categories.ts** | Category CRUD with color management |
| **payments.ts** | Payment history retrieval with filters |
| **notifications.ts** | Fetch notifications, mark as read, polling support |
| **insights.ts** | Analytics data, spending forecasts, billing comparison, subscription scores, currency overview |
| **chat.ts** | AI chat sessions — create, list, send message, delete session |
| **admin.ts** | Admin endpoints — user management, system stats |

---

## Contexts

### AuthContext (`src/contexts/AuthContext.tsx`)

Manages authentication state across the app.

- **State:** `user`, `token`, `loading`
- **Actions:** `login()`, `logout()`, `register()`, `refreshToken()`
- **Persistence:** Token stored in `localStorage`
- **Hook:** `useAuth()` for consuming components

### ThemeContext (`src/contexts/ThemeContext.tsx`)

Manages dark/light theme with system preference detection.

- **State:** `theme` (`'dark'` | `'light'`)
- **Default:** Dark mode
- **Persistence:** `localStorage` with key for theme preference
- **Hook:** `useTheme()` for consuming components

---

## Dashboard Tabs

The `DashboardPage` renders 7 tabs plus a landing homepage:

| Tab | Components Used | Description |
|---|---|---|
| **Homepage** | Landing page | Marketing homepage at `/` (unauthenticated) |
| **Overview** | AnalyticsDashboard, UpcomingRenewals | Spending charts + upcoming renewal dates |
| **Subscriptions** | SubscriptionList, SubscriptionForm, SubscriptionTemplatePicker | Full CRUD, template quick-add, import/export, bulk operations |
| **Payments** | PaymentHistory | Payment records with filters and search |
| **Categories** | CategoryManager | Category CRUD with color picker |
| **Insights** | SpendingForecast, BillingComparison, SubscriptionScore, CurrencyOverview | Forecasts, cost comparisons, value scores, multi-currency view |
| **AI Assistant** | ChatPage | AI chat with session management sidebar |

Sidebar navigation is provided by the `Layout` component with a collapsible sidebar, notification bell, and responsive mobile overlay.

---

## Theme System

- **Default:** Dark mode
- **Toggle:** Profile Settings > Appearance section
- **Implementation:** `ThemeContext` applies a class to the document root. Global CSS overrides in `src/index.css` handle all dark-first Tailwind utility classes.
- **Persistence:** Theme preference saved to `localStorage` and restored on load.

---

## Routing

React Router v7 with `BrowserRouter`. All routes defined in `App.tsx`.

**Protected routes** are wrapped with `<ProtectedRoute>`:
- Displays a loading spinner while auth state initializes
- Checks for a valid token
- Redirects to `/login` if unauthenticated
- Catch-all `*` route redirects to `/`

---

## Testing

### Component Tests (Vitest + React Testing Library)

**24 tests** across 4 test suites in `src/__tests__/components/`:

| Test Suite | Tests | Coverage |
|---|---|---|
| `ProtectedRoute.test.tsx` | 4 | Auth guard behavior — loading state, redirect, render children, token check |
| `Layout.test.tsx` | 5 | Sidebar rendering, navigation links, mobile overlay, notification bell, theme toggle |
| `SubscriptionForm.test.tsx` | 9 | Form validation, trial toggle, sharing toggle, rating stars, create/edit modes, submit |
| `SubscriptionList.test.tsx` | 6 | Card rendering, search, filters, pagination, bulk select, empty state |

**Configuration** (`vitest.config.ts`):
- Environment: `jsdom`
- Setup file: `src/__tests__/setup.ts` (jest-dom matchers)
- Include: `src/**/*.test.{ts,tsx}`
- Excludes: `node_modules`, `dist`, `e2e`

### E2E Tests (Playwright)

**17 tests** across 3 spec files in `e2e/`:

| Spec File | Tests | Coverage |
|---|---|---|
| `auth.spec.ts` | 7 | Login, register, logout, forgot password, email verification, OAuth callback, session persistence |
| `dashboard.spec.ts` | 7 | Tab navigation, sidebar collapse, notification bell, theme toggle, mobile responsive, keyboard shortcuts, onboarding |
| `subscriptions.spec.ts` | 3 | Create subscription, edit subscription, delete subscription |

**Configuration** (`playwright.config.ts`):
- Browser: Chromium (headless)
- Base URL: `http://localhost:5173`
- Timeout: 30s per test
- Retries: 1
- Workers: 1 (sequential)
- Screenshots: on failure only

### Running Tests

```bash
# Run all component tests
npm test

# Run component tests in watch mode
npm run test:watch

# Run E2E tests (requires dev server running)
npm run test:e2e

# Run E2E tests with interactive UI
npm run test:e2e:ui

# Run all tests (component + E2E)
npm run test:all
```

---

## npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite dev server on `http://localhost:5173` with HMR |
| `build` | `tsc -b && vite build` | Type-check then build for production to `dist/` |
| `lint` | `eslint .` | Lint all TypeScript/TSX files with ESLint flat config |
| `preview` | `vite preview` | Serve the production build locally for testing |
| `test` | `vitest run` | Run component tests once |
| `test:watch` | `vitest` | Run component tests in watch mode |
| `test:e2e` | `playwright test` | Run Playwright E2E tests (headless Chromium) |
| `test:e2e:ui` | `playwright test --ui` | Run Playwright E2E tests with interactive UI |
| `test:all` | `vitest run && playwright test` | Run all component tests then E2E tests |

---

## Deployment

### Vercel (Primary)

Configured via `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

- SPA rewrite rule sends all non-`/api` routes to `index.html` for client-side routing.
- Set `VITE_API_URL` in the Vercel dashboard environment variables.

### Docker

A `Dockerfile` and `nginx.conf` are included for containerized deployment:

```bash
docker build -t wardayasubs-frontend .
docker run -p 80:80 wardayasubs-frontend
```

### Local Development Proxy

Vite proxies `/api` requests to the backend during development:

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

This means the frontend and backend can run on different ports locally without CORS issues.

---

## Path Aliases

The `@` alias maps to `src/` for clean imports:

```ts
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
```

Configured in both `tsconfig.app.json` and `vite.config.ts`:

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Responsive Design

Full mobile support throughout the application:

- **Sidebar:** Collapses to overlay drawer on mobile
- **Grids:** Responsive column layouts (`grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3`)
- **Chat UI:** Mobile-optimized with session drawer instead of persistent sidebar
- **Navigation:** Mobile-friendly with hamburger menu toggle
- **Forms:** Full-width inputs and stacked layouts on small screens

---

## License

Private project — not licensed for public distribution.
