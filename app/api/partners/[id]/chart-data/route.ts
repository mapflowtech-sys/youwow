// API: Получить данные для графика партнёра

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partnerId = params.id;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Дата начала периода
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Получаем клики за период, группируем по дням
    const { data: clicks, error: clicksError } = await supabaseAdmin
      .from('partner_clicks')
      .select('clicked_at')
      .eq('partner_id', partnerId)
      .gte('clicked_at', startDate.toISOString());

    if (clicksError) throw clicksError;

    // Получаем конверсии за период, группируем по дням
    const { data: conversions, error: conversionsError } = await supabaseAdmin
      .from('partner_conversions')
      .select('converted_at')
      .eq('partner_id', partnerId)
      .gte('converted_at', startDate.toISOString());

    if (conversionsError) throw conversionsError;

    // Группируем данные по дням
    const chartData: Record<string, { date: string; clicks: number; conversions: number }> = {};

    // Заполняем все дни нулями
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      chartData[dateStr] = { date: dateStr, clicks: 0, conversions: 0 };
    }

    // Подсчитываем клики по дням
    clicks?.forEach((click) => {
      const date = new Date(click.clicked_at).toISOString().split('T')[0];
      if (chartData[date]) {
        chartData[date].clicks++;
      }
    });

    // Подсчитываем конверсии по дням
    conversions?.forEach((conversion) => {
      const date = new Date(conversion.converted_at).toISOString().split('T')[0];
      if (chartData[date]) {
        chartData[date].conversions++;
      }
    });

    // Преобразуем в массив и сортируем
    const result = Object.values(chartData).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Partner API] Error fetching chart data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
