# Используем официальный Node.js образ
FROM node:20-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Объявляем ARG для переменных окружения, необходимых на этапе сборки
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG GENAPI_API_KEY
ARG AI_MODEL
ARG OPENAI_API_KEY
ARG SUNO_COOKIE
ARG CHATGPT_API_KEY

# Устанавливаем переменные окружения для сборки
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV GENAPI_API_KEY=$GENAPI_API_KEY
ENV AI_MODEL=$AI_MODEL
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV SUNO_COOKIE=$SUNO_COOKIE
ENV CHATGPT_API_KEY=$CHATGPT_API_KEY

# Собираем Next.js приложение
RUN npm run build

# Открываем порт 80 (TimeWeb ожидает именно 80)
EXPOSE 80

# Запускаем приложение на порту 80
CMD ["npm", "run", "start", "--", "-p", "80"]
