import { supabaseAdmin } from './lib/supabase';

async function testDB() {
  console.log('Testing Supabase connection...');

  // Получаем последний заказ
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\nLatest order:');
  console.log('ID:', data.id);
  console.log('Status:', data.status);
  console.log('Result URL:', data.result_url);
  console.log('Result Metadata:', JSON.stringify(data.result_metadata, null, 2));
  console.log('Created:', data.created_at);
  console.log('Completed:', data.completed_at);
}

testDB();
