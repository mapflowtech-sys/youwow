// Test script to debug 1plat API
// Test with different formats
// Testing with non-round amounts as suggested by 1plat support
const tests = [
  { shopId: '1296', secret: 'Kogortalove1!', email: 'test@example.com', amount: 137, name: 'Test 1: 137₽' },
  { shopId: '1296', secret: 'Kogortalove1!', email: 'test@example.com', amount: 149, name: 'Test 2: 149₽' },
  { shopId: '1296', secret: 'Kogortalove1!', email: 'test@example.com', amount: 163, name: 'Test 3: 163₽' },
  { shopId: '1296', secret: 'Kogortalove1!', email: 'test@example.com', amount: 591, name: 'Test 4: 591₽' },
  { shopId: '1296', secret: 'Kogortalove1!', email: 'test@example.com', amount: 597, name: 'Test 5: 597₽' },
];

console.log('Testing 1plat API with multiple configurations...\n');

const testPayment = async (config) => {
  console.log(`\n━━━ Testing: ${config.name} ━━━`);
  console.log('Shop ID:', config.shopId, `(type: ${typeof config.shopId})`);
  console.log('Secret length:', config.secret.length);
  console.log('Secret preview:', config.secret.slice(0, 5) + '...');
  console.log('Secret full:', JSON.stringify(config.secret));

  try {
    const requestBody = {
      merchant_order_id: 'test-' + Date.now(),
      user_id: 123456,
      amount: config.amount,
      email: config.email,
      method: 'card'
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-shop': String(config.shopId),
      'x-secret': config.secret,
    };

    console.log('\n📤 SENDING REQUEST:');
    console.log('URL:', 'https://1plat.cash/api/merchant/order/create/by-api');
    console.log('Method:', 'POST');
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://1plat.cash/api/merchant/order/create/by-api', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status, response.statusText);

    const text = await response.text();
    console.log('Response body:', text);

    if (response.ok) {
      const data = JSON.parse(text);
      console.log('✅ SUCCESS! Payment created');
      return true;
    } else {
      console.log('❌ FAILED!');
      return false;
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    return false;
  }
};

(async () => {
  for (const config of tests) {
    await testPayment(config);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 sec between tests
  }
})();
