// ═══════════════════════════════════════════════════════════════════════════════
// 🔐 FONCTION SERVEUR VERCEL - Appel sécurisé à l'API Anthropic
// ═══════════════════════════════════════════════════════════════════════════════
// Cette fonction tourne sur les serveurs de Vercel (pas dans le navigateur),
// ce qui permet de cacher la clé API du public.
//
// La clé est stockée dans les variables d'environnement Vercel (ANTHROPIC_API_KEY)
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('API call error:', error);
    return res.status(500).json({ error: error.message });
  }
}
