# Team & Events Single-Page Application

## Overview

This is a single-page application (SPA) that showcases team members, upcoming events, contact information, and social media links. The application is built as a static display website with a clean, modern design inspired by productivity tools like Linear and Notion. It uses a full-stack TypeScript architecture with React on the frontend and Express on the backend, though the current implementation primarily renders static content on the client side.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, chosen for fast hot module replacement and optimized production builds
- Wouter for lightweight client-side routing (only 2 routes: home and 404)
- Single-page application pattern where all content is rendered on the home page with vertical sections

**UI Component Library**
- shadcn/ui component system using Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system with CSS variables for colors, supporting both light and dark modes
- Design system following "New York" style variant with clean, minimalist aesthetics

**State Management**
- TanStack Query (React Query) for server state management and caching
- No complex global state - application uses static data defined in components
- React hooks for local component state

**Design Principles**
- System-based approach with consistent spacing primitives (4, 6, 8, 12, 16px units)
- Centered, single-column layout with max-width container (max-w-6xl)
- Card-based component design with subtle shadows and hover effects
- Responsive grid layouts (1 column mobile, 2-3 columns desktop)
- Typography hierarchy using sans-serif fonts with varying weights

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and middleware
- Dual-mode operation: development (with Vite middleware) and production (serving static files)
- Modular route registration system in `server/routes.ts`

**Development vs Production**
- Development mode (`index-dev.ts`): Integrates Vite development server with HMR support
- Production mode (`index-prod.ts`): Serves pre-built static assets from `dist/public`
- Custom middleware for request logging and JSON response capture

**API Design**
- RESTful API structure with `/api` prefix for all backend routes
- Currently minimal backend logic - designed for future expansion
- Storage interface abstraction allows switching between in-memory and database implementations

### Data Storage

**Current Implementation**
- In-memory storage using `MemStorage` class for user data
- Static data for team members, events, contacts, and social links defined directly in React components
- UUID-based ID generation for entities

**Database Configuration**
- Drizzle ORM configured for PostgreSQL with schema definitions
- Neon serverless PostgreSQL driver for cloud database connectivity
- Migration system using `drizzle-kit` for schema management
- Schema defines users table with username/password fields (authentication foundation)

**Data Models**
- User: id, username, password (hashed storage expected)
- TeamMember: id, name, role, bio, initials
- Event: id, date, title, time, location
- ContactInfo: email, phone, location
- SocialLink: id, name, url, icon type

### External Dependencies

**Core Libraries**
- `@neondatabase/serverless`: Serverless PostgreSQL driver for Neon database platform
- `drizzle-orm` and `drizzle-zod`: Type-safe ORM with Zod schema validation
- `@tanstack/react-query`: Async state management and caching
- `date-fns`: Date manipulation and formatting utilities

**UI Framework**
- `@radix-ui/*`: Complete set of accessible UI primitives (40+ components including dialogs, dropdowns, tooltips, etc.)
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Type-safe variant management for components
- `lucide-react` and `react-icons`: Icon libraries for UI elements

**Form Handling**
- `react-hook-form`: Performant form state management
- `@hookform/resolvers`: Form validation resolver integration
- `zod`: Schema validation for forms and data

**Development Tools**
- `vite`: Next-generation build tool and dev server
- `tsx`: TypeScript execution for Node.js scripts
- `esbuild`: Fast JavaScript bundler for production builds
- Replit-specific plugins for development experience (cartographer, dev banner, error overlay)

**Session & Authentication Dependencies**
- `connect-pg-simple`: PostgreSQL session store for Express sessions (configured but not actively used)
- Infrastructure in place for user authentication system

### Design System Integration

The application follows documented design guidelines (`design_guidelines.md`) that specify:
- Typography scale and weights for hierarchy
- Consistent spacing and layout containers
- Component specifications for team cards, event listings, and contact cards
- Color scheme using HSL-based CSS variables
- Responsive breakpoints and grid systems
- Interactive states (hover, active) with elevation effects

### Build & Deployment

**Build Process**
1. Client build: Vite compiles React/TypeScript to optimized JavaScript bundles
2. Server build: esbuild bundles Express server code for production
3. Output: Static assets in `dist/public`, server bundle in `dist/index.js`

**Scripts**
- `dev`: Development mode with hot reloading
- `build`: Production build of both client and server
- `start`: Run production server
- `db:push`: Push database schema changes using Drizzle

**Configuration Files**
- `vite.config.ts`: Vite configuration with path aliases and plugins
- `tailwind.config.ts`: Tailwind theme customization and content paths
- `tsconfig.json`: TypeScript compiler options with path mapping
- `drizzle.config.ts`: Database connection and migration settings
- `components.json`: shadcn/ui component configuration