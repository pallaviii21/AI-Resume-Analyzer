const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseKey !== 'your_supabase_anon_key';

let supabase = null;

if (isConfigured) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('🗄️   Supabase connected.');
} else {
  console.warn(
    '⚠️   SUPABASE_URL / SUPABASE_ANON_KEY not set — running without DB persistence.'
  );
}

module.exports = supabase;
