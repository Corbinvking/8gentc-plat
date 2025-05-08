// Simple script to check if our tables exist in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  try {
    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Try to query a few key tables to see if they exist
    console.log('Checking tables...');
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('Error querying profiles table:', profilesError.message);
    } else {
      console.log('✅ Profiles table exists');
    }

    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (projectsError) {
      console.error('Error querying projects table:', projectsError.message);
    } else {
      console.log('✅ Projects table exists');
    }

    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (conversationsError) {
      console.error('Error querying conversations table:', conversationsError.message);
    } else {
      console.log('✅ Conversations table exists');
    }
    
    console.log('Schema check complete');
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

checkSchema(); 