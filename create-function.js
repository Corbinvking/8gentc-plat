require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// SQL function definition
const createFunctionSQL = `
-- Create an RPC function that allows authenticated users to create their own profile
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Run with privileges of the function creator
AS $$
DECLARE
  has_role_column BOOLEAN;
BEGIN
  -- Check if the user is authenticated and creating their own profile
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'You can only create a profile for yourself';
  END IF;
  
  -- Check if the role column exists
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) INTO has_role_column;
  
  -- Insert or update the profile based on whether role column exists
  IF has_role_column THEN
    INSERT INTO profiles (id, email, name, role)
    VALUES (user_id, user_email, user_name, 'user')
    ON CONFLICT (id) 
    DO UPDATE SET 
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      updated_at = NOW();
  ELSE
    INSERT INTO profiles (id, email, name)
    VALUES (user_id, user_email, user_name)
    ON CONFLICT (id) 
    DO UPDATE SET 
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      updated_at = NOW();
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
    RETURN FALSE;
END;
$$;
`;

// SQL to add RLS policies
const addPoliciesSQL = `
-- Add RLS policy for profiles table to allow users to read their own profile
DO $$
BEGIN
  -- First check if the policy already exists to avoid errors
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);
  END IF;

  -- Check if the policy for inserting already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);
  END IF;

  -- Check if the policy for updating already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
  END IF;
END;
$$;

-- Make sure RLS is enabled on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
`;

async function createFunction() {
  try {
    console.log('Creating RPC function in Supabase...');
    
    // Try to create the function
    const { error: funcError } = await supabase.rpc('executeSQL', {
      query: createFunctionSQL
    });
    
    if (funcError) {
      console.error('Error creating function:', funcError);
      console.log('Trying alternate method...');
      
      // Try with a different approach
      const { error: sqlError } = await supabase
        .from('_sql_queries')
        .insert({ query: createFunctionSQL });
      
      if (sqlError) {
        console.error('Error with alternate method:', sqlError);
        return false;
      }
    }
    
    console.log('Adding RLS policies...');
    
    // Try to add policies
    const { error: policyError } = await supabase.rpc('executeSQL', {
      query: addPoliciesSQL
    });
    
    if (policyError) {
      console.error('Error adding policies:', policyError);
      return false;
    }
    
    console.log('Function and policies created successfully!');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

createFunction()
  .then(success => {
    if (success) {
      console.log('Database setup complete!');
    } else {
      console.log('Database setup failed. Please check errors above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Script error:', error);
    process.exit(1);
  }); 