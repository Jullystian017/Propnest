import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // use service role to bypass RLS for diagnostics

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  console.log('--- DIAGNOSIS START ---');
  
  // 1. Check tables
  const { data: tables, error: tableError } = await supabase
    .from('properties')
    .select('*')
    .limit(5);
    
  if (tableError) {
    console.error('Error fetching properties:', tableError);
  } else {
    console.log('Properties found (total first 5):', tables.length);
    console.log('Schema sample:', Object.keys(tables[0] || {}));
    if (tables.length > 0) {
      console.log('First property:', JSON.stringify(tables[0], null, 2));
    }
  }

  // 2. Check for users
  const { data: users, error: userError } = await supabase
    .from('profiles') // or wherever users are stored
    .select('*')
    .limit(1);
    
  console.log('--- DIAGNOSIS END ---');
}

diagnose();
