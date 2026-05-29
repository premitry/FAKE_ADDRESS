# Address Generator Worker - Faker Only

Cloudflare Worker address generator with:

- Web UI dark theme
- Searchable country dropdown
- Telegram bot webhook
- JSON API
- Faker-only fast generation
- Full country list from `world-countries`
- No Nominatim
- No Google Maps API
- No coordinates
- No maps link

## Install

```cmd
cd /d "C:\Users\Administrator\Downloads\address-generator-worker-faker-only-v3"
npm install
```

## Telegram Secret

```cmd
wrangler secret put TELEGRAM_BOT_TOKEN
```

## Deploy

```cmd
npm run deploy
```

or:

```cmd
wrangler deploy
```

## Set Telegram Webhook

Replace `TOKEN_BOT_KAMU` and Worker URL.

```cmd
curl "https://api.telegram.org/botTOKEN_BOT_KAMU/setWebhook?url=https://address-generator.julianspes.workers.dev/telegram"
```

## API

```text
/api/countries
/api/generate?country=indonesia
/api/generate?country=id
/api/generate?country=timor-leste
```

## Telegram Input Examples

```text
/start
Indonesia
/id
Timor-Leste
/tl
Canada
```


## Notes

- Telegram `/start` uses the current Worker/custom-domain origin automatically.
- If your Worker is connected to a custom domain, `/start` will show that domain when Telegram webhook points to that domain.
- Generated Telegram output no longer shows the `Generated address` header.
