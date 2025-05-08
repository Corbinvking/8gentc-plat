# 8gentc AI Platform

This is a Next.js application with Supabase integration for authentication and data storage.

## Development Setup

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the development server
   ```bash
   npm run dev
   ```

## Deployment Guide

When deploying to production, pay close attention to the following:

### Environment Variables

Ensure these environment variables are set in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NODE_ENV` - Set to "production"

### Common Deployment Issues

#### MIDDLEWARE_INVOCATION_FAILED Error

If you encounter a `500: INTERNAL_SERVER_ERROR` with the code `MIDDLEWARE_INVOCATION_FAILED` during deployment, this may be caused by the authentication middleware failing.

**Solution:**

1. **Environment Variables:** Ensure all required environment variables are correctly set in your deployment platform. Double-check that your Supabase credentials are valid.

2. **Cookies:** The application uses cookies for authentication. Ensure your deployment platform is configured to pass cookies correctly.

3. **Updated Code:** The latest version of the code includes improvements to handle middleware errors gracefully. Make sure you're using the latest code with error handling.

4. **Client-side Fallback:** The application now includes client-side authentication checks as a fallback in case middleware fails, reducing the risk of your application being inaccessible.

### Testing After Deployment

1. Test both authenticated and unauthenticated routes.
2. Verify that redirects to the login page work correctly.
3. Check the browser console for any authentication-related errors.

## Architecture

- **Authentication:** Handled by Supabase Auth with middleware for route protection
- **Database:** Supabase PostgreSQL database
- **Frontend:** Next.js with React
- **UI:** Tailwind CSS with shadcn/ui components

## Troubleshooting

If you're experiencing issues with authentication:

1. Check that your Supabase credentials are correct
2. Verify that your Supabase tables (profiles, etc.) are set up correctly
3. Look for errors in the browser console related to authentication
4. Check network requests for any failed API calls to Supabase

If you encounter any other issues, please contact the development team. 