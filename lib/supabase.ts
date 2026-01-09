import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Warning: If these are not set, the app will throw an error or fail to connect.
// Users must add these to .env.local
export const supabase = createClient(supabaseUrl, supabaseKey);
