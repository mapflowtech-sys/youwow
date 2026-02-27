import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// ВАЖНО: Загрузить переменные ДО импорта любых модулей
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrder() {
  const orderId = process.argv[2];

  if (!orderId) {
    console.error('Usage: npx tsx check-order.ts <orderId>');
    process.exit(1);
  }

  console.log(`\nChecking order: ${orderId}\n`);

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    console.error('Order not found!', error);
    process.exit(1);
  }

  console.log('=== ORDER STATUS ===');
  console.log('ID:', order.id);
  console.log('Status:', order.status);
  console.log('Email:', order.customer_email);
  console.log('Created:', new Date(order.created_at).toLocaleString('ru-RU'));
  console.log('Payment ID:', order.payment_id || 'N/A');
  console.log('Payment Provider:', order.payment_provider || 'N/A');
  console.log('Result URL:', order.result_url || 'N/A');
  console.log('Error:', order.error_message || 'N/A');

  if (order.result_metadata) {
    console.log('\n=== METADATA ===');
    console.log(JSON.stringify(order.result_metadata, null, 2));
  }

  if (order.input_data) {
    console.log('\n=== INPUT DATA ===');
    const inputData = order.input_data;
    console.log('Voice:', inputData.voice);
    console.log('Genre:', inputData.genre);
    console.log('About Who:', inputData.aboutWho);
    console.log('About What:', inputData.aboutWhat?.substring(0, 100) + '...');
  }
}

checkOrder().catch(console.error);
