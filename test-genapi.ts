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

async function testGenAPIConnection() {
  console.log('🔍 Проверка соединения с GenAPI...\n');
  console.log(`📡 Base URL: ${GENAPI_BASE_URL}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}\n`);

  try {
    // Сначала проверим информацию об аккаунте и баланс
    console.log('👤 Получение информации об аккаунте...');
    const userInfo = await genapi.get('/user');
    console.log(`✅ Пользователь: ${userInfo.data.name}`);
    console.log(`📧 Email: ${userInfo.data.email}`);
    console.log(`💰 Баланс: ${userInfo.data.balance} руб.`);
    console.log(`📅 Аккаунт создан: ${new Date(userInfo.data.created_at).toLocaleDateString('ru-RU')}\n`);

  } catch (error) {
    console.error('❌ Ошибка при получении информации об аккаунте:', error);
  }

  try {
    // Попробуем сделать простой запрос к ChatGPT для тестирования
    console.log('🧪 Тест 1: Создание простого запроса к ChatGPT (gpt-5-2)...');
    const response = await genapi.post('/networks/gpt-5-2', {
      messages: [
        { role: 'user', content: 'Скажи "Привет" одним словом' }
      ],
      max_tokens: 10,
      temperature: 0.7,
    });

    const requestId = response.data.request_id;
    console.log(`✅ Запрос создан! Request ID: ${requestId}`);
    console.log(`📊 Статус: ${response.data.status}`);

    // Проверяем статус запроса
    console.log('\n🔄 Проверка статуса запроса...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Ждём 3 секунды

    const statusResponse = await genapi.get(`/request/get/${requestId}`);
    console.log(`📊 Текущий статус: ${statusResponse.data.status}`);

    if (statusResponse.data.cost !== undefined) {
      console.log(`💵 Стоимость запроса: ${statusResponse.data.cost} руб.`);
    }

    if (statusResponse.data.runtime !== undefined) {
      console.log(`⏱️  Время выполнения: ${statusResponse.data.runtime} сек.`);
    }

    if (statusResponse.data.result?.[0]?.message?.content) {
      console.log(`✨ Результат: "${statusResponse.data.result[0].message.content}"`);
    } else if (statusResponse.data.output) {
      console.log(`✨ Результат: ${statusResponse.data.output}`);
    }

    console.log('\n✅ Соединение с GenAPI работает корректно!');
    console.log('✅ API ключ валиден');
    console.log('✅ Баланс достаточен для работы');

    // Проверим баланс снова после запроса
    const userInfoAfter = await genapi.get('/user');
    console.log(`\n💰 Баланс после тестового запроса: ${userInfoAfter.data.balance} руб.`);

  } catch (error) {
    console.error('\n❌ Ошибка при подключении к GenAPI:');

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`Статус: ${error.response.status}`);
        console.error('Ответ:', JSON.stringify(error.response.data, null, 2));

        if (error.response.status === 401) {
          console.error('\n⚠️  Ошибка авторизации! Проверьте правильность API ключа в .env.local');
        } else if (error.response.status === 402) {
          console.error('\n⚠️  Недостаточно средств на балансе!');
        } else if (error.response.status === 429) {
          console.error('\n⚠️  Превышен лимит запросов!');
        }
      } else if (error.request) {
        console.error('Запрос был отправлен, но ответ не получен');
        console.error('Проверьте интернет-соединение');
      } else {
        console.error('Ошибка:', error.message);
      }
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

// Запускаем тест
testGenAPIConnection();
