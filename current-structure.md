# 8gentc Platform - Current Structure Documentation

## Project Overview
The 8gentc Platform is a Next.js application designed as a business planning collaboration tool with a sophisticated UI but minimal actual functionality. The application features a login/authentication system and a main dashboard interface with various interactive components.

## Project Structure

### Core Files and Directories
- **`middleware.ts`**: Route protection and authentication middleware
- **`app/`**: Next.js App Router pages and layouts
- **`components/`**: UI components and theme provider
- **`lib/`**: Utility functions and authentication context
- **`public/`**: Static assets
- **`styles/`**: CSS stylesheets

## Application Flow

### Authentication Flow
1. Middleware checks for `auth-token` cookie on all requests
2. Unauthenticated users are redirected to `/login`
3. Login page allows sign-in/sign-up
4. After authentication, users are redirected to the main application
5. Logout button clears the auth cookie and redirects to login

### Page Structure

#### Login Page (`app/login/page.tsx`)
- **Components**:
  - Logo/branding header
  - Tabbed interface (Sign In/Sign Up)
  - Form inputs (email, password, name)
  - Submit buttons with loading states
  - Links to terms and privacy policy
- **Features**:
  - Tab switching between login/signup
  - Form validation and error display
  - Loading indicators
  - Simulated authentication

#### Main Application (`app/page.tsx`)
- **Header Section**:
  - 8gentc logo and branding
  - Project selector with dropdown
  - User info and logout button
  - Utility buttons (Integrations, Settings, Download, Submit)

- **Left Panel - Chat Interface**:
  - General discussion area with AI greeting
  - Section navigation (Context, Goals, Timelines)
  - Message display with toggle between views
  - Suggested prompts for each section
  - Message input field

- **Right Panel - Canvas**:
  - Canvas controls and view toggle
  - View mode selection (Node, Mermaid, Text)
  - Session selector
  - Content visualization based on selected view

## Component Breakdown

### Authentication Components
- **`AuthProvider`** (`lib/auth.tsx`): Context provider for auth state
  - User state management
  - Login/signup functionality
  - Token management via cookies
  - Logout functionality

### UI Components (`components/ui/`)
- **Layout Components**:
  - `accordion.tsx`
  - `card.tsx`
  - `sidebar.tsx`
  - `dialog.tsx`
  - `drawer.tsx`
  - `sheet.tsx`
  
- **Input Components**:
  - `button.tsx`
  - `input.tsx`
  - `checkbox.tsx`
  - `select.tsx`
  - `radio-group.tsx`
  - `textarea.tsx`
  - `form.tsx`
  
- **Display Components**:
  - `avatar.tsx`
  - `badge.tsx`
  - `toast.tsx`
  - `tooltip.tsx`
  - `alert.tsx`
  - `progress.tsx`
  
- **Navigation Components**:
  - `navigation-menu.tsx`
  - `tabs.tsx`
  - `breadcrumb.tsx`
  - `pagination.tsx`
  
- **Interactive Components**:
  - `toggle.tsx`
  - `switch.tsx`
  - `slider.tsx`
  - `calendar.tsx`
  - `carousel.tsx`
  - `command.tsx`

### Theme Components
- **`ThemeProvider`** (`components/theme-provider.tsx`): Manages color scheme

## UI Sections and Functionality

### Project Summary Popup
- **Trigger**: Business Plan Collaboration button
- **Content**:
  - Project metadata and status indicators
  - Business context summary
  - SMART goals outline
  - Timeline visualization
  - Section completion indicators
  - Export functionality (non-functional)

### Section Navigation
- **Context Section**:
  - Business context summary view
  - Completion status indicators
  - Simulated conversation history
  
- **Goals Section**:
  - SMART goals summary view
  - Completion status indicators for goal types
  - Simulated conversation about goals
  
- **Timelines Section**:
  - Timeline summary view
  - Completion status for different time horizons
  - Timeline visualization with key milestones

### Canvas Visualizations
- **Node View**:
  - Business plan structure as interconnected nodes
  - Central node with connected aspect nodes
  
- **Mermaid View**:
  - Business timeline as a flowchart
  - Sequential business phases with descriptions
  
- **Text View**:
  - Formatted business plan document
  - Executive summary, market analysis, product offering, etc.

## Current Limitations
1. **No Backend Integration**: All data is static and simulated
2. **No Real Authentication**: Authentication is simulated with cookies
3. **No Database**: No persistent storage of user data or conversations
4. **No AI Functionality**: AI responses are pre-scripted and static
5. **No Real-Time Collaboration**: Despite the UI suggesting collaborative features

## Files by Functionality

### Authentication System
- `middleware.ts`
- `lib/auth.tsx`
- `app/login/page.tsx`

### Main Application UI
- `app/page.tsx`
- `app/layout.tsx`
- `components/theme-provider.tsx`

### UI Component Library
- All files in `components/ui/` 