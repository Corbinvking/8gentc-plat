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

-- Comment for the function
COMMENT ON FUNCTION create_user_profile IS 'Creates a user profile with the specified details, bypassing RLS policies';

