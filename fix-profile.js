require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// The user ID to check/create profile for
const userId = process.argv[2]; // Pass user ID as command line argument
const userEmail = process.argv[3]; // Pass email as command line argument
const userName = process.argv[4] || 'User'; // Pass name as command line argument or default to "User"

if (!userId || !userEmail) {
  console.error('Usage: node fix-profile.js <userId> <email> [name]');
  process.exit(1);
}

async function main() {
  console.log(`Checking profile for user: ${userId}`);
  
  // Check if profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
    console.error('Error fetching profile:', fetchError);
    process.exit(1);
  }
  
  if (existingProfile) {
    console.log('Profile already exists:');
    console.log(existingProfile);
    
    // Check if role column exists
    if (!existingProfile.hasOwnProperty('role')) {
      console.log('Role column not found, running migration...');
      
      // Apply role migration directly
      const { error: alterError } = await supabase.rpc(
        'execute_sql',
        { 
          sql: `
            -- Add role column to profiles table if it doesn't exist
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'role'
              ) THEN
                ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;
                ALTER TABLE profiles ADD CONSTRAINT valid_roles CHECK (role IN ('user', 'admin', 'moderator'));
              END IF;
            END
            $$;
          `
        }
      );
      
      if (alterError) {
        console.error('Error applying role migration:', alterError);
        console.log('Trying update without migration...');
      }
      
      // Update the profile with role
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', userId)
        .select();
      
      if (updateError) {
        console.error('Error updating profile with role:', updateError);
      } else {
        console.log('Profile updated with role:');
        console.log(updatedProfile);
      }
    }
  } else {
    console.log('Profile not found, creating new profile...');
    
    // Create new profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: userId,
          email: userEmail,
          name: userName,
          role: 'user'  // Default role
        }
      ])
      .select();
    
    if (insertError) {
      console.error('Error creating profile:', insertError);
      
      // If role column error, try creating without it
      if (insertError.message.includes('role')) {
        console.log('Trying to create profile without role column...');
        const { data: profileWithoutRole, error: insertError2 } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId,
              email: userEmail,
              name: userName
            }
          ])
          .select();
        
        if (insertError2) {
          console.error('Error creating profile without role:', insertError2);
        } else {
          console.log('Profile created without role:');
          console.log(profileWithoutRole);
        }
      }
    } else {
      console.log('Profile created successfully:');
      console.log(newProfile);
    }
  }
}

main()
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 