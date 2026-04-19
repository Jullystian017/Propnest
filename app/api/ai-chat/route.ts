import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Fetch data with proper user context
    const { data: properties } = await supabase.from('properties').select('*');
    const { data: leads } = await supabase.from('leads').select('*');
    const { data: deals } = await supabase.from('deals').select('*');

    const contextSummary = `
You are PropNest AI, the ultimate intelligent core of the PropNest Real Estate Platform.
You have real-time access to the user's entire real estate business database.

DATABASE CONTEXT:
1. PROPERTIES (${properties?.length || 0} listings):
${JSON.stringify(properties || [], null, 2)}

2. LEADS (${leads?.length || 0} potential customers):
${JSON.stringify(leads || [], null, 2)}

3. DEALS (${deals?.length || 0} sales in pipeline):
${JSON.stringify(deals || [], null, 2)}

YOUR CAPABILITIES:
- Summarize business performance (e.g., "How many active listings do I have?").
- Analyze leads (e.g., "Who are my hottest leads?").
- Help with sales (e.g., "Write a follow-up WhatsApp message for the BSB deal").
- Property knowledge: Answer specific questions about property specs, locations, and prices.
- General Assistant: Answer "Halo" or general greetings with energy and helpfulness.

GUIDELINES:
- Be extremely professional, concise, and smart.
- If the user asks something about a specific lead or property, use the exact names/details from the database.
- Use Indonesian as the primary language unless asked otherwise.
- If data is empty, suggest how to add it (e.g., "You don't have any leads yet. Try adding one in the Leads page!").
- Keep responses engaging and "wow" the user with your knowledge of their data.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: contextSummary },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      stream: false, // Set to true if you want to implement streaming on frontend
    });

    return NextResponse.json({ 
      content: chatCompletion.choices[0].message.content 
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
