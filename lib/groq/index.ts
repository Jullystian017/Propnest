'use server';

import Groq from 'groq-sdk';
import type {
  ContentPlatform,
  ContentTemplate,
  ContentTone,
  Listing,
} from '@/lib/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

// ---- Caption Generator ----
const TEMPLATE_CONTEXT: Record<ContentTemplate, string> = {
  grand_launching:
    'Grand Launching perdana perumahan baru yang sangat dinantikan',
  promo_terbatas: 'Promo terbatas waktu dengan penawaran eksklusif',
  unit_terakhir: 'Unit terakhir tersisa, momentum terakhir untuk memiliki',
  lebaran: 'Spesial Lebaran/Hari Raya dengan penawaran istimewa',
  info_kpr:
    'Informasi cicilan KPR yang ringan dan proses mudah disetujui bank',
  testimoni: 'Kisah sukses pembeli yang sudah memiliki rumah impian',
};

const TONE_INSTRUCTIONS: Record<ContentTone, string> = {
  profesional:
    'Gunakan bahasa formal, sopan, dan profesional. Hindari singkatan.',
  santai:
    'Gunakan bahasa gaul yang friendly, casual, dan relatable. Boleh pakai emoji yang relevan.',
  urgensi:
    'Ciptakan rasa urgent dan FOMO. Gunakan kata-kata seperti "Jangan sampai telat!", "Stok terbatas!", "Hari ini saja!"',
  storytelling:
    'Ceritakan kisah emosional tentang impian memiliki rumah. Sentuh perasaan pembaca dengan narasi yang mengalir.',
};

const PLATFORM_INSTRUCTIONS: Record<ContentPlatform, string> = {
  instagram:
    'Instagram: Maks 2200 karakter. Tambahkan 10-15 hashtag relevan di akhir. Format: main caption, lalu satu baris kosong, lalu hashtag.',
  facebook:
    'Facebook: Maks 500 karakter. Tidak perlu hashtag berlebihan. Fokus pada informasi dan CTA yang jelas.',
  tiktok:
    'TikTok: Super singkat, maks 150 karakter. Hook di 3 kata pertama. Trendy dan viral. 3-5 hashtag trending.',
  whatsapp:
    'WhatsApp: Format pesan langsung dan personal. Gunakan *teks tebal* dengan tanda bintang untuk highlight. Maks 300 karakter.',
};

export async function generatePropertyCaption(params: {
  listing: Listing;
  template: ContentTemplate;
  tone: ContentTone;
  platforms: ContentPlatform[];
  language: 'indonesia' | 'jawa_halus';
}): Promise<Record<ContentPlatform, string>> {
  const { listing, template, tone, platforms, language } = params;

  const langInstruction =
    language === 'jawa_halus'
      ? 'Gunakan bahasa Jawa Halus (Krama) yang sopan, namun tetap bisa dipahami masyarakat umum Jawa Tengah.'
      : 'Gunakan Bahasa Indonesia yang baik dan menarik.';

  const platformInstructions = platforms
    .map((p, i) => `${i + 1}. **${p.toUpperCase()}**: ${PLATFORM_INSTRUCTIONS[p]}`)
    .join('\n');

  const prompt = `Kamu adalah copywriter properti terbaik Indonesia yang ahli dalam membuat konten pemasaran yang menarik dan konversi tinggi.

DATA PROPERTI:
- Nama: ${listing.name}
- Tipe: ${listing.type}
- Harga: Rp ${listing.price_min?.toLocaleString('id-ID')}${listing.price_max ? ` - Rp ${listing.price_max.toLocaleString('id-ID')}` : ''}
- Lokasi: ${listing.location_city}, ${listing.location_address}
- Spesifikasi:
  ${listing.specs.luas_tanah ? `• Luas Tanah: ${listing.specs.luas_tanah} m²` : ''}
  ${listing.specs.luas_bangunan ? `• Luas Bangunan: ${listing.specs.luas_bangunan} m²` : ''}
  ${listing.specs.kamar_tidur ? `• Kamar Tidur: ${listing.specs.kamar_tidur}` : ''}
  ${listing.specs.kamar_mandi ? `• Kamar Mandi: ${listing.specs.kamar_mandi}` : ''}
- Fasilitas: ${listing.facilities.join(', ')}
- Deskripsi: ${listing.description || '-'}

KONTEKS KONTEN: ${TEMPLATE_CONTEXT[template]}
TONE: ${TONE_INSTRUCTIONS[tone]}
BAHASA: ${langInstruction}

Buat caption untuk platform berikut. Kembalikan dalam format JSON dengan key nama platform:
${platformInstructions}

Format response:
{
  "instagram": "...",
  "facebook": "...",
  "tiktok": "...",
  "whatsapp": "..."
}

Hanya sertakan platform yang diminta: ${platforms.join(', ')}`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0].message.content || '{}';
  const parsed = JSON.parse(raw) as Record<ContentPlatform, string>;
  return parsed;
}

// ---- Chatbot ----
export async function chatWithBot(params: {
  messages: { role: 'user' | 'assistant'; content: string }[];
  listingContext?: Listing;
}): Promise<string> {
  const { messages, listingContext } = params;

  const systemPrompt = listingContext
    ? `Kamu adalah AI asisten properti PropNest untuk perumahan "${listingContext.name}" di ${listingContext.location_city}. 
Harga: Rp ${listingContext.price_min?.toLocaleString('id-ID')}. 
Spesifikasi: ${listingContext.specs.kamar_tidur} KT, ${listingContext.specs.kamar_mandi} KM.
Fasilitasnya: ${listingContext.facilities.join(', ')}.
Jawab pertanyaan calon pembeli dengan ramah, informatif, dan profesional dalam Bahasa Indonesia.
Jika ditanya soal KPR, berikan panduan umum. Jika pertanyaan di luar properti ini, arahkan untuk menghubungi tim kami.`
    : `Kamu adalah AI asisten properti PropNest. Bantu calon pembeli menemukan properti impian mereka di Indonesia, terutama Jawa Tengah. 
Jawab dengan ramah, informatif, dan profesional dalam Bahasa Indonesia.`;

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content || 'Maaf, ada gangguan. Coba lagi ya!';
}
