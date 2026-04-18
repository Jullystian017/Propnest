'use server';

import Groq from 'groq-sdk';
import { MOCK_LEADS } from '@/lib/leads-mock';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Generates an AI-powered executive report based on current leads data.
 */
export async function generateExecutiveReport(analyticsData?: {
  totalLeads: number;
  sourceStats: any;
  propertyStats: any;
  qualityStats: any;
  trendSummary?: string;
}) {
  // Use provided data or fallback to MOCK_LEADS
  const data = {
    totalLeads: analyticsData?.totalLeads || MOCK_LEADS.length,
    sources: analyticsData?.sourceStats || MOCK_LEADS.reduce((acc: any, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {}),
    properties: analyticsData?.propertyStats || MOCK_LEADS.reduce((acc: any, lead) => {
      acc[lead.property] = (acc[lead.property] || 0) + 1;
      return acc;
    }, {}),
    quality: analyticsData?.qualityStats || MOCK_LEADS.reduce((acc: any, lead) => {
      acc[lead.temperature] = (acc[lead.temperature] || 0) + 1;
      return acc;
    }, {})
  };

  const prompt = `
Anda adalah Chief Marketing Officer (CMO) Senior di PropNest, platform analitik properti cerdas.
Tugas Anda adalah membuat **Laporan Strategis Eksekutif** berdasarkan data real-time di bawah ini.

### DATA ANALITIK REAL-TIME:
- Total Leads: ${data.totalLeads}
- Distribusi Channel: ${Object.entries(data.sources).map(([k, v]) => `${k}: ${v}`).join(', ')}
- Properti Terpopuler: ${Object.entries(data.properties).map(([k, v]) => `${k}: ${v} peminat`).join(', ')}
- Kualitas Prospek: ${Object.entries(data.quality).map(([k, v]) => `${k}: ${v}`).join(', ')}

### STRUKTUR LAPORAN (WAJIB):
1. **Executive Summary**: Ringkasan performa dalam 2-3 kalimat profesional.
2. **Key Performance Metrics**: Sajikan data di atas dalam bentuk **TABEL MARKDOWN** yang rapi.
3. **Strategic Deep Dive**: Analisis mendalam tentang tren (misal: "Channel WhatsApp mendominasi dengan konversi tinggi...").
4. **Actionable Recommendations**: 3-5 poin taktis untuk meningkatkan penjualan minggu depan.

### ATURAN PENULISAN:
- Gunakan bahasa Indonesia yang sangat profesional, elegan, dan meyakinkan.
- Gunakan format Markdown yang bersih (Heading 2 dan 3, Bold, Tabel, Bullet points).
- Fokus pada insight bisnis, bukan sekadar angka.
- JANGAN menyertakan metadata atau teks pembuka. Langsung ke isi laporan.
- Tambahkan tagline di akhir: "PropNest Intelligence — Empowering Property Decisions."
    `;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return {
      success: true,
      report: completion.choices[0].message.content,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('AI Report Error:', error);
    return {
      success: false,
      error: 'Gagal membuat laporan AI. Pastikan API Key valid.',
    };
  }
}
