// API: Запись конверсии (покупки) для партнёра

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      partner_id,
      session_id,
      order_id,
      service_type,
      amount,
    } = body;

    // Валидация
    if (!partner_id || !session_id || !order_id || !service_type || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Получаем комиссию партнёра из БД
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .select('commission_rate, status')
      .eq('id', partner_id)
      .single();

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    if (partner.status !== 'active') {
      return NextResponse.json(
        { error: 'Partner is inactive' },
        { status: 403 }
      );
    }

    // Получаем информацию о клике (landing_page)
    const { data: click } = await supabaseAdmin
      .from('partner_clicks')
      .select('landing_page')
      .eq('session_id', session_id)
      .single();

    // Проверяем что конверсия ещё не записана (по order_id)
    const { data: existingConversion } = await supabaseAdmin
      .from('partner_conversions')
      .select('id')
      .eq('order_id', order_id)
      .single();

    if (existingConversion) {
      return NextResponse.json(
        { message: 'Conversion already tracked', conversion_id: existingConversion.id },
        { status: 200 }
      );
    }

    // Записываем конверсию
    const { data: conversion, error: conversionError } = await supabaseAdmin
      .from('partner_conversions')
      .insert({
        partner_id,
        session_id,
        order_id,
        service_type,
        amount,
        commission: partner.commission_rate,
        landing_page: click?.landing_page || null,
        is_paid_out: false,
      })
      .select()
      .single();

    if (conversionError) {
      console.error('Error tracking conversion:', conversionError);
      return NextResponse.json(
        { error: 'Failed to track conversion' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Conversion tracked successfully',
        conversion,
        commission: partner.commission_rate
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in track-conversion API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
