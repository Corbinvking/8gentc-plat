-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;

-- Create an enum for user roles via a check constraint
ALTER TABLE profiles ADD CONSTRAINT valid_roles CHECK (role IN ('user', 'admin', 'moderator'));

-- Create an admin function for promoting users to different roles
CREATE OR REPLACE FUNCTION promote_user(user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET role = new_role
  WHERE id = user_id AND new_role IN ('user', 'admin', 'moderator');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for role-based access
CREATE POLICY "Allow admins to read all profiles" 
ON profiles FOR SELECT 
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Update existing profiles to have the 'user' role (if already set to NULL)
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- Comment for documentation
COMMENT ON COLUMN profiles.role IS 'User role for access control. Values: user, admin, moderator';
