export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const text = `
💖 Пользователь нажал кнопку "Да" на сайте!
Сегодняшний комплимент: Ты самая лучшая ❤️
    `;

    // Отправка в Telegram
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram send error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}