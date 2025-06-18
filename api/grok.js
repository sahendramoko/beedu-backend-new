const axios = require('axios');

module.exports = async (req, res) => {
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight CORS
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    let body = req.body || {};
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            return res.status(400).json({ error: "Invalid JSON body" });
        }
    }

    console.log("Request received:", body);

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
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: error.message });
    }
};
