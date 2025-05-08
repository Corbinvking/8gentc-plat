// Test script for Supabase authentication with sign-in and RLS
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Replace with the email and user ID from the previous test
const TEST_EMAIL = 'test1746722728227@gmail.com';
const TEST_PASSWORD = 'Password123!';

async function testSupabaseAuthSignIn() {
  try {
    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('Testing Supabase authenticated access...');
    
    // Step 1: Sign in with the test user
    console.log(`\n1. Attempting to sign in with: ${TEST_EMAIL}`);
    const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    
    if (signinError) {
      console.error('Error signing in:', signinError.message);
      if (signinError.message.includes('Email not confirmed')) {
        console.log('\nYou need to confirm the email address in the Supabase dashboard first.');
        console.log('Please go to the Supabase dashboard -> Authentication -> Users and confirm the email.');
      }
      return;
    } else {
      console.log('✅ Sign-in successful!');
      console.log('User ID:', signinData.user.id);
    }
    
    // Step 2: Try to create a profile for the authenticated user
    console.log('\n2. Creating a profile for the authenticated user:');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: signinData.user.id,
          email: TEST_EMAIL,
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
    
    // Step 3: Try to create a project for the authenticated user
    console.log('\n3. Creating a project for the authenticated user:');
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert([
        { 
          name: 'Test Project',
          description: 'A test project created through the API',
          user_id: signinData.user.id,
        }
      ])
      .select();
    
    if (projectError) {
      console.error('Error creating project:', projectError.message);
    } else {
      console.log('✅ Project created successfully!');
      console.log(projectData);
    }
    
    // Step 4: Summary of the test results
    console.log('\nSummary:');
    console.log('- Supabase authentication:', signinError ? '❌ FAILED' : '✅ OK');
    console.log('- Profile creation:', profileError ? '❌ FAILED' : '✅ OK');
    console.log('- Project creation:', projectError ? '❌ FAILED' : '✅ OK');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testSupabaseAuthSignIn(); 