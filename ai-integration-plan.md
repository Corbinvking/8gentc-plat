# 8gentc Platform - AI Integration and Enhancement Plan

This document outlines the steps required to transform the current UI scaffold into a fully functional AI-powered platform with proper authentication and data persistence.

## Phase 1: Backend Infrastructure

### 1.1 Database Setup
- **Create Supabase Project**
  - Set up PostgreSQL database
  - Define schema for users, projects, conversations, and AI interactions
  - Configure Row Level Security (RLS) policies

- **Database Schema**:
  ```sql
  -- Users table
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
  );

  -- Projects table
  CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID REFERENCES users(id) NOT NULL
  );

  -- Project members junction table
  CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    PRIMARY KEY (project_id, user_id)
  );

  -- Conversations table
  CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Messages table
  CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_ai BOOLEAN DEFAULT FALSE,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Project artifacts table (for generated documents, diagrams, etc.)
  CREATE TABLE artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    content JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

### 1.2 Authentication System
- **Implement Supabase Auth**
  - `file: lib/supabase.ts` - Client setup
  - `file: lib/auth.tsx` - Updated auth provider using Supabase
  - Social login integration (Google, GitHub)
  - Email verification workflow
  - Password reset functionality

### 1.3 API Routes
- **Create API Endpoints**
  - `file: app/api/auth/[...nextauth]/route.ts` - Auth endpoints
  - `file: app/api/projects/route.ts` - Project CRUD operations
  - `file: app/api/conversations/route.ts` - Conversation management
  - `file: app/api/messages/route.ts` - Message handling
  - `file: app/api/ai/generate/route.ts` - AI generation endpoints

## Phase 2: AI Integration

### 2.1 AI Service Setup
- **OpenAI Integration**
  - `file: lib/openai.ts` - OpenAI client setup
  - Environment variables configuration
  - Rate limiting and error handling
  - Token usage tracking

- **AI Prompt Engineering**
  - `file: lib/prompts/business-context.ts` - Context-specific prompts
  - `file: lib/prompts/goals.ts` - Goal-setting prompts
  - `file: lib/prompts/timelines.ts` - Timeline generation prompts
  - System messages for maintaining conversation context

### 2.2 Chat Interface Enhancement
- **Real-time Messaging**
  - `file: components/chat-interface.tsx` - New component for AI chat
  - Implement message sending functionality
  - Display AI responses with typing indicators
  - Handle message history and pagination

- **AI Command System**
  - Implement slash commands for specific AI actions
  - Command palette for accessing AI capabilities
  - Contextual suggestions based on conversation

### 2.3 Content Generation
- **Document Generation**
  - Implementation of the "Export Summary" functionality
  - PDF/Word export capabilities
  - Template-based document generation

- **Canvas Visualization Generation**
  - Dynamic node graph generation based on conversation context
  - Mermaid diagram generation from project data
  - Text document compilation and formatting

## Phase 3: Data Persistence and Collaboration

### 3.1 Project Management
- **CRUD Operations**
  - `file: components/project-dialog.tsx` - Project creation/editing UI
  - `file: lib/hooks/use-projects.ts` - Hook for project data
  - Project listing and selection functionality
  - Project metadata management

- **Collaborative Editing**
  - Real-time presence indicators
  - User avatars and status
  - Edit history and version tracking

### 3.2 Data Storage and Retrieval
- **Supabase Storage**
  - File upload functionality for attachments
  - Image processing for avatars and attachments
  - Secure access controls

- **Search Functionality**
  - Full-text search across conversations and documents
  - Filters for project content
  - Semantic search for related content

### 3.3 State Management
- **Global State**
  - `file: lib/stores/project-store.ts` - Project state
  - `file: lib/stores/conversation-store.ts` - Conversation state
  - `file: lib/stores/user-store.ts` - User state
  - State persistence between sessions

## Phase 4: UI Enhancements and Integration

### 4.1 Integration with Existing UI
- **Chat Panel Updates**
  - Connect existing UI to real backend
  - Implement proper scrolling and history loading
  - Add real-time updates for new messages

- **Canvas Integration**
  - Connect visualization modes to AI-generated content
  - Implement saving and loading of visualizations
  - Add editing capabilities for generated content

### 4.2 User Experience Improvements
- **Loading States**
  - Skeleton loaders for content loading
  - Proper error handling and retry mechanisms
  - Optimistic updates for better perceived performance

- **Responsive Design Enhancements**
  - Mobile view optimizations
  - Adaptive layouts for different screen sizes
  - Touch interaction improvements

### 4.3 New Features
- **Notifications System**
  - In-app notifications for mentions and updates
  - Email notifications for important events
  - Notification preferences management

- **Analytics Dashboard**
  - Project progress tracking
  - Usage statistics and insights
  - Activity logs and audit trails

## Implementation Strategy

### Key Files to Create/Modify:

1. **Backend Integration**
   - `lib/supabase.ts` - Supabase client
   - `lib/api.ts` - API client for backend communication
   - `app/api/*` - API route handlers

2. **AI Components**
   - `components/ai/chat-message.tsx` - AI message component
   - `components/ai/prompt-suggestions.tsx` - Dynamic AI prompts
   - `components/ai/canvas-generator.tsx` - AI visualization generator

3. **State Management**
   - `lib/stores/*` - State management for different sections
   - `lib/hooks/*` - Custom hooks for data fetching and updates

4. **Enhanced UI Components**
   - `components/projects/project-list.tsx` - Project selection
   - `components/chat/message-list.tsx` - Enhanced message display
   - `components/canvas/interactive-canvas.tsx` - Interactive canvas

### Suggested Tech Stack Extensions:
- **Supabase**: Database, authentication, storage
- **OpenAI API**: AI functionality
- **Zustand/Jotai**: State management
- **React Query**: Data fetching and caching
- **Socket.io**: Real-time collaborative features
- **React-PDF**: Document generation
- **React-Mermaid**: Dynamic diagram generation

## Phased Rollout Plan

1. **Phase 1 (Weeks 1-2)**
   - Database and authentication setup
   - Basic API routes implementation
   - Auth system integration with existing UI

2. **Phase 2 (Weeks 3-4)**
   - AI service integration
   - Chat functionality implementation
   - Basic content generation features

3. **Phase 3 (Weeks 5-6)**
   - Data persistence implementation
   - Project management features
   - Search functionality

4. **Phase 4 (Weeks 7-8)**
   - UI integration and enhancements
   - Performance optimizations
   - Testing and bug fixing

5. **Launch (Week 9)**
   - Final QA and user acceptance testing
   - Production deployment
   - Monitoring and feedback collection 