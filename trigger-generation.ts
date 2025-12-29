import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function triggerGeneration() {
  const orderId = process.argv[2];

  if (!orderId) {
    console.error('Usage: npx tsx trigger-generation.ts <orderId>');
    process.exit(1);
  }

  console.log(`\nTriggering song generation for order: ${orderId}\n`);

  try {
    const response = await fetch('http://localhost:3000/api/song/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to trigger generation:', errorText);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Generation triggered successfully!');
    console.log(JSON.stringify(result, null, 2));
    console.log('\nCheck order status in a few minutes with:');
    console.log(`npx tsx check-order.ts ${orderId}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

triggerGeneration().catch(console.error);
