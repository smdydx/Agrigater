# ServiceHub - Local Services Aggregator

## Overview

ServiceHub is a comprehensive local services aggregator platform that connects users with nearby spas, salons, massage centers, and other wellness services. The application provides a seamless experience for discovering, booking, and managing appointments with service providers in the user's vicinity.

The platform features both mobile-first web application and React Native components, offering real-time location-based service discovery, instant booking capabilities, integrated payment processing, and comprehensive user management. The system is designed to scale efficiently and support multiple service categories with dynamic content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application employs a dual-frontend approach:

**Web Application (React/TypeScript)**
- Built with React 18 and TypeScript for type safety and modern development practices
- Utilizes Wouter for lightweight client-side routing instead of React Router
- Implements Tailwind CSS with custom design system using CSS variables for consistent theming
- Features Radix UI components for accessible, headless UI primitives
- Structured with a mobile-first responsive design optimized for smartphone usage
- Supports progressive web app capabilities for enhanced mobile experience

**Mobile Application (React Native)**
- Native mobile app with React Navigation for tab-based and stack-based navigation
- Implements location services with GPS integration for service discovery
- Features native device capabilities like phone calls and WhatsApp integration
- Includes splash screen, onboarding flow, and comprehensive booking system

**State Management**
- Uses TanStack Query (React Query) for server state management and caching
- Custom hooks pattern for authentication and data fetching
- Local state management with React hooks for UI interactions

### Backend Architecture
The backend follows a modern Node.js architecture:

**API Design**
- RESTful API built with Express.js and TypeScript
- Implements authentication middleware using Replit's OAuth integration
- Features comprehensive error handling and request/response logging
- Session management with PostgreSQL-backed session store

**Authentication System**
- Integrates Replit OAuth for seamless user authentication
- Implements session-based authentication with secure cookie handling
- Features user profile management with automatic user creation/updates
- Supports JWT token validation for API endpoints

**Route Structure**
- Modular route organization with separate handlers for different domains
- Service discovery endpoints with location-based filtering
- Booking management with status tracking and notifications
- Review and rating system for service quality feedback

### Data Storage Solutions
**Primary Database (PostgreSQL)**
- Uses Neon serverless PostgreSQL for scalable cloud database hosting
- Implements Drizzle ORM for type-safe database operations and migrations
- Features comprehensive schema design supporting users, services, bookings, reviews, and favorites
- Includes geospatial data support for location-based queries

**Schema Design**
- User management with profile information and authentication data
- Service catalog with location coordinates, categories, and pricing information
- Service offerings for detailed service descriptions and pricing tiers
- Booking system with status tracking, scheduling, and payment integration
- Review and rating system with user feedback and service quality metrics

**Session Storage**
- PostgreSQL-based session management for authentication persistence
- Secure session handling with configurable TTL and cleanup processes

### External Dependencies

**Database Infrastructure**
- Neon PostgreSQL for primary data storage with serverless scaling
- Drizzle ORM for database operations and schema management
- Connection pooling for efficient database resource utilization

**Authentication Services**
- Replit OAuth integration for user authentication and authorization
- OpenID Connect protocol implementation for secure identity management
- Session management with connect-pg-simple for PostgreSQL session storage

**Location Services**
- HTML5 Geolocation API for user location detection
- Geographic coordinate storage and distance calculation capabilities
- Location-based service filtering and proximity-based recommendations

**Communication Services**
- Native device integration for phone calls (tel: protocol)
- WhatsApp integration for direct messaging (wa.me links)
- Push notification capabilities for booking updates and reminders

**Payment Processing**
- Framework ready for payment gateway integration (Razorpay, Stripe, PayPal)
- Booking confirmation and payment status tracking
- Support for multiple payment methods including online and cash payments

**Development Tools**
- Vite for fast development server and optimized production builds
- ESBuild for efficient JavaScript/TypeScript compilation
- PostCSS with Autoprefixer for CSS processing and browser compatibility
- TypeScript compilation with strict mode for enhanced code quality

**UI Framework**
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling approach
- Custom design tokens and theming system
- Mobile-responsive design patterns and components