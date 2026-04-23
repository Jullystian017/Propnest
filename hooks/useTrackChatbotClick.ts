import { createClient } from '@/lib/supabase/client';

interface TrackClickOptions {
  developer_id?: string | null;
  property_id?: string | null;
  page?: string;
}

/**
 * Records a chatbot click event in Supabase.
 * Safe to call even if developer_id or property_id is unknown — it just skips.
 */
export async function trackChatbotClick({ developer_id, property_id, page = 'public' }: TrackClickOptions) {
  // Only record if we know which developer owns the property being viewed
  if (!developer_id) return;

  const supabase = createClient();

  await supabase.from('chatbot_clicks').insert({
    developer_id,
    property_id: property_id || null,
    page,
  });
}
