// ═══════════════════════════════════════════════════════════════════════════════
// 📧 FONCTION VERCEL — Ajout d'email à MailerLite
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.error('MAILERLITE_API_KEY not configured');
    return res.status(500).json({ error: 'Service mail temporarily unavailable' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { email, category, contract_data } = body || {};

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Add subscriber to MailerLite
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        fields: {
          category: category || 'Inconnue',
          source: 'economio.app',
        },
        groups: [], // Tu peux ajouter l'ID de ton groupe ici plus tard
        status: 'active',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite error:', data);
      // L'email peut déjà exister - c'est OK, on retourne success
      if (response.status === 422 || data?.errors?.email) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      return res.status(response.status).json({ error: data.message || 'Erreur lors de l\'inscription' });
    }

    return res.status(200).json({ ok: true, subscriber: data.data });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
}
