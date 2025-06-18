const axios = require('axios');

module.exports = async (req, res) => {
  // ✨ Tambahkan CORS headers sebelum yang lain
  res.setHeader("Access-Control-Allow-Origin", "https://beedu-six.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  // 🛑 Tangani preflight request SEBELUM destructuring apapun
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ Tangani kemungkinan body kosong / bukan JSON
  let body = req.body;
  if (!body) {
    return res.status(400).json({ error: "Request body is missing." });
  }
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const { prompt } = body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
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

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Grok API error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
