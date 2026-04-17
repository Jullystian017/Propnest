'use server';

import Groq from 'groq-sdk';
import { MOCK_LEADS } from '@/lib/leads-mock';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Generates an AI-powered executive report based on current leads data.
 * This analyzes sources, property popularity, and conversion potential.
 */
export async function generateExecutiveReport() {
  // 1. Data Aggregation for AI Context
  const totalLeads = MOCK_LEADS.length;
  const sourceStats = MOCK_LEADS.reduce((acc: any, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const propertyStats = MOCK_LEADS.reduce((acc: any, lead) => {
    acc[lead.property] = (acc[lead.property] || 0) + 1;
    return acc;
  }, {});

  const tempStats = MOCK_LEADS.reduce((acc: any, lead) => {
    acc[lead.temperature] = (acc[lead.temperature] || 0) + 1;
    return acc;
  }, {});

  // 2. Performance Breakdown string for Prompt
  const promptData = `
    DATA RINGKASAN MARKETING:
    - Total Leads Bulan Ini: ${totalLeads}
    - Distribusi Sumber: ${JSON.stringify(sourceStats)}
    - Properti Paling Banyak Diminati: ${JSON.stringify(propertyStats)}
    - Kualitas Lead (Temperature): ${JSON.stringify(tempStats)}
  `;

  const prompt = `
    Kamu adalah Direktur Marketing Properti (Chief Marketing Officer) yang sangat berpengalaman. 
    Berdasarkan DATA RINGKASAN MARKETING berikut, buatlah LAPORAN EKSEKUTIF yang tajam, strategis, dan profesional untuk pemilik developer perumahan.

    ${promptData}

    STRUKTUR LAPORAN (Gunakan Markdown):
    1. **Ringkasan Performa**: (Tinjauan singkat ttg performa bulan ini).
    2. **Analisis Saluran (Channel Insight)**: (Berikan insight mana platform yang paling bagus dan mana yang wasting money).
    3. **Rekomendasi Strategis**: (Langkah konkrit apa yang harus diambil hari ini untuk meningkatkan closing).
    4. **Catatan Khusus**: (Berikan 1 motivasi atau insight tren pasar).

    Gunakan bahasa Indonesia yang sangat berkelas (Executive Tone), lugas, namun tetap memotivasi.
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
