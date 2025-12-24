import axios from 'axios';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: '.env.local' });

const GENAPI_BASE_URL = 'https://api.gen-api.ru/api/v1';
const API_KEY = process.env.GENAPI_API_KEY;

if (!API_KEY) {
  console.error('❌ GENAPI_API_KEY не найден в .env.local');
  process.exit(1);
}

const genapi = axios.create({
  baseURL: GENAPI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

async function checkBalance() {
  console.log('💰 Проверка баланса GenAPI...\n');

  const possibleEndpoints = [
    '/user/balance',
    '/account/balance',
    '/balance',
    '/user/info',
    '/account/info',
    '/user',
    '/account',
    '/me',
    '/profile',
  ];

  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`🔍 Пробуем: GET ${endpoint}`);
      const response = await genapi.get(endpoint);

      console.log(`✅ Успешно! Найден endpoint: ${endpoint}`);
      console.log('📋 Ответ:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('\n');

      return;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          console.log(`   ❌ Не найден (404)`);
        } else {
          console.log(`   ⚠️  Ошибка ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        }
      } else {
        console.log(`   ⚠️  Ошибка: ${error}`);
      }
    }
  }

  console.log('\n⚠️  Не удалось найти endpoint для проверки баланса');
  console.log('💡 Но мы видим стоимость запросов в ответе (поле "cost")');
}

// Запускаем проверку
checkBalance();
