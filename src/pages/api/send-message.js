export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, telegramUser, message } = req.body;

  if (!name || !telegramUser || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const text = `
📩 Новое сообщение с сайта

👤 Имя: ${name}
🔗 Telegram: ${telegramUser}
💬 Сообщение: ${message}
    `;

    // Отправка в Telegram (без parse_mode: "_" или "*" в нике/сообщении ломали Markdown и Telegram отклонял сообщение)
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      },
    );

    if (!tgResponse.ok) {
      console.error("Telegram API error:", await tgResponse.text());
      return res.status(502).json({ error: "Failed to send message" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Telegram send error:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
