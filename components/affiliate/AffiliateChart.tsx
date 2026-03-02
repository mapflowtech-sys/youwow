'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from 'primereact/button';

interface ChartDataPoint {
  date: string;
  clicks: number;
  conversions: number;
}

interface AffiliateChartProps {
  partnerId: string;
}

export default function AffiliateChart({ partnerId }: AffiliateChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState(30); // 7, 30, 90 дней

  useEffect(() => {
    loadChartData();
  }, [partnerId, period]);

  const loadChartData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/partners/${partnerId}/chart-data?days=${period}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Форматирование даты для оси X
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  };

  const periodOptions = [
    { label: '7 дней', value: 7 },
    { label: '30 дней', value: 30 },
    { label: '90 дней', value: 90 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-foreground font-semibold text-lg">
          Статистика по дням
        </h3>

        {/* Period Selector */}
        <div className="flex gap-2">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              label={option.label}
              size="small"
              outlined={period !== option.value}
              severity={period === option.value ? 'info' : 'secondary'}
              onClick={() => setPeriod(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Загрузка...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 12% 89% / 0.5)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="hsl(270 4% 46%)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="hsl(270 4% 46%)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(36 25% 99%)',
                border: '1px solid hsl(30 12% 89%)',
                borderRadius: '8px',
                color: 'hsl(270 8% 15%)',
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
              }}
            />
            <Legend iconType="line" />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="hsl(280 40% 25%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(280 40% 25%)', r: 4 }}
              activeDot={{ r: 6 }}
              name="Переходы"
            />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="hsl(348 75% 62%)"
              strokeWidth={2}
              dot={{ fill: 'hsl(348 75% 62%)', r: 4 }}
              activeDot={{ r: 6 }}
              name="Покупки"
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-plum"></div>
          <span className="text-muted-foreground">Переходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Покупки</span>
        </div>
      </div>
    </motion.div>
  );
}
