const axios = require('axios');

module.exports = async (req, res) => {
  // Tambahkan CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://beedu-six.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Tangani preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let body = req.body;

    // Kalau body kosong, error
    if (!body) {
      throw new Error('Missing request body');
    }

    // Kalau bentuk string (misalnya raw JSON), parse manual
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { prompt } = body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      messages: [
        { role: "system", content: "You are a concise assistant. Only respond with the exact answer to the user's prompt and nothing else." },
        { role: "user", content: prompt }
      ],
      model: "grok-3",
      stream: false,
      temperature: 0
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json(response.data);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
