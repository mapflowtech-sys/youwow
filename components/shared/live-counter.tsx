"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveCounterProps {
  className?: string;
}

// Базовое значение и дата отсчета (константы вне компонента)
const BASE_VALUE = 5432;
const START_DATE = new Date("2025-01-01T00:00:00");

export function LiveCounter({ className = "" }: LiveCounterProps) {
  const [count, setCount] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Функция для вычисления текущего счетчика на основе времени
  const calculateCurrentCount = useCallback((): number => {
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - START_DATE.getTime()) / 1000);
    // +1 человек каждые 3600 секунд (1 час)
    const timeBasedIncrement = Math.floor(elapsedSeconds / 3600);
    return BASE_VALUE + timeBasedIncrement;
  }, []);

  // Форматирование числа с пробелом (5 432)
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Инициализация и анимация при первой загрузке
  useEffect(() => {
    const currentCount = calculateCurrentCount();

    // Проверяем localStorage
    const storedCount = localStorage.getItem("youwow_counter");
    const lastSeenCount = storedCount ? parseInt(storedCount, 10) : currentCount - 3;

    // Если текущее значение больше сохраненного, анимируем от (current - 3)
    const startFrom = Math.max(lastSeenCount, currentCount - 3);

    // Анимация от startFrom до currentCount
    let animationCount = startFrom;
    const step = Math.max(1, Math.floor((currentCount - startFrom) / 20)); // 20 шагов анимации

    const animationInterval = setInterval(() => {
      animationCount += step;
      if (animationCount >= currentCount) {
        animationCount = currentCount;
        clearInterval(animationInterval);
        setIsInitialLoad(false);
        localStorage.setItem("youwow_counter", currentCount.toString());
      }
      setCount(animationCount);
    }, 50); // Быстрая анимация

    return () => clearInterval(animationInterval);
  }, [calculateCurrentCount]);

  // Обновление счетчика каждые 45-90 секунд
  useEffect(() => {
    if (isInitialLoad) return;

    const getRandomInterval = () => {
      // Случайный интервал от 45 до 90 секунд (в миллисекундах)
      return Math.floor(Math.random() * (90000 - 45000 + 1)) + 45000;
    };

    const scheduleNextUpdate = () => {
      const interval = getRandomInterval();

      const timeoutId = setTimeout(() => {
        const newCount = calculateCurrentCount();
        setCount(newCount);
        localStorage.setItem("youwow_counter", newCount.toString());
        scheduleNextUpdate(); // Планируем следующее обновление
      }, interval);

      return timeoutId;
    };

    const timeoutId = scheduleNextUpdate();

    return () => clearTimeout(timeoutId);
  }, [isInitialLoad, calculateCurrentCount]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {formatNumber(count)}
      </motion.span>
    </AnimatePresence>
  );
}
