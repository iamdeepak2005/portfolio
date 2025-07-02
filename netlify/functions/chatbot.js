const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { chatHistory } = JSON.parse(event.body);

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: chatHistory
            })
        });

        const data = await response.json();

        const botResponse = data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: botResponse })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
};
