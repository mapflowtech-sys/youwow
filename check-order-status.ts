import { getOrderById } from './lib/db-helpers';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function checkOrder() {
  const orderId = process.argv[2];

  if (!orderId) {
    console.error('Usage: npx tsx check-order-status.ts <orderId>');
    process.exit(1);
  }

  console.log(`Checking order: ${orderId}`);

  const order = await getOrderById(orderId);

  if (!order) {
    console.error('Order not found!');
    process.exit(1);
  }

  console.log('\n=== ORDER STATUS ===');
  console.log('ID:', order.id);
  console.log('Status:', order.status);
  console.log('Email:', order.customer_email);
  console.log('Created:', order.created_at);
  console.log('Payment ID:', order.payment_id);
  console.log('Payment Provider:', order.payment_provider);
  console.log('Result URL:', order.result_url);
  console.log('Error:', order.error_message);

  if (order.result_metadata) {
    console.log('\n=== METADATA ===');
    console.log(JSON.stringify(order.result_metadata, null, 2));
  }

  if (order.input_data) {
    console.log('\n=== INPUT DATA ===');
    console.log(JSON.stringify(order.input_data, null, 2));
  }
}

checkOrder().catch(console.error);
