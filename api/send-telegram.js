
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, contact, telegram, details } = req.body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return res.status(500).json({ error: 'Telegram configuration missing' });
    }

    const text = `
🔥 *Новая заявка с сайта!*

👤 *Имя:* ${name || 'Не указано'}
📞 *Контакт:* ${contact || 'Не указано'}
✈️ *Telegram:* ${telegram ? '@' + telegram.replace('@', '') : 'Не указано'}

📝 *Детали:*
${details || 'Нет деталей'}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (!data.ok) {
            console.error('Telegram API Error:', data);
            return res.status(500).json({ error: 'Failed to send message to Telegram' });
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
