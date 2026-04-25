'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ContentPlatform, ContentTone, ContentTemplate } from '@/lib/types';

// ---- Fetch antrian konten milik developer yang sedang login ----
export async function getContentQueue() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('content_posts')
    .select(`
      *,
      properties (
        id,
        title,
        price,
        images
      )
    `)
    .eq('developer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching content queue:', error);
    return [];
  }

  return data || [];
}

// ---- Simpan caption ke antrian ----
export async function saveToQueue(params: {
  propertyId: string;
  platform: ContentPlatform;
  caption: string;
  tone: ContentTone;
  template: ContentTemplate;
  scheduledAt?: string | null;
  mediaUrl?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tidak terautentikasi');

  const { error } = await supabase.from('content_posts').insert({
    developer_id: user.id,
    property_id: params.propertyId || null,
    platform: params.platform,
    caption: params.caption,
    tone: params.tone,
    template: params.template,
    scheduled_at: params.scheduledAt || null,
    media_url: params.mediaUrl || null,
    status: 'waiting',
  });

  if (error) throw new Error(`Gagal menyimpan ke antrean: ${error.message}`);

  revalidatePath('/dashboard/content');
  return { success: true };
}

// ---- Setujui post (ubah status ke scheduled) ----
export async function approvePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tidak terautentikasi');

  const { error } = await supabase
    .from('content_posts')
    .update({ status: 'scheduled' })
    .eq('id', id)
    .eq('developer_id', user.id); // pastikan hanya bisa ubah miliknya sendiri

  if (error) throw new Error(`Gagal menyetujui post: ${error.message}`);

  revalidatePath('/dashboard/content');
  return { success: true };
}

// ---- Hapus post dari antrian ----
export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tidak terautentikasi');

  const { error } = await supabase
    .from('content_posts')
    .delete()
    .eq('id', id)
    .eq('developer_id', user.id);

  if (error) throw new Error(`Gagal menghapus post: ${error.message}`);

  revalidatePath('/dashboard/content');
  return { success: true };
}

// ---- Fetch properti milik developer (untuk dropdown pilih properti) ----
export async function getDeveloperProperties() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('properties')
    .select('id, title, price, images, type, status, bedrooms, bathrooms, land_area, building_area, description, location')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  // Map to match the expected Listing type if necessary
  const formattedData = (data || []).map(p => ({
    ...p,
    name: p.title, 
    location_city: p.location || '',
    location_address: p.location || '',
    price_min: Number(p.price) || 0,
    price_max: null,
    facilities: [], // Table doesn't have facilities, or it's separate
    specs: {
      kamar_tidur: p.bedrooms,
      kamar_mandi: p.bathrooms,
      luas_tanah: p.land_area,
      luas_bangunan: p.building_area
    }
  }));

  return formattedData;
}
// ---- Post Sekarang (ubah status ke published) ----
export async function publishNow(params: {
  propertyId: string;
  platform: ContentPlatform;
  caption: string;
  tone: ContentTone;
  template: ContentTemplate;
  mediaUrl?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Tidak terautentikasi');

  const { error } = await supabase.from('content_posts').insert({
    developer_id: user.id,
    property_id: params.propertyId || null,
    platform: params.platform,
    caption: params.caption,
    tone: params.tone,
    template: params.template,
    media_url: params.mediaUrl || null,
    status: 'published',
    published_at: new Date().toISOString(),
  });

  if (error) throw new Error(`Gagal mempublikasi: ${error.message}`);

  revalidatePath('/dashboard/content');
  return { success: true };
}
