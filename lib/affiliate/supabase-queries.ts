// Партнёрская система: запросы к Supabase

import { supabaseAdmin } from '@/lib/supabase';
import type { Partner, PartnerStats } from '@/types/affiliate';

/**
 * Получить список всех партнёров
 */
export async function getAllPartners(): Promise<Partner[]> {
  const { data, error } = await supabaseAdmin
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Affiliate] Error fetching partners:', error);
    throw error;
  }

  return data as Partner[];
}

/**
 * Получить партнёра по ID
 */
export async function getPartnerById(partnerId: string): Promise<Partner | null> {
  const { data, error } = await supabaseAdmin
    .from('partners')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error) {
    console.error(`[Affiliate] Error fetching partner ${partnerId}:`, error);
    return null;
  }

  return data as Partner;
}

/**
 * Создать нового партнёра
 */
export async function createPartner(partnerData: Omit<Partner, 'created_at'>): Promise<Partner> {
  const { data, error } = await supabaseAdmin
    .from('partners')
    .insert(partnerData)
    .select()
    .single();

  if (error) {
    console.error('[Affiliate] Error creating partner:', error);
    throw error;
  }

  return data as Partner;
}

/**
 * Обновить партнёра
 */
export async function updatePartner(
  partnerId: string,
  updates: Partial<Omit<Partner, 'id' | 'created_at'>>
): Promise<Partner> {
  const { data, error } = await supabaseAdmin
    .from('partners')
    .update(updates)
    .eq('id', partnerId)
    .select()
    .single();

  if (error) {
    console.error(`[Affiliate] Error updating partner ${partnerId}:`, error);
    throw error;
  }

  return data as Partner;
}

/**
 * Удалить партнёра
 */
export async function deletePartner(partnerId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('partners')
    .delete()
    .eq('id', partnerId);

  if (error) {
    console.error(`[Affiliate] Error deleting partner ${partnerId}:`, error);
    throw error;
  }
}

/**
 * Получить статистику партнёра
 */
export async function getPartnerStats(partnerId: string): Promise<PartnerStats> {
  // Получаем партнёра
  const partner = await getPartnerById(partnerId);
  if (!partner) {
    throw new Error('Partner not found');
  }

  // Общее количество кликов
  const { count: totalClicks } = await supabaseAdmin
    .from('partner_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('partner_id', partnerId);

  // Общее количество конверсий
  const { count: totalConversions } = await supabaseAdmin
    .from('partner_conversions')
    .select('*', { count: 'exact', head: true })
    .eq('partner_id', partnerId);

  // Сумма заработанных комиссий
  const { data: conversionsData } = await supabaseAdmin
    .from('partner_conversions')
    .select('commission, is_paid_out')
    .eq('partner_id', partnerId);

  const totalEarned = conversionsData?.reduce((sum, conv) => sum + Number(conv.commission), 0) || 0;
  const totalPaidOut = conversionsData?.filter(c => c.is_paid_out).reduce((sum, conv) => sum + Number(conv.commission), 0) || 0;
  const pendingPayout = totalEarned - totalPaidOut;

  // Конверсионная ставка
  const conversionRate = totalClicks && totalClicks > 0
    ? ((totalConversions || 0) / totalClicks) * 100
    : 0;

  return {
    partnerId: partner.id,
    partnerName: partner.name,
    totalClicks: totalClicks || 0,
    totalConversions: totalConversions || 0,
    conversionRate: Number(conversionRate.toFixed(2)),
    totalEarned: Number(totalEarned.toFixed(2)),
    totalPaidOut: Number(totalPaidOut.toFixed(2)),
    pendingPayout: Number(pendingPayout.toFixed(2)),
    commissionRate: Number(partner.commission_rate),
    isActive: partner.is_active,
  };
}

/**
 * Получить последние конверсии партнёра
 */
export async function getPartnerConversions(
  partnerId: string,
  limit: number = 10
) {
  const { data, error } = await supabaseAdmin
    .from('partner_conversions')
    .select('*')
    .eq('partner_id', partnerId)
    .order('converted_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`[Affiliate] Error fetching conversions for ${partnerId}:`, error);
    throw error;
  }

  return data;
}

/**
 * Получить последние клики партнёра
 */
export async function getPartnerClicks(
  partnerId: string,
  limit: number = 10
) {
  const { data, error } = await supabaseAdmin
    .from('partner_clicks')
    .select('*')
    .eq('partner_id', partnerId)
    .order('clicked_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`[Affiliate] Error fetching clicks for ${partnerId}:`, error);
    throw error;
  }

  return data;
}
