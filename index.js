
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();

// Environment variables set in Railway dashboard
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const tebexSecret = process.env.TEBEX_SECRET;

if (!discordWebhookUrl || !tebexSecret) {
  console.error("❌ DISCORD_WEBHOOK_URL and TEBEX_SECRET must be set as environment variables.");
  process.exit(1);
}

// Capture raw body for signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.post('/login', async (req, res) => {
  const signature = req.headers['x-signature'];
  if (!signature) {
    console.warn("❌ No signature header received.");
    return res.status(400).send('Missing signature');
  }

  // Re‑create HMAC SHA‑256 signature
  const expectedSignature = crypto
    .createHmac('sha256', tebexSecret)
    .update(req.rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.warn("❌ Invalid signature.");
    return res.status(403).send('Forbidden');
  }

  const { email, ip, username } = req.body;

  // Build Discord embed
  const embed = {
    title: "🔐 Nouveau login sur Tebex",
    description: "Un utilisateur vient de se connecter à la boutique.",
    color: 0x00ff99,
    fields: [
      { name: "👤 Utilisateur", value: username || 'Non fourni', inline: true },
      { name: "📧 Email", value: email || 'Non fourni', inline: true },
      { name: "🌐 IP", value: ip || 'Non fournie', inline: false }
    ],
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(discordWebhookUrl, { embeds: [embed] });
    console.log("✅ Login envoyé sur Discord.");
  } catch (err) {
    console.error("❌ Erreur d'envoi Discord :", err.message);
  }

  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook Tebex Login en écoute sur le port ${PORT}`);
});
