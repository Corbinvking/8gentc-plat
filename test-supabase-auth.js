// Test script for Supabase authentication and RLS
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseAuth() {
  try {
    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('Testing Supabase authentication and RLS...');
    
    // Step 1: Create a test user (you'll need to confirm this user's email in the Supabase dashboard)
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@gmail.com`;
    const testPassword = 'Password123!';
    
    console.log(`\n1. Attempting to sign up with: ${testEmail}`);
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signupError) {
      console.error('Error signing up:', signupError.message);
      return;
    } else {
      console.log('✅ Sign-up successful!');
      console.log('User ID:', signupData.user.id);
      
      // Note: In a real application, the user would need to confirm their email
      // For this test, you can manually confirm in the Supabase dashboard if needed
      console.log('Note: The user will need email confirmation before they can sign in');
    }
    
    // Step 2: Try to create a profile for the new user
    console.log('\n2. Creating a profile for the new user:');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: signupData.user.id,
          email: testEmail,
          name: 'Test User',
        }
      ])
      .select();
    
    if (profileError) {
      console.error('Error creating profile:', profileError.message);
    } else {
      console.log('✅ Profile created successfully!');
      console.log(profileData);
    }
    
    // Step 3: Summary of the test results
    console.log('\nSummary:');
    console.log('- Supabase authentication:', signupError ? '❌ FAILED' : '✅ OK');
    console.log('- Profile creation:', profileError ? '❌ FAILED' : '✅ OK');
    console.log('\nIMPORTANT: If you want to use this test user, please confirm their email in the Supabase dashboard.');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testSupabaseAuth(); 