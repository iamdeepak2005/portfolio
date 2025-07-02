exports.handler = async function(event, context) {
    console.log('Incoming event:', event); // Debug line

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No request body provided." })
        };
    }

    let chatHistory;
    try {
        const parsedBody = JSON.parse(event.body);
        chatHistory = parsedBody.chatHistory;

        if (!chatHistory) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "chatHistory is missing in the request." })
            };
        }
    } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON format in request body." })
        };
    }

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
        console.log('OpenRouter API response:', data); // Debug line

        if (!data.choices || !data.choices.length) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "No response from AI model." })
            };
        }

        const botResponse = data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: botResponse })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error: " + error.message })
        };
    }
};
