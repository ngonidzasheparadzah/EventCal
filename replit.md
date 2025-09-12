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

The primary database is PostgreSQL, hosted on Replit. Key schema design decisions include user management with scrypt password hashing, flexible property listing schemas, comprehensive booking lifecycle management, integrated messaging, and a service marketplace. It also supports analytics and tracking. The schema comprises 14 tables with UUID primary keys and JSONB fields for flexible data. Session storage system implemented.

## Authentication & Authorization

The system implements a secure local authentication system with session-based management using `express-session`. Authorization is role-based (guest, host, admin) with route protection, and secure session cookies are enforced. Frontend integration uses React context for authentication state management.

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

# Current Project Status

**Last Updated**: September 12, 2025

## Development Phase: **FUNCTIONAL APPLICATION**

### **Recent Achievements**

#### **Task 1: Guest Dashboard Enhancement** ✅ **COMPLETED**
- Enhanced guest dashboard with personalized greeting and user avatar
- Added "Continue Your Search" section with location-based search capability
- Implemented "Recently Viewed Homes" section with property cards
- Created enhanced category navigation with 8 property type categories
- 46 files contain data-testid attributes for testing support (grep count)

#### **Task 2: Host Dashboard Enhancement** ✅ **COMPLETED**  
- Implemented comprehensive analytics with 8 professional stats cards
- Added interactive data visualizations using Recharts:
  - Line chart for Views & Bookings trends over time
  - Pie chart for Property Types performance analysis  
- Enhanced metrics include: Active Listings, Total Views, Saves, Messages, Bookings, Revenue, Average Rating, Conversion Rate
- All charts feature responsive design with hover effects and tooltips
- Reduced mock data dependency by calculating estimates from actual listing data

### **Current Application Status**

**Server Status**: Running on port 5000 (workflow active)

#### **Observed API Responses (from logs 6:23-6:25 PM)**
```
6:23:45 PM [express] GET /api/listings 304 in 18ms :: []
6:23:45 PM [express] GET /api/user 401 in 1ms  
6:23:57 PM [express] GET /api/listings 304 in 21ms :: []
6:23:57 PM [express] GET /api/user 401 in 1ms
```
- HEAD /api requests: 1-22ms response times (from 6:25-6:29 PM logs)
- Browser console: Only Vite connection messages (no JavaScript errors)

#### **Implementation Status**
- **Architecture**: React + TypeScript frontend, Express.js backend
- **Database Schema**: 14 tables defined in shared/schema.ts
- **Testing Support**: 46 files contain data-testid attributes (grep result)
- **Charts**: Recharts imported and integrated (naming conflicts resolved)

#### **Database Tables (from shared/schema.ts grep)**
users, listings, bookings, messages, anonymousSessions, anonymousEvents, reviews, wishlist, reports, services, analytics, userPreferences, uiComponents, componentUsage

### **Property Types Supported** (from schema)
boarding_house, private_room, lodge, hotel, apartment, guesthouse

### **Development Accomplishments**
- **Task 1**: Enhanced guest dashboard with personalized greeting, search continuation, recently viewed section, and category navigation
- **Task 2**: Implemented host dashboard with 8 analytics cards and interactive Recharts visualizations (line + pie charts)
- **Technical**: Fixed Recharts naming conflicts by aliasing imports to resolve build errors
- **Database**: Defined 14-table PostgreSQL schema with relationships via Drizzle ORM
- **Testing**: Added data-testid attributes across 46 files for test automation support
- **Architecture**: Full-stack TypeScript with React frontend, Express backend, and Zod validation

## Next Steps (Identified Improvements)

### Priority 1 (Code Quality)
1. **Fix TypeScript Issues**: Resolve remaining 5 LSP diagnostics in host-dashboard.tsx
2. **API Response Consistency**: Ensure all 404 endpoints return JSON instead of HTML
3. **Console Cleanup**: Remove any development console.log statements

### Priority 2 (Performance)
4. **Bundle Optimization**: Consider code splitting if bundle size becomes an issue
5. **Caching Strategy**: Implement proper cache headers for static assets

### Priority 3 (Enhancement)
6. **SEO Optimization**: Add dynamic page titles and meta descriptions
7. **Security Headers**: Implement CSP, X-Frame-Options, and HSTS headers

## Deployment Status
- **Application Status**: ✅ Running stable on port 5000
- **Database**: 14-table schema defined in shared/schema.ts
- **API Endpoints**: Observed GET /api/listings (304), GET /api/user (401) responses
- **Frontend**: ✅ React app with hot module reloading  
- **Performance**: HEAD /api: 1-22ms, GET endpoints: 1-21ms (logged)
- **Security**: Local authentication system implemented
- **Overall**: Application functional with basic features implemented

**Status**: Guest and host dashboards completed with analytics integration