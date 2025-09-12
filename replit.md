# Overview

RooMe Zimbabwe is a full-stack accommodation booking platform for Zimbabwe's hospitality market. It facilitates bookings for various accommodations (boarding houses, private rooms, lodges, hotels, apartments, guesthouses) by connecting property hosts with guests. The platform provides comprehensive property management tools, booking systems, and communication features, aiming to simplify infrastructure, integrate natively with Replit, enhance security, improve performance, and optimize cost efficiency.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses React and TypeScript, following a component-based architecture. It employs Wouter for routing, TanStack Query for server state management, and Radix UI primitives combined with shadcn/ui for accessible UI components. Styling is handled by Tailwind CSS with CSS variables for theming. Form handling is managed with React Hook Form and Zod. The design system features a dark theme (RooMe Blue) with specific color palettes for brand, UI elements, user types, and functional states, incorporating `fadeIn` animations. It includes a streamlined 3-step guest onboarding process and adopts a mobile-first responsive design approach.

## Backend Architecture

The backend is built with Node.js/Express, providing RESTful API endpoints with consistent error handling and logging. It utilizes Drizzle ORM for type-safe queries and schema management. Authentication is session-based with secure local authentication. The architecture follows a middleware pattern for request processing and employs an interface-based storage layer for database operations.

## Data Storage

The primary database is PostgreSQL, hosted on Replit. Key schema design decisions include user management with scrypt password hashing, flexible property listing schemas, comprehensive booking lifecycle management, integrated messaging, and a service marketplace. It also supports analytics and tracking. The schema comprises 12 production tables with UUID primary keys and JSONB fields for flexible data. Session storage is also PostgreSQL-backed.

## Authentication & Authorization

The system implements a secure local authentication system with scrypt password hashing and session-based management using `express-session` backed by PostgreSQL. Authorization is role-based (guest, host, admin) with route protection, and secure session cookies are enforced. Frontend integration uses React context for authentication state management.

## Feature Specifications

### Core Functionality
- **Navigation**: Features a 5-tab bottom navigation (Dashboard, Listings, Insights, Messages, More) and 3 dynamic top tabs (Homes, Marketplace, Roommates) with a context-aware search bar.
- **Dashboards**: Personalized dashboards for hosts (stats cards, notifications, quick actions, listing management) and guests (greeting, continued search, recently viewed homes, recommendations, category navigation).
- **Saved Listings/Wishlist**: Allows one-click saving/removing of listings, with a dedicated, persistent wishlist section.
- **Analytics & Insights**: Tracks user engagement (views, saves, messages) with host-specific dashboards featuring data visualizations.
- **Dynamic Listing Forms**: Forms adapt based on property type, including universal highlights, room management, multi-step progress, and dynamic validation.

### Communication & Trust
- **Messaging System**: iMessage-style chat with "Message Landlord" button, chat bubbles, message status, typing indicators, and thread organization.
- **Trust Score System**: Calculates trust scores based on responsiveness, verification, engagement, profile completeness, freshness, and reviews, displaying animated badges (Platinum, Gold, Silver).
- **Review System**: Allows 1-5 star reviews with optional text, immediate publishing, a 7-day edit window, helpful marking, and sorting options.

### Advanced Features
- **In-App Notifications**: Triggers notifications for new messages, listing status, reviews, verification updates, and trust score changes, accessible via a bell icon and configurable settings.
- **Document Verification**: Supports uploads of IDs, utility bills, and property documents, with OCR and AI verification (GPT-4) for status tracking and badge awarding.
- **Smart Search (Pulsar)**: Planned future feature for natural language queries using vector embeddings and `pgvector` integration for semantic and location-aware search.

### UI/UX Enhancements
- **Mobile-First Design**: Modern, minimal design language with rounded elements, soft animations, and a brand color palette (RooMe Blue with user-type specific colors). Supports dark/light mode toggle.
- **Interactive Elements**: Includes overlay text animations, context-aware Floating Action Buttons (FABs), smooth scrolling, infinite scroll, and responsive touch interactions.

## Technical Implementation Pattern

Adheres to a `fullstack_js` guideline:
1.  **Schema First**: Define data models with Drizzle schema in `shared/schema.ts`, including insert schemas and types.
2.  **Storage Layer**: Update `IStorage` interface and implement storage methods in `server/storage.ts`, centralizing database logic.
3.  **API Layer**: Create RESTful endpoints in `server/routes.ts` using Zod for validation, keeping routes thin by delegating to the storage layer.
4.  **Frontend Implementation**: Utilize shadcn's `useForm` with `zodResolver`, TanStack Query v5 for data fetching (`useQuery({ queryKey: ['key'] })` with hierarchical array keys), proper cache invalidation, and mandatory `data-testid` attributes.

## Security Requirements

Includes encryption of sensitive documents, access control and audit trails for PII, rate limiting on messaging and API endpoints, and enforcement of HTTPS-only connections in production.

# External Dependencies

-   **Replit Database**: Native PostgreSQL hosting.
-   **Passport.js & Express-session**: For session-based authentication.
-   **Radix UI**: Accessible UI component primitives.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **TanStack Query**: Server state management and caching.
-   **Drizzle ORM**: Type-safe database toolkit for PostgreSQL.
-   **Vite**: Modern build tool and development server.
-   **Express.js**: Web application framework for Node.js.