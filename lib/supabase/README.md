# Supabase Setup Instructions

This document outlines how to set up Supabase for the 8gentc platform.

## Creating a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project by clicking "New Project"
3. Fill in the project details:
   - Name: 8gentc
   - Database Password: (create a strong password)
   - Region: (choose the closest to your users)
4. Click "Create new project" and wait for the project to be set up

## Configuring Environment Variables

1. Once your project is created, go to the project dashboard
2. Navigate to Settings > API
3. Copy the following values into your `.env.local` file:
   - Project URL: `NEXT_PUBLIC_SUPABASE_URL`
   - Project API Key (anon, public): `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key (for migrations): `SUPABASE_SERVICE_ROLE_KEY`

## Running Database Migrations

### Using the Supabase Web Interface

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy the contents of `migrations/01_initial_schema.sql` into the editor
5. Click "Run" to execute the SQL

### Using Supabase CLI (Alternative)

If you prefer to use the Supabase CLI:

1. Install the Supabase CLI: `npm install -g supabase`
2. Initialize Supabase: `supabase init`
3. Link to your project: `supabase link --project-ref <your-project-id>`
4. Push the migration: `supabase db push`

## Enabling Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Under "Site URL", add your application's URL (e.g., `http://localhost:3000` for local development)
3. Under "Redirect URLs", add authorized redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000`
   - Your production URLs if applicable
4. Under "Email Auth", ensure "Enable Email Signup" is enabled
5. (Optional) Configure additional providers like Google, GitHub, etc.

## Row-Level Security (RLS)

The migrations file already contains the necessary RLS policies for all tables. These policies ensure:

1. Users can only access their own data
2. Project owners can manage their projects
3. Project participants can view and modify project content
4. All users can read from the AI cache

## Setting Up a New 8gentc Instance

1. Create a Supabase project as described above
2. Clone this repository
3. Copy `.env.example` to `.env.local` and add your Supabase credentials
4. Run the migrations
5. Start the application: `npm run dev`

## Troubleshooting

- If you encounter issues with RLS policies, ensure you're correctly authenticating users
- For database errors, check the Supabase database logs in the dashboard
- Ensure your API keys and URLs are correctly set in the environment variables 