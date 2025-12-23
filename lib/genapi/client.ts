import axios from 'axios';

const GENAPI_BASE_URL = 'https://api.gen-api.ru/api/v1';
const API_KEY = process.env.GENAPI_API_KEY;

if (!API_KEY) {
  throw new Error('GENAPI_API_KEY не установлен в переменных окружения');
}

export const genapi = axios.create({
  baseURL: GENAPI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 90000, // 90 секунд
});

// Типы
export type GenerationStatus = 'starting' | 'processing' | 'success' | 'error';

export interface GenerationResponse {
  request_id: number;
  status: GenerationStatus;
  output?: string | string[] | unknown;
  result?: unknown; // Suno возвращает result вместо output
  response_type?: string;
  input?: unknown;
  progress?: number;
  cost?: number;
  runtime?: number;
}

// Проверка статуса задачи
export async function checkRequestStatus(requestId: number): Promise<GenerationResponse> {
  try {
    const response = await genapi.get(`/request/get/${requestId}`);
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown }; message?: string };
      console.error('GenAPI status check error:', axiosError.response?.data || axiosError.message);
    } else {
      console.error('GenAPI status check error:', error);
    }
    throw new Error('Ошибка проверки статуса задачи');
  }
}

// Polling с таймаутом - возвращает любой тип данных
export async function pollRequestStatus(
  requestId: number,
  maxAttempts: number = 30,
  intervalMs: number = 3000
): Promise<unknown> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await checkRequestStatus(requestId);

    if (status.status === 'success') {
      // Возвращаем result если есть (для Suno), иначе output (для ChatGPT)
      const data = status.result || status.output;

      if (typeof data === 'string') {
        return data;
      } else if (Array.isArray(data) && data.length > 0) {
        return data[0];
      } else if (data !== undefined) {
        return data;
      } else {
        throw new Error('Неожиданный формат ответа от GenAPI');
      }
    }

    if (status.status === 'error') {
      throw new Error('Ошибка генерации');
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  const timeoutSec = (maxAttempts * intervalMs) / 1000;
  throw new Error(`Превышено время ожидания генерации (${timeoutSec} сек)`);
}
