# Tebex Login Webhook Bot (Railway Template)

Recevez les **Login Webhooks** de votre boutique **Tebex** et envoyez‑les automatiquement dans un channel Discord.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/USERNAME/REPO)

## Variables d'environnement à définir sur Railway

| Variable             | Description                              |
|----------------------|------------------------------------------|
| `DISCORD_WEBHOOK_URL`| L'URL de votre webhook Discord           |
| `TEBEX_SECRET`       | La Secret Key depuis *Tebex > Webhooks*  |

## API

- **POST** `/login`  
  Route utilisée par Tebex (Login Webhooks).  
  Ne nécessite pas d'auth côté client ; la signature HMAC vérifie l'origine.

## Exécuter en local

```bash
npm install
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
export TEBEX_SECRET="votreSecretIci"
node index.js
```

Puis exposez votre port 3000 en public (ngrok ou autre) pour tester.