import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listRecentOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, customer_email, created_at, result_url')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('\n=== RECENT ORDERS (Last 10) ===\n');

  data.forEach((order, index) => {
    console.log(`${index + 1}. ID: ${order.id}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Email: ${order.customer_email}`);
    console.log(`   Created: ${new Date(order.created_at).toLocaleString('ru-RU')}`);
    console.log(`   Result URL: ${order.result_url || 'N/A'}`);
    console.log('');
  });
}

listRecentOrders().catch(console.error);
