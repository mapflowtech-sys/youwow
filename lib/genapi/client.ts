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
  output?: string | string[];
  response_type?: string;
  input?: unknown;
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

// Polling с таймаутом
export async function pollRequestStatus(
  requestId: number,
  maxAttempts: number = 30,
  intervalMs: number = 3000
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await checkRequestStatus(requestId);

    if (status.status === 'success') {
      if (typeof status.output === 'string') {
        return status.output;
      } else if (Array.isArray(status.output) && status.output.length > 0) {
        return status.output[0];
      } else {
        throw new Error('Неожиданный формат ответа от GenAPI');
      }
    }

    if (status.status === 'error') {
      throw new Error('Ошибка генерации текста');
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Превышено время ожидания генерации (90 сек)');
}
