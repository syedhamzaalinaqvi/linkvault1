# Overview

This is a WhatsApp Groups Directory application that allows users to discover, browse, and submit WhatsApp group links organized by categories and countries. The platform features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type validation and schema generation
- **Development**: Hot reloading with Vite integration for seamless development experience
- **Storage**: Currently implements in-memory storage with interface for easy database migration

## Database Schema
- **Users Table**: Basic user management with username/password authentication
- **WhatsApp Groups Table**: Core entity storing group information including title, description, WhatsApp link, category, country, view count, and timestamps
- **Database Migrations**: Managed through Drizzle Kit with PostgreSQL dialect

## Key Features
- **Group Discovery**: Browse groups by category, country, or search functionality
- **Group Submission**: Form-based group submission with validation
- **Filtering & Sorting**: Multiple filter options (category, country, search) with sorting capabilities
- **Responsive Design**: Mobile-first approach with responsive UI components
- **View Tracking**: Track and display group popularity through view counts

## Development Workflow
- **Hot Reloading**: Integrated development server with Vite for fast development cycles
- **Type Safety**: Full TypeScript integration across frontend, backend, and shared schemas
- **Component System**: Modular UI components with consistent design patterns
- **Error Handling**: Comprehensive error handling with user-friendly toast notifications

# External Dependencies

## Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database migration and schema management tool

## UI & Styling
- **@radix-ui/***: Comprehensive set of unstyled UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Icon library for consistent iconography

## Data Management
- **@tanstack/react-query**: Powerful data synchronization for server state
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation

## Development Tools
- **vite**: Fast build tool and development server
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **tsx**: TypeScript execution engine for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds