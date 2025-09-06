# Overview

RooMe Zimbabwe is a full-stack accommodation booking platform built specifically for Zimbabwe's hospitality market. The application enables users to search and book various types of accommodations including boarding houses, private rooms, lodges, hotels, apartments, and guesthouses. The platform features a dual-sided marketplace connecting property hosts with guests, offering comprehensive property management tools, booking systems, and communication features.

## Recent Progress (January 2025)

### Onboarding Experience Components

#### 1. Welcome Screen Carousel Component
**File**: `client/src/pages/onboarding-demo.tsx`
**Description**: Auto-scrolling image carousel with manual controls for onboarding flow

**Features**:
- Auto-scroll every 4 seconds with `useEffect` timer
- Manual control via clicking image or progress dots
- Three slides with dynamic content and images
- Smooth transitions with CSS `transition-all duration-500`

**Slides Configuration**:
1. **Find Accommodation**: Interior living room image + "Find accommodation across Zimbabwe"
2. **List Property**: House exterior with garden + "List your property" 
3. **Provide Services**: Cleaning supplies image + "Provide Services"

**Styling Patterns**:
- RooMe blue progress dots (#1E5EFF)
- Responsive design with `max-w-sm mx-auto`
- Perfect screen fit with `h-screen` and `justify-between`
- Smooth image transitions with key-based re-rendering

#### 2. Website Type Selection Component
**File**: `client/src/pages/website-type.tsx`
**Description**: User role selection page with animated interactions

**Features**:
- Three user types: Guest, Host, Service Provider
- Fade-in animations on page load (0.6s + 0.3s delay)
- Enhanced scaling animations with hover/active states
- Dynamic state management with React hooks

**Animation Pattern** (Reusable):
```css
transition-all duration-200 hover:scale-105 active:scale-95
// Selected state: scale-105
// Hover: hover:shadow-md
```

**User Types Configuration**:
1. **Guest**: "I'm looking for a Home" 
2. **Host**: "I'm looking for Tenants"
3. **Service Provider**: "I'm looking for Clients"

**Styling Patterns**:
- Clean, minimal design without mascots or unnecessary elements
- Compact tabs with `p-3 rounded-lg` 
- RooMe blue selection state (#1E5EFF)
- Bold titles with `text-lg font-bold`

#### 3. Visual Design System
**Primary Brand Colors**:
- RooMe Blue: `#1E5EFF` - Primary brand color, buttons, selection states
- Hover Blue: `#174ACC` - Button hover states, active interactions
- Text Charcoal: `#2C2C2C` - Primary text color, headlines
- White: `#FFFFFF` - Button text, card backgrounds

**User Type Colors**:
- Guest Green: `#16A34A` - Guest icon and text (`text-green-600`)
- Guest Green Light: `#DCFCE7` - Guest icon background (`bg-green-100`)
- Host Purple: `#9333EA` - Host icon and text (`text-purple-600`)
- Host Purple Light: `#F3E8FF` - Host icon background (`bg-purple-100`)
- Service Orange: `#EA580C` - Service Provider icon and text (`text-orange-600`)
- Service Orange Light: `#FED7AA` - Service Provider icon background (`bg-orange-100`)

**UI Grays**:
- Gray 50: `#F9FAFB` - Page backgrounds
- Gray 100: `#F3F4F6` - Subtle backgrounds
- Gray 200: `#E5E7EB` - Borders, dividers
- Gray 300: `#D1D5DB` - Hover borders
- Gray 400: `#9CA3AF` - Icon colors, placeholders
- Gray 500: `#6B7280` - Secondary text
- Gray 600: `#4B5563` - Icon colors when active
- Gray 700: `#374151` - Secondary text, labels
- Gray 800: `#1F2937` - Primary text alternative
- Gray 900: `#111827` - Darkest text

**Selection & State Colors**:
- Blue 50: `#EFF6FF` - Selected tab backgrounds
- Blue 100: `#DBEAFE` - Gradient backgrounds for selected states
- Blue 300: `#93C5FD` - Hover border colors
- Blue 500: `#3B82F6` - Selection indicators, active states
- Blue 600: `#2563EB` - Selected text colors

**Functional Colors**:
- Success Green: `#10B981` - Success states, confirmations
- Warning Orange: `#F59E0B` - Warning states, alerts
- Error Red: `#EF4444` - Error states, validation
- Info Blue: `#06B6D4` - Information, neutral alerts

**Animation Library**:
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
.animate-fade-in-delayed { opacity: 0; animation: fadeIn 0.6s ease-out 0.3s forwards; }
```

**Responsive Design Patterns**:
- Mobile-first with `max-w-sm mx-auto`
- Perfect screen fitting with `h-screen` containers
- Centered layouts using flexbox
- Touch-friendly interactions

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