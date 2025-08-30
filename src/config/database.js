const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase credentials not found. Please connect to Supabase.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const initDatabase = async () => {
  try {
    // Test the connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist
      throw error;
    }
    
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('💡 Please click "Connect to Supabase" in the top right to set up your database');
    }
    return false;
  }
};

module.exports = {
  supabase,
  initDatabase
};