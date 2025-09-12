# Overview

RooMe Zimbabwe is a full-stack accommodation booking platform designed for Zimbabwe's hospitality market. It facilitates bookings for various accommodations including boarding houses, private rooms, lodges, hotels, apartments, and guesthouses. The platform functions as a dual-sided marketplace, connecting property hosts with guests, and offers comprehensive property management tools, booking systems, and communication features. The project aims to simplify infrastructure, integrate natively with Replit, enhance security, improve performance, and optimize cost efficiency.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React and TypeScript, following a component-based architecture. Key aspects include:
- **Routing**: Wouter for lightweight client-side routing.
- **State Management**: TanStack Query for server state management, including caching and optimistic updates.
- **UI Framework**: Radix UI primitives combined with shadcn/ui components for accessibility and customizability.
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design.
- **Form Handling**: React Hook Form with Zod for type-safe form management.
- **Design System**: Incorporates a dark theme inspired by modern mobile UI, using a primary RooMe Blue (`#0390D7`) with specific color palettes for brand, UI elements, user types (Guest Green, Host Purple, Service Orange), and functional states (Success, Warning, Error, Info). Animations include `fadeIn` for smooth transitions.
- **Onboarding Flow**: Streamlined 3-step guest onboarding focusing on accommodation preferences. Features include a welcome screen carousel and an animated user type selection component.
- **Responsive Design**: Mobile-first approach with defined breakpoints for Desktop (1440px), Tablet (768–1024px), and Mobile (360–375px), ensuring content scales appropriately across devices.

## Backend Architecture

The backend uses Node.js/Express, adhering to:
- **API Design**: RESTful API endpoints with consistent error handling and logging middleware.
- **Database Layer**: Drizzle ORM for type-safe queries and schema management.
- **Authentication**: Session-based user management with secure local authentication.
- **Middleware Pattern**: Express middleware for request logging, error handling, and authentication guards.
- **Storage Abstraction**: Interface-based storage layer for database operations.

## Data Storage

The primary database is PostgreSQL, hosted on Replit. Key schema design decisions include:
- **User Management**: Local signup with scrypt password hashing and session-based authentication.
- **Property Listings**: Flexible schema supporting various property types, amenities, pricing, and location data.
- **Booking System**: Comprehensive booking lifecycle management.
- **Communication**: Integrated messaging for host-guest interaction.
- **Service Marketplace**: Platform for additional accommodation services.
- **Analytics & Tracking**: User behavior and UI component performance monitoring.
- **Session Storage**: PostgreSQL-backed session storage for authentication persistence.
- **Schema**: Comprises 12 production tables, 156 columns, 21 foreign key relationships, JSONB fields for flexible data, and UUID primary keys.

## Authentication & Authorization

Implemented with a secure local authentication system:
- **Password Security**: Scrypt hashing with unique salts.
- **Session Management**: Express-session with PostgreSQL for persistence.
- **Authorization**: Role-based access control (guest, host, admin) with route protection.
- **Security**: Secure session cookies (`httpOnly`, `sameSite`).
- **Frontend Integration**: React context for authentication state management.

# External Dependencies

- **Replit Database**: Native PostgreSQL hosting.
- **Session-based Authentication**: Implemented using passport.js and express-session.
- **Radix UI**: Accessible UI component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **TanStack Query**: Server state management and caching.
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL.
- **Vite**: Modern build tool and development server.
- **Express.js**: Web application framework for Node.js.