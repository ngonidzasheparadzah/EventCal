# Overview

RooMe Zimbabwe is a full-stack accommodation booking platform built specifically for Zimbabwe's hospitality market. The application enables users to search and book various types of accommodations including boarding houses, private rooms, lodges, hotels, apartments, and guesthouses. The platform features a dual-sided marketplace connecting property hosts with guests, offering comprehensive property management tools, booking systems, and communication features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses React with TypeScript and follows a component-based architecture. Key architectural decisions include:

- **React Router Alternative**: Uses Wouter for lightweight client-side routing, reducing bundle size compared to React Router
- **State Management**: TanStack Query for server state management, providing caching, synchronization, and optimistic updates
- **UI Framework**: Radix UI primitives with shadcn/ui components for accessible, customizable design system
- **Styling**: Tailwind CSS with CSS variables for theming, supporting light/dark modes
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture

The backend follows a Node.js/Express architecture with the following design patterns:

- **API Design**: RESTful API endpoints with consistent error handling and logging middleware
- **Database Layer**: Drizzle ORM for type-safe database queries and schema management
- **Authentication**: Replit OIDC authentication with session-based user management
- **Middleware Pattern**: Express middleware for request logging, error handling, and authentication guards
- **Storage Abstraction**: Interface-based storage layer for database operations, enabling easier testing and potential database migrations

## Data Storage

**Primary Database**: PostgreSQL with Neon serverless hosting for scalability and reliability. Key schema design decisions:

- **User Management**: Supports Replit's authentication flow with user profiles and verification status
- **Property Listings**: Flexible schema supporting multiple property types with amenities, pricing, and location data
- **Booking System**: Complete booking lifecycle with status tracking and guest-host relationships
- **Communication**: Built-in messaging system for host-guest communication
- **Session Storage**: PostgreSQL-based session storage for authentication persistence

## Authentication & Authorization

**Replit OIDC Integration**: Leverages Replit's authentication system for secure user management:

- **Session Management**: Express-session with PostgreSQL storage for persistence
- **Authorization**: Role-based access control (guest, host, admin) with route protection
- **Security**: HTTPS-only cookies with proper CSRF protection

## External Dependencies

- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Authentication**: OIDC-based authentication service for user management
- **Radix UI**: Accessible UI component primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support
- **Vite**: Modern build tool and development server
- **Express.js**: Web application framework for Node.js