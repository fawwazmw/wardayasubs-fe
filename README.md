# Frontend - Wardaya Subs

Vite + React + TypeScript + Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API services
├── types/           # TypeScript types
├── utils/           # Utility functions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

- Mobile-first responsive design
- Dark mode support
- Form validation
- API integration with backend
- Protected routes
- Token-based authentication
