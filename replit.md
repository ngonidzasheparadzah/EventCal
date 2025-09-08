# Overview

RooMe Zimbabwe is a full-stack accommodation booking platform built specifically for Zimbabwe's hospitality market. The application enables users to search and book various types of accommodations including boarding houses, private rooms, lodges, hotels, apartments, and guesthouses. The platform features a dual-sided marketplace connecting property hosts with guests, offering comprehensive property management tools, booking systems, and communication features.

## Recent Progress (January 2025)

### Database Migration to Supabase (September 2025)

#### ✅ **Complete Supabase Integration**
**Achievement**: Successfully migrated from Replit database to Supabase PostgreSQL with zero data loss

**Technical Implementation**:
- **Connection**: Direct PostgreSQL driver connection replacing Neon serverless
- **Schema Sync**: All 12 RooMe tables deployed and verified in Supabase
- **Authentication**: Updated database configuration to use `SUPABASE_DATABASE_URL`
- **Performance**: Eliminated 10 GiB storage limitation, gained enterprise-grade scaling

**Database Architecture**:
- **12 Production Tables**: users, listings, bookings, reviews, messages, wishlist, services, reports, analytics, user_preferences, ui_components, component_usage
- **156 Total Columns**: Complete data model with all relationships
- **21 Foreign Keys**: Full referential integrity maintained
- **UUID Primary Keys**: Using `gen_random_uuid()` for all tables

**Benefits Achieved**:
- **Unlimited Scaling**: No storage restrictions like Replit DB
- **Production Ready**: Enterprise-grade PostgreSQL with automated backups
- **Real-time Capabilities**: Built-in subscriptions for live updates
- **Global Performance**: Optimized hosting with CDN integration

#### ✅ **Login & Signup Page Redesign**
**Inspiration**: Modern dark mobile UI design with sleek rounded inputs
**Implementation**: Complete visual overhaul while maintaining RooMe branding

**Design System Updates**:
- **Dark Theme**: Slate-800 background with clean white text
- **Input Design**: Rounded fields with "Show" buttons instead of emoji icons
- **Progress Bars**: Retained original RooMe blue progress indicators
- **Responsive**: Perfect scaling across all breakpoints (360px→1440px)
- **Animation**: Smooth transitions and hover effects maintained

#### ✅ **3-Step Onboarding Process Redesign** (September 2025)
**Change**: Streamlined guest onboarding from 4 steps to 3 steps, replacing accommodation preferences with personal information

**New Onboarding Flow**:
1. **Step 1 - Basic Info**: Full name, email, password (guest-signup.tsx)
2. **Step 2 - Contact & Verification**: Phone number, address, city, email verification (guest-contact-verification.tsx)  
3. **Step 3 - About You**: Personal description, hobbies, profession (guest-preferences.tsx)

**Database Schema Updates**:
- **Enhanced user_preferences table**: Added `description` (text), `hobbies` (jsonb array), `profession` (varchar)
- **Removed Fields**: accommodationType, stayType, priceRange, priceSensitivity, roommatePreferences, lifestylePreferences, amenities, location
- **Data Storage**: Personal information stored only after complete signup process

**UI/UX Improvements**:
- **"About You" Section**: User-friendly personal information collection with optional fields
- **Interactive Hobbies**: Add/remove hobby chips with real-time validation
- **Progress Bar**: Updated to 3-step visual indicator across all onboarding pages
- **Validation**: Flexible validation requiring at least one personal field to be filled

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
- RooMe blue selection state (#0390D7)
- Bold titles with `text-lg font-bold`

#### 3. Visual Design System
**Primary Brand Colors**:
- RooMe Blue: `#0390D7` - Primary brand color, CTA buttons, RooMe text, selection states
- Hover Blue: `#027BB8` - Button hover states, active interactions
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

## Responsive Design Specifications

### Desktop (1440px width)
- **Viewport**: 1440px width
- **Main content container**: max-width 1200px, centered
- **Accommodation cards**: 3-column grid, each card width ~360px, gap 24px between cards
- **Top navigation bar height**: 80px
- **Footer height**: 100px
- **Above-the-fold content height**: ~800px

### Tablet (768–1024px)
- **Viewport**: 768–1024px
- **Content container**: 90% of viewport width, centered
- **Accommodation cards**: 2-column grid, gap 16–24px
- **Top navigation**: 60px height
- **Card width**: Adjusts to fit grid

### Mobile (360–375px)
- **Viewport**: 360–375px
- **Content container**: 95% of viewport width
- **Accommodation layout**: Single-column layout for cards
- **Top navigation**: 50px height
- **Content padding**: 16px around content

### General Rules
- All widths, heights, and spacing scale naturally with screen size
- Grid maintains consistent gutter and alignment across breakpoints
- Responsive containers use `.responsive-container` class
- Property grids use `.responsive-grid` class
- Navigation heights use `.app-nav` class

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

**Primary Database**: PostgreSQL with Supabase hosting for enterprise-grade scalability and reliability. Key schema design decisions:

- **User Management**: Supports both local signup with bcrypt password hashing and Supabase Auth integration
- **Property Listings**: Flexible schema supporting multiple property types (boarding houses, lodges, hotels, apartments, guesthouses) with amenities, pricing, and location data
- **Booking System**: Complete booking lifecycle with status tracking and guest-host relationships  
- **Communication**: Built-in messaging system for host-guest communication
- **Service Marketplace**: Service provider platform for additional accommodation services
- **Analytics & Tracking**: User behavior analytics and UI component performance monitoring
- **Session Storage**: PostgreSQL-based session storage for authentication persistence

**Database Specifications**:
- **12 Production Tables**: Complete accommodation platform data model
- **156 Columns**: Comprehensive coverage of all business requirements
- **21 Foreign Key Relationships**: Full referential integrity
- **JSONB Fields**: Flexible data storage for amenities, preferences, and metadata
- **UUID Primary Keys**: Distributed-ready unique identifiers

## Authentication & Authorization

**Replit OIDC Integration**: Leverages Replit's authentication system for secure user management:

- **Session Management**: Express-session with PostgreSQL storage for persistence
- **Authorization**: Role-based access control (guest, host, admin) with route protection
- **Security**: HTTPS-only cookies with proper CSRF protection

## External Dependencies

- **Supabase**: Enterprise PostgreSQL hosting with real-time capabilities, automated backups, and global CDN
- **Replit Authentication**: OIDC-based authentication service for user management (with fallback to local auth)
- **Radix UI**: Accessible UI component primitives for consistent, compliant user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and responsive design
- **TanStack Query**: Server state management and caching with optimistic updates
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL support and automatic migrations
- **Vite**: Modern build tool and development server with hot module replacement
- **Express.js**: Web application framework for Node.js with middleware support