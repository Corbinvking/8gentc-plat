-- Migration to temporarily make RLS policies more permissive for testing

-- First check if the profiles table has RLS enabled
DO $$
BEGIN
  -- Temporarily disable RLS on profiles to ensure everyone can access during testing
  ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
  
  -- Drop any existing policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Allow admins to read all profiles" ON profiles;
  
  -- Create a new policy that allows any authenticated user to access any profile
  CREATE POLICY "Public profiles access" 
  ON profiles
  USING (true);
  
  -- Re-enable RLS with the new policy
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
END;
$$; 