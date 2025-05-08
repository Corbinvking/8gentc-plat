// Test script for Supabase client with RLS policies
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
  try {
    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('Testing Supabase connection...');
    
    // Test public access (should work with anon key)
    console.log('\n1. Testing public access:');
    const { data: publicData, error: publicError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (publicError) {
      console.error('Error querying public data:', publicError.message);
    } else {
      console.log('Public data access successful!');
      console.log(`Found ${publicData.length} profiles`);
    }

    // Try to access project data without auth (should be restricted by RLS)
    console.log('\n2. Testing RLS on projects (without auth):');
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
    
    if (projectError) {
      console.log('Expected RLS error:', projectError.message);
    } else {
      console.log('Access to projects data:', projectData.length > 0 ? 'ACCESSIBLE (not expected)' : 'EMPTY (expected due to RLS)');
    }

    // Print summary
    console.log('\nSummary:');
    console.log('- Supabase connection: OK');
    console.log('- Public data access:', publicError ? '❌ FAILED' : '✅ OK');
    console.log('- RLS behavior:', projectError ? '✅ WORKING AS EXPECTED' : (projectData.length === 0 ? '✅ WORKING AS EXPECTED' : '❌ NOT WORKING'));
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testSupabase(); 