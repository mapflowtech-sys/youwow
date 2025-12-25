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

# Собираем Next.js приложение
RUN npm run build

# Открываем порт 80 (TimeWeb ожидает именно 80)
EXPOSE 80

# Запускаем приложение на порту 80
CMD ["npm", "run", "start", "--", "-p", "80"]
