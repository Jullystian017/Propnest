import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fetch nearby places from Overpass for a given coordinate
async function fetchNearbyForAI(lat: number, lng: number): Promise<string> {
  const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000;
    const d = Math.PI / 180;
    const a = Math.sin((lat2 - lat1) * d / 2) ** 2 + Math.cos(lat1 * d) * Math.cos(lat2 * d) * Math.sin((lng2 - lng1) * d / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  };

  const formatDist = (m: number) => m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
  const formatTime = (m: number) => {
    const mins = Math.ceil((m / 25000) * 60);
    return mins < 1 ? '< 1 menit' : `${mins} menit`;
  };

  const queries: Record<string, string> = {
    sekolah: `nwr["amenity"~"school|university|college|kindergarten"](around:3000,${lat},${lng});`,
    kesehatan: `nwr["amenity"~"hospital|clinic|pharmacy"](around:5000,${lat},${lng});`,
    transportasi: `nwr["highway"~"bus_stop|bus_station"](around:3000,${lat},${lng});nwr["railway"~"station|halt"](around:3000,${lat},${lng});`,
    perbelanjaan: `nwr["shop"~"mall|supermarket|convenience"](around:3000,${lat},${lng});nwr["amenity"~"marketplace"](around:3000,${lat},${lng});`,
  };

  const results: string[] = [];
  for (const [category, query] of Object.entries(queries)) {
    try {
      const fullQuery = `[out:json][timeout:10];(${query});out center;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(fullQuery)}`);
      if (!res.ok) continue;
      const json = await res.json();
      const places = json.elements
        .filter((el: any) => (el.tags?.name || el.tags?.brand) && (el.lat ?? el.center?.lat))
        .map((el: any) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon;
          const dist = haversine(lat, lng, elLat, elLng);
          return { name: el.tags?.name || el.tags?.brand, dist, distLabel: formatDist(dist), timeLabel: formatTime(dist) };
        })
        .sort((a: any, b: any) => a.dist - b.dist)
        .slice(0, 3);
      if (places.length > 0) {
        results.push(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${places.map((p: any) => `${p.name} (${p.distLabel})`).join(', ')}`);
      }
    } catch {}
  }
  return results.join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const { messages, pageContext } = await req.json();
    const supabase = await createClient();
    const { data: properties } = await supabase.from('properties').select('*');
    const { data: leads } = await supabase.from('leads').select('*');
    const { data: deals } = await supabase.from('deals').select('*');

    const isDashboard = pageContext?.page === 'dashboard';
    let nearbyContext = '';
    if (pageContext?.lat && pageContext?.lng) {
      nearbyContext = await fetchNearbyForAI(pageContext.lat, pageContext.lng);
    }

    const formatProperties = (props: any[]) => props.map(p =>
      `- ${p.title} | ${p.location} | Rp ${Number(p.price).toLocaleString('id-ID')} | ${p.type}`
    ).join('\n');

    let systemPrompt = '';

    if (isDashboard) {
      systemPrompt = `Kamu NusaEstate AI. Asisten bisnis proaktif. Gunakan data:
PROPERTI: ${formatProperties(properties || [])}
LEADS: ${leads?.length || 0} orang.
DEALS: ${deals?.length || 0} transaksi.
Jawab singkat, padat, profesional. Berikan insight langsung.`.trim();
    } else {
      const prop = pageContext?.property;
      systemPrompt = `Kamu NusaEstate AI, agen properti persuasif dan singkat.
PROPERTI: ${prop ? `${prop.title}, ${prop.location}, Rp ${prop.price}` : 'Lihat katalog.'}
FASILITAS: ${nearbyContext || 'Strategis.'}

ATURAN PENTING:
1. JANGAN basa-basi. JANGAN jelaskan langkah-langkah pembelian (DP, KPR, dll) secara panjang lebar.
2. Jika user ingin beli, tertarik, atau mau lanjut, TANYA KONFIRMASI singkat lalu WAJIB sertakan tag ACTION_INQUIRY.
3. Contoh: "Baik, mari kita proses. Apakah Anda ingin saya hubungkan dengan agen properti untuk langkah selanjutnya? ACTION_INQUIRY"
4. JANGAN ulangi spesifikasi rumah jika user sudah mau beli.
5. Gunakan tag ACTION_INQUIRY hanya di akhir jawaban saat user siap diproses.`.trim();
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1000,
    });

    return NextResponse.json({ content: chatCompletion.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
