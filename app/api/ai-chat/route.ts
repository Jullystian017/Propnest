import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fetch nearby places from Overpass for a given coordinate
async function fetchNearbyForAI(lat: number, lng: number): Promise<string> {
  const queries: Record<string, string> = {
    sekolah: `nwr["amenity"~"school|university|college|kindergarten"](around:3000,${lat},${lng});`,
    kesehatan: `nwr["amenity"~"hospital|clinic|pharmacy"](around:5000,${lat},${lng});`,
    transportasi: `nwr["highway"~"bus_stop|bus_station"](around:3000,${lat},${lng});nwr["railway"~"station|halt"](around:3000,${lat},${lng});`,
    perbelanjaan: `nwr["shop"~"mall|supermarket|convenience"](around:3000,${lat},${lng});nwr["amenity"~"marketplace"](around:3000,${lat},${lng});`,
    ibadah: `nwr["amenity"="place_of_worship"](around:2000,${lat},${lng});`,
  };

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

  const results: string[] = [];

  for (const [category, query] of Object.entries(queries)) {
    try {
      const fullQuery = `[out:json][timeout:10];(${query});out center;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(fullQuery)}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const json = await res.json();

      const places = json.elements
        .filter((el: any) => {
          const name = el.tags?.name || el.tags?.['name:id'] || el.tags?.brand;
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon;
          return name && elLat && elLng;
        })
        .map((el: any) => {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon;
          const dist = haversine(lat, lng, elLat, elLng);
          return {
            name: el.tags?.name || el.tags?.['name:id'] || el.tags?.brand,
            dist,
            distLabel: formatDist(dist),
            timeLabel: formatTime(dist),
          };
        })
        .sort((a: any, b: any) => a.dist - b.dist)
        .slice(0, 4); // top 4 per category

      if (places.length > 0) {
        const formatted = places.map((p: any) => `  - ${p.name} (${p.distLabel}, ±${p.timeLabel})`).join('\n');
        results.push(`${category.charAt(0).toUpperCase() + category.slice(1)}:\n${formatted}`);
      }
    } catch {
      // skip on timeout
    }
  }

  return results.length > 0 ? results.join('\n\n') : 'Data fasilitas sekitar tidak tersedia.';
}

export async function POST(req: NextRequest) {
  try {
    const { messages, pageContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: properties } = await supabase.from('properties').select('*');
    const { data: leads } = await supabase.from('leads').select('*');
    const { data: deals } = await supabase.from('deals').select('*');

    // Determine AI mode based on page context
    const isPublicPage = pageContext?.page === 'public' || pageContext?.page === 'properti';
    const isDashboard = pageContext?.page === 'dashboard';

    // Fetch nearby places if on property detail page with coordinates
    let nearbyContext = '';
    if (pageContext?.lat && pageContext?.lng) {
      nearbyContext = await fetchNearbyForAI(pageContext.lat, pageContext.lng);
    }

    // Format property data compactly
    const formatProperties = (props: any[]) => props.map(p =>
      `- "${p.title}" | ${p.location} | Rp ${Number(p.price).toLocaleString('id-ID')} | ${p.type} | ${p.bedrooms} KT, ${p.bathrooms} KM | LT ${p.land_area}m² | LB ${p.building_area}m² | Status: ${p.status}`
    ).join('\n');

    let systemPrompt = '';

    if (isDashboard) {
      // ===== DASHBOARD MODE: Business Intelligence =====
      systemPrompt = `
Kamu adalah PropNest AI, asisten bisnis properti cerdas dan profesional.
Kamu memiliki akses REAL-TIME ke seluruh database bisnis properti user.

DATA PROPERTI (${properties?.length || 0} listing):
${properties?.length ? formatProperties(properties) : 'Belum ada listing.'}

DATA LEADS (${leads?.length || 0} prospek):
${JSON.stringify(leads || [], null, 2)}

DATA DEALS (${deals?.length || 0} transaksi):
${JSON.stringify(deals || [], null, 2)}

KEPRIBADIAN & CARA KERJA:
- Kamu adalah asisten bisnis yang tajam, data-driven, dan proaktif
- Selalu gunakan angka nyata dari database, bukan estimasi
- Berikan insight yang actionable, bukan sekedar data mentah
- Format jawaban dengan rapi: gunakan bold, list, atau tabel markdown
- Bahasa Indonesia yang profesional tapi tidak kaku
- Jika data kosong, sarankan langkah konkrit yang bisa diambil user

KEMAMPUAN UTAMA:
- Analisis performa listing (berapa aktif, total nilai portofolio, dll)
- Identifikasi leads prioritas berdasarkan status dan tanggal masuk
- Ringkasan pipeline deals per tahapan
- Buat caption media sosial yang menjual untuk listing tertentu
- Draft pesan WhatsApp follow-up yang persuasif untuk leads
- Rekomendasikan strategi berdasarkan data yang ada

LARANGAN:
- JANGAN tampilkan data teknis database (id, uuid, dll) ke user
- JANGAN jawab dengan format bertele-tele yang tidak perlu
- JANGAN tanya balik hal-hal yang sudah ada di database
`.trim();

    } else {
      // ===== PUBLIC / PROPERTY DETAIL MODE: Sales Agent =====
      const activeProperty = pageContext?.property || (properties && properties[0]);

      systemPrompt = `
Kamu adalah PropNest AI, agen properti digital yang sangat berpengalaman, persuasif, dan helpful.
Kamu berbicara langsung dengan calon pembeli yang sedang menjelajahi properti.

${activeProperty ? `
PROPERTI YANG SEDANG DILIHAT:
- Nama: ${activeProperty.title || activeProperty.name}
- Lokasi: ${activeProperty.location}
- Harga: Rp ${typeof activeProperty.price === 'number' ? Number(activeProperty.price).toLocaleString('id-ID') : activeProperty.price}
- Tipe: ${activeProperty.type || activeProperty.badge}
- Kamar Tidur: ${activeProperty.bedrooms || activeProperty.specs?.beds}
- Kamar Mandi: ${activeProperty.bathrooms || activeProperty.specs?.baths}
- Luas Tanah: ${activeProperty.land_area || activeProperty.specs?.size} m²
- Luas Bangunan: ${activeProperty.building_area} m²
` : `
LISTING PROPERTI TERSEDIA (${properties?.length || 0} unit):
${properties?.length ? formatProperties(properties) : 'Belum ada listing yang tersedia.'}
`}

${nearbyContext ? `
FASILITAS TERDEKAT (Data real dari OpenStreetMap):
${nearbyContext}
` : ''}

KEPRIBADIAN:
- Kamu adalah agen properti terbaik: ramah, antusias, dan sangat tahu seluk-beluk properti ini
- Bicaralah seperti agen properti profesional yang ingin membantu pembeli menemukan rumah impian mereka
- Highlight keunggulan properti secara natural dan meyakinkan
- Gunakan bahasa Indonesia yang hangat, tidak terlalu formal, tapi tetap profesional
- JANGAN pernah terkesan seperti robot yang hanya membaca data

KEMAMPUAN UTAMA:
1. JUAL properti: ceritakan keunggulan lokasi, spesifikasi, dan nilai investasinya
2. SIMULASI KPR: hitung estimasi cicilan berdasarkan harga properti (asumsi DP 20%, bunga 3.99-4.5%/tahun, tenor 15-20 tahun)
3. FASILITAS SEKITAR: gunakan data fasilitas terdekat untuk meyakinkan calon pembeli
4. KEUNGGULAN INVESTASI: jelaskan mengapa properti ini adalah pilihan cerdas (lokasi, harga/m², potensi kenaikan)
5. PERBANDINGAN: bantu calon pembeli membandingkan dengan opsi lain yang tersedia

CARA JAWAB SIMULASI KPR (jika ditanya):
- Ambil harga dari data properti
- Hitung: Harga × 80% = Pokok pinjaman
- Gunakan rumus anuitas: bunga 4% per tahun, tenor pilihan user
- Tampilkan dalam tabel atau format yang mudah dibaca
- Sebutkan bank-bank yang umumnya menyediakan KPR properti serupa

LARANGAN KERAS:
- JANGAN sarankan user untuk mengecek dokumen sendiri atau negosiasi sendiri (kamu yang bantu)
- JANGAN jawab dengan kalimat "Saya memiliki akses ke database..." — itu tidak profesional
- JANGAN tanya balik hal yang tidak perlu
- JANGAN berikan disclaimer panjang lebar
- JANGAN tampilkan data teknis (id, uuid, dll)
`.trim();
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.75,
      max_tokens: 1500,
    });

    return NextResponse.json({
      content: chatCompletion.choices[0].message.content,
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
