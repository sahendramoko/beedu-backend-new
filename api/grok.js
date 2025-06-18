const axios = require('axios');

module.exports = async (req, res) => {
    console.log("Request received:", req.body);
    const { prompt } = req.body;
    if (!prompt) {
        console.log("Error: Prompt is missing");
        return res.status(400).json({ error: "Prompt is required" });
    }
    try {
        console.log("API Key check:", process.env.XAI_API_KEY ? "Valid" : "Missing");
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
        console.log("API Response:", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).json({ error: error.message });
    }
};
