// ═══════════════════════════════════════════════════════════════════════════════
// 🔐 FONCTION SERVEUR VERCEL - Appel sécurisé à l'API Anthropic
// ═══════════════════════════════════════════════════════════════════════════════

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Pour permettre l'upload de PDFs
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', method: req.method });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not found in environment');
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Parse body if it's a string
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    if (!body || !body.messages) {
      return res.status(400).json({ error: 'Missing messages in request body' });
    }

    console.log('Calling Anthropic API with model:', body.model);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
