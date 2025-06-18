const axios = require('axios');

module.exports = async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await axios.post('https://api.x.ai/v1/grok', { prompt }, {
            headers: {
                'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
