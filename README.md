# Vera Site Builder

A lightweight drag-and-drop website builder that allows users to create and publish websites easily.

## Tech Stack

- **Frontend**: React.js + TypeScript + Vite + Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **State Management**: Zustand
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT-based authentication

## Project Structure

```
vera_prototype/
├── packages/
│   ├── web/          # React frontend
│   ├── server/       # Express backend
│   └── shared/       # Shared types
└── package.json      # Root workspace
```

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and update it with your settings:

```bash
cp packages/server/.env.example packages/server/.env
```

Update the `.env` file with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vera_site_builder?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
```

### 3. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 4. Start development servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:web     # Frontend on http://localhost:3000
npm run dev:server  # Backend on http://localhost:4000
```

## Features

### Core Builder
- Drag-and-drop canvas with real-time preview
- Element types: Text, Image, Video, Button, Columns, Grid
- Property panel with real-time editing
- Auto-save functionality

### Element Properties
- **Text**: Font size, family, weight, color, alignment
- **Image**: URL, alt text, sizing, border radius
- **Video**: YouTube/Vimeo embed, aspect ratio, autoplay
- **Button**: Text, URL, colors, variants, sizes
- **Layouts**: Columns (2-4), Grid, gap and padding controls

### Site Management
- Create, edit, delete sites
- Multiple pages per site
- Publish/unpublish sites
- Public URL for published sites

### Templates
- Student House template
- Sports Team template
- Event Page template
- Association template

### Authentication
- Register/Login with email and password
- JWT access tokens with refresh tokens
- Protected routes

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Sites
- `GET /api/sites` - List user's sites
- `POST /api/sites` - Create site
- `GET /api/sites/:id` - Get site
- `PUT /api/sites/:id` - Update site
- `DELETE /api/sites/:id` - Delete site
- `POST /api/sites/:id/publish` - Publish site
- `POST /api/sites/:id/unpublish` - Unpublish site

### Pages
- `GET /api/sites/:siteId/pages` - List pages
- `POST /api/sites/:siteId/pages` - Create page
- `GET /api/sites/:siteId/pages/:pageId` - Get page
- `PUT /api/sites/:siteId/pages/:pageId` - Update page
- `DELETE /api/sites/:siteId/pages/:pageId` - Delete page

### Public
- `GET /api/public/sites/:slug` - Get published site
- `GET /api/public/sites/:siteSlug/:pageSlug` - Get published page

### Templates
- `GET /api/templates` - List templates
- `GET /api/templates/:id` - Get template

### Upload
- `POST /api/upload` - Upload image

## License

Private - Vera Connect
