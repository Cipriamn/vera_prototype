# About This Project

Vera Site Builder is a lightweight, self-hosted drag-and-drop website builder enabling non-technical users to create, customize, and publish websites without coding. Users drag components onto a canvas, edit properties in real-time, select from pre-built templates, and manage multiple pages and sites. The platform includes authentication, template selection, undo/redo functionality, keyboard shortcuts, and auto-save capabilities—designed for simplicity and speed as a modern alternative to traditional website builders.

The business logic centers on site management (create/edit/delete), page organization, element composition via drag-and-drop, and publishing workflows. Users authenticate with JWT tokens, build sites through visual editing, and share published sites via public URLs. Core droppable elements include Text, Image, Video, Button, Columns, and Grid layouts, with extensibility for additional components based on competitor analysis (navigation menus, galleries, contact forms, testimonials, CTAs, and dynamic content blocks).

## Architecture Overview

**Pattern:** Component-based React frontend with Express.js backend, monorepo workspace structure.

**System Flow:**
- **Frontend (React/TypeScript)** → Interactive builder canvas with component palette and property panel
- **Backend (Express/TypeScript)** → REST API for sites, pages, auth, templates, and uploads
- **Database (PostgreSQL/Prisma)** → Persistent storage for users, sites, pages, elements, templates
- **State Management (Zustand)** → Client-side auth state and builder state (elements, undo/redo history)
- **Drag-and-Drop (@dnd-kit)** → Canvas interaction and element repositioning

**Directory Structure:**
```
vera_prototype/
├── packages/
│   ├── web/          # React frontend (Vite + TypeScript)
│   ├── server/       # Express backend (TypeScript)
│   └── shared/       # Shared TypeScript types
└── package.json      # Root workspace config
```

The monorepo uses npm workspaces. Frontend and backend are independently built and run but share TypeScript types via the `@vera/shared` package.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend UI** | React 18+, Vite |
| **Styling** | Tailwind CSS, PostCSS |
| **Drag & Drop** | @dnd-kit |
| **State** | Zustand |
| **Language** | TypeScript |
| **Backend** | Express.js |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | JWT (accessToken + refresh) |
| **HTTP Client** | Axios |
| **Security** | Helmet |

## Core Components & Modules

### Frontend

**authStore.ts** — Zustand store managing user, tokens, authentication state with localStorage persistence.

**api.ts** — Axios HTTP client with request interceptor (adds Bearer token) and response interceptor (handles 401, redirects to /login).

**useBuilderTheme.ts** — Custom hook for light/dark theme management with localStorage persistence and CSS class toggle.

**elementRegistry.ts** — Central element palette exporting `PALETTE_ENTRIES` (categories, labels, icons) and type checking utilities. Includes base elements (Text, Image, Video, Button, Columns, Grid) with extensibility for forms, navigation, galleries, testimonials, and CTAs.

**lib/flexMaps.ts** — CSS value mappers: `flexAlignItemsToCss()`, `flexJustifyToCss()`, `gridAlignmentToCss()`.

**lib/containerMaxWidth.ts** — Container size tokens mapping Tailwind sizes to pixel values; `containerMaxWidthToCss()` returns CSS width string.

**lib/outerStyles.ts** — Box model styling via `outerStyleFromPaddingAndBox()` generating CSSProperties for padding, margin, border, shadow.

### Backend

**index.ts** — Express app entry point with middleware stack (helmet, cors, JSON parser), static file serving (/uploads), route registration, health endpoint, and graceful shutdown.

**routes/** — RESTful endpoints:
- `/auth/*` — register, login, refresh, logout
- `/sites/*` — CRUD operations and publish/unpublish
- `/sites/:siteId/pages/*` — Page management
- `/public/sites/*` — Public site and page access (no auth)
- `/upload` — Image upload handler
- `/templates/*` — Template retrieval with template variety informed by competitor analysis

## Key Patterns & Conventions

**Naming:** React components (PascalCase), functions/variables (camelCase), constants (UPPER_SNAKE_CASE), store hooks (`use[StoreName]`).

**State Management:** Auth state via Zustand persistent store with localStorage. Builder state manages element list, undo/redo history, selection. UI theme via custom hook.

**API Patterns:** RESTful with JSON. Bearer token auto-added by interceptor. 401 errors clear auth and redirect to /login. Response format wraps data/error.

**Builder Architecture:** 
- Element palette dynamically sourced from `PALETTE_ENTRIES` with categories: Layout (Columns, Grid), Content (Text, Image, Video), Interactive (Button, Form controls), Navigation (Menu, Header), Media (Gallery, Video), Social (Testimonials, Reviews), CTA (Call-to-Action blocks)
- Element types support type-specific properties
- @dnd-kit for drag/drop interactions
- Property panel enables real-time style editing
- Undo/redo with history coalescing to batch rapid updates
- Keyboard shortcuts: save, undo/redo, add/delete elements
- Auto-save on periodic intervals or blur

**Adding Element Types:** Define in shared types, add to `PALETTE_ENTRIES`, implement PropertyPanel controls, export render component. Prioritize by feasibility (text/image first, then forms/galleries, finally complex integrations).

**Adding API Endpoints:** Create handler in routes/, register in index.ts, add types to shared/api.ts, call via api.get/post from frontend.

## Key Files & Entry Points

**Must Read First:**
- `packages/web/src/stores/authStore.ts` — Auth state and persistence
- `packages/web/src/utils/api.ts` — HTTP communication and token handling
- `packages/server/src/index.ts` — Backend structure and middleware
- `packages/web/src/builder/elementRegistry.ts` — Element definitions
- `packages/shared/src/types/` — Type contracts
- `packages/web/tailwind.config.js` — Theme tokens and styling
- `packages/web/vite.config.ts` — Dev server proxy setup

**Configuration:**
- `package.json` (root) — Workspace setup and scripts
- `packages/web/vite.config.ts` — /api proxy to port 4000
- `packages/web/tailwind.config.js` — Dark mode class strategy
- `packages/server/.env` — Database URL and JWT secret
- `packages/server/prisma/schema.prisma` — Database schema

**Development Commands:**
```bash
npm install
cp packages/server/.env.example packages/server/.env
npm run db:generate && npm run db:migrate
npm run dev              # Both frontend and backend
npm run dev:web          # Frontend only (port 3000)
npm run dev:server       # Backend only (port 4000)
npm run build && npm run lint
npm run db:studio        # Prisma Studio
```

## Development Notes

**Extending the Builder:** Prioritize element additions by feasibility: Layer 1 (Text, Image, Video, Button—already core), Layer 2 (Forms, Galleries, Navigation menus), Layer 3 (Dynamic content, integrations, testimonials). Reference competitor sites for feature validation. Add type definitions, update `PALETTE_ENTRIES`, implement PropertyPanel controls, add render component.

**Adding Templates:** Store template JSON in database or fixtures. Endpoint `GET /api/templates` returns array with id, name, preview, elementTree. Frontend loads on site creation and populates BuilderStore. Use competitor analysis to inform template variety and layout patterns.

**Styling Elements:** Use lib functions (`flexAlignItemsToCss`, `containerMaxWidthToCss`, etc.), build CSSProperties via `outerStyleFromPaddingAndBox()`, apply via inline style or CSS variable className. Theme via `useBuilderTheme()`.

**Common Behaviors:** Auth token stored in localStorage under `vera-auth` by Zustand persist (not accessed directly; use store). API interceptor auto-adds Bearer token; 401 clears auth and redirects. CORS configured for localhost:3000. Uploads validated server-side. Element IDs are likely UUIDs. Tailwind uses class strategy for dark mode. History coalesces rapid updates (e.g., dragging) to prevent bloat.

**Performance & Roadmap:** Coalesce rapid builder updates, consider virtualization for large element counts, compress images server-side, use CDN for public uploads, lazy-load page components. Feature prioritization informed by competitor analysis of Dutch association and organization website builders; focus on most frequently observed and technically feasible elements first.