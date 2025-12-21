import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Загружаем .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testConnection() {
  console.log('🔍 Проверка подключения к Supabase...\n');

  // Тест 1: Проверка переменных окружения
  console.log('1️⃣ Проверка переменных окружения:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ установлена' : '❌ не найдена');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ установлена' : '❌ не найдена');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ установлена' : '❌ не найдена');
  console.log('');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Переменные окружения не найдены! Проверьте файл .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Тест 2: Проверка подключения к БД
  console.log('2️⃣ Проверка подключения к базе данных:');
  try {
    const { data, error } = await supabase
      .from('service_options')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Ошибка подключения:', error.message);
      console.error('Детали:', error);
      return;
    }

    console.log('✅ Подключение успешно!');
    console.log(`✅ Найдено записей в service_options: ${data.length}`);
    console.log('');

    // Тест 3: Проверка таблиц
    console.log('3️⃣ Проверка таблиц:');

    const tables = ['users', 'orders', 'service_options'];
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Таблица ${table}: ошибка - ${error.message}`);
      } else {
        console.log(`✅ Таблица ${table}: найдено ${count} записей`);
      }
    }

    console.log('');
    console.log('4️⃣ Пример данных из service_options:');
    if (data && data.length > 0) {
      data.forEach((item: any, i: number) => {
        console.log(`${i + 1}. ${item.service_type} - ${item.option_key}: ${item.option_value}`);
      });
    }

    console.log('\n✨ Все проверки пройдены успешно!');

  } catch (err: any) {
    console.error('❌ Критическая ошибка:', err.message);
  }
}

testConnection();
