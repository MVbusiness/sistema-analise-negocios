// Vercel Serverless Function — Proxy seguro para IA
// Tenta Groq primeiro (gratuito e rápido), fallback para Gemini
// As chaves ficam seguras aqui no servidor — nunca expostas no frontend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Tentar Groq primeiro (gratuito, rápido, sem cota diária)
  const groqResult = await tryGroq(prompt);
  if (groqResult) {
    return res.status(200).json({ text: groqResult, source: 'groq' });
  }

  // Fallback para Gemini se Groq falhar
  const geminiResult = await tryGemini(prompt);
  if (geminiResult) {
    return res.status(200).json({ text: geminiResult, source: 'gemini' });
  }

  return res.status(500).json({ error: 'Todos os provedores de IA falharam' });
}

async function tryGroq(prompt) {
  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é uma mentora estratégica especialista em crescimento de negócios digitais e e-commerce no Brasil. Responda sempre em português brasileiro. Nunca use asteriscos, markdown, negrito ou hifens no início de frases.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 4096,
      })
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json();
      console.error('Groq erro:', response.status, JSON.stringify(err));
      return null;
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (text && text.length > 100) {
      console.log('Groq OK! chars:', text.length);
      return text;
    }
    return null;
  } catch (e) {
    console.error('Groq exception:', e.message);
    return null;
  }
}

async function tryGemini(prompt) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 8192 }
        })
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json();
      console.error('Gemini erro:', response.status, JSON.stringify(err));
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text && text.length > 100) {
      console.log('Gemini OK! chars:', text.length);
      return text;
    }
    return null;
  } catch (e) {
    console.error('Gemini exception:', e.message);
    return null;
  }
}
