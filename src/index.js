import { faker } from '@faker-js/faker';
import countriesRaw from 'world-countries';

const EXTRA_ALIASES = {
  ID: ['indo', 'indonesia', 'ri'],
  US: ['usa', 'america', 'united states of america', 'amerika'],
  GB: ['uk', 'england', 'britain', 'great britain', 'united kingdom'],
  TL: ['timor leste', 'timor-leste', 'east timor'],
  KR: ['south korea', 'korea selatan'],
  KP: ['north korea', 'korea utara'],
  RU: ['russia'],
  VN: ['vietnam', 'viet nam'],
  LA: ['laos'],
  MM: ['myanmar', 'burma'],
  AE: ['uae', 'emirates'],
  CZ: ['czech republic', 'czechia'],
  BN: ['brunei'],
  PH: ['philippines', 'filipina'],
  NL: ['netherlands', 'holland', 'belanda'],
  DE: ['germany', 'jerman'],
  JP: ['japan', 'jepang'],
  CN: ['china', 'tiongkok'],
  SA: ['saudi', 'saudi arabia'],
  MY: ['malaysia'],
  SG: ['singapore', 'singapura'],
  TH: ['thailand'],
  AU: ['australia'],
  CA: ['canada'],
};

const LOCAL_DATA = {
  ID: { cities: ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Yogyakarta', 'Denpasar', 'Makassar'], regions: ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Sumatera Utara', 'DI Yogyakarta', 'Bali', 'Sulawesi Selatan'], streets: ['Jl. Sudirman', 'Jl. Thamrin', 'Jl. Diponegoro', 'Jl. Gatot Subroto', 'Jl. Merdeka'] },
  TL: { cities: ['Dili', 'Baucau', 'Maliana', 'Suai', 'Liquica'], regions: ['Dili', 'Baucau', 'Bobonaro', 'Covalima', 'Liquica'], streets: ['Rua de Comoro', 'Avenida Nicolau Lobato', 'Rua Formosa', 'Rua Balide'] },
  US: { cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Seattle'], regions: ['New York', 'California', 'Illinois', 'Texas', 'Washington'], streets: ['Main Street', 'Oak Avenue', 'Pine Road', 'Sunset Boulevard'] },
  CA: { cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'], regions: ['Ontario', 'British Columbia', 'Quebec', 'Alberta'], streets: ['King Street', 'Queen Street', 'Yonge Street', 'Bloor Street'] },
  GB: { cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'], regions: ['England', 'Scotland', 'Wales', 'Northern Ireland'], streets: ['Baker Street', 'High Street', 'Oxford Street', 'Regent Street'] },
  JP: { cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'], regions: ['Tokyo', 'Osaka', 'Kyoto', 'Kanagawa', 'Hokkaido'], streets: ['Sakura Street', 'Shibuya Road', 'Ginza Avenue', 'Ueno Street'] },
  SG: { cities: ['Singapore'], regions: ['Central Region', 'East Region', 'West Region', 'North Region'], streets: ['Orchard Road', 'Cecil Street', 'Beach Road', 'Serangoon Road'] },
  MY: { cities: ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Kota Kinabalu'], regions: ['Kuala Lumpur', 'Penang', 'Johor', 'Perak', 'Sabah'], streets: ['Jalan Ampang', 'Jalan Tun Razak', 'Jalan Sultan Ismail', 'Jalan Pudu'] },
  AU: { cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'], regions: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'], streets: ['George Street', 'Collins Street', 'Queen Street', 'Hay Street'] },
  DE: { cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'], regions: ['Berlin', 'Bavaria', 'Hamburg', 'Hesse', 'North Rhine-Westphalia'], streets: ['Hauptstrasse', 'Bahnhofstrasse', 'Schulstrasse', 'Gartenstrasse'] },
  FR: { cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'], regions: ['Ile-de-France', 'Auvergne-Rhone-Alpes', 'Provence-Alpes-Cote d Azur', 'Occitanie'], streets: ['Rue de Rivoli', 'Avenue Victor Hugo', 'Boulevard Saint-Germain', 'Rue Lafayette'] },
};

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function callingCode(country) {
  const root = country.idd?.root || '';
  const suffix = country.idd?.suffixes?.[0] || '';
  return root ? root + suffix : '';
}

function countryToItem(country) {
  const code = country.cca2;
  const aliases = new Set([
    code,
    country.cca3,
    country.name.common,
    country.name.official,
    ...(country.altSpellings || []),
    ...(EXTRA_ALIASES[code] || []),
  ].filter(Boolean).map(normalizeText));

  return {
    name: country.name.common,
    officialName: country.name.official,
    countryCode: code,
    callingCode: callingCode(country),
    flag: country.flag || '',
    region: country.region || '',
    subregion: country.subregion || '',
    aliases: Array.from(aliases),
  };
}

const COUNTRIES = countriesRaw
  .filter(c => c.cca2 && c.name?.common)
  .map(countryToItem)
  .sort((a, b) => a.name.localeCompare(b.name));

function findCountry(input) {
  const q = normalizeText(String(input || '').replace(/^\//, ''));
  if (!q) return null;
  return COUNTRIES.find(c => c.countryCode.toLowerCase() === q || c.aliases.includes(q))
    || COUNTRIES.find(c => c.aliases.some(a => a.startsWith(q)))
    || COUNTRIES.find(c => normalizeText(c.name).includes(q));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(length) {
  let out = '';
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10);
  return out;
}

function generatePostalCode(countryCode) {
  if (countryCode === 'CA') return faker.location.zipCode('?#? #?#').toUpperCase();
  if (countryCode === 'GB') return faker.location.zipCode('??# #??').toUpperCase();
  if (countryCode === 'US') return faker.location.zipCode('#####');
  if (countryCode === 'ID') return String(faker.number.int({ min: 10000, max: 99999 }));
  if (countryCode === 'TL') return String(faker.number.int({ min: 1000, max: 9999 }));
  return faker.location.zipCode();
}

function generatePhone(country) {
  const cc = country.callingCode || '+1';
  const code = country.countryCode;
  if (code === 'ID') return cc + ' 8' + faker.number.int({ min: 11, max: 99 }) + '-' + randomDigits(4) + '-' + randomDigits(4);
  if (code === 'US' || code === 'CA') return cc + ' (' + faker.number.int({ min: 201, max: 999 }) + ') ' + faker.number.int({ min: 200, max: 999 }) + '-' + randomDigits(4);
  if (code === 'GB') return cc + ' 7' + randomDigits(3) + ' ' + randomDigits(6);
  if (code === 'JP') return cc + ' ' + faker.number.int({ min: 70, max: 90 }) + '-' + randomDigits(4) + '-' + randomDigits(4);
  return cc + ' ' + faker.number.int({ min: 100, max: 999 }) + '-' + faker.number.int({ min: 1000, max: 9999 }) + '-' + faker.number.int({ min: 1000, max: 9999 });
}

function generateAddress(country) {
  const local = LOCAL_DATA[country.countryCode];
  const street = local ? pick(local.streets) + ' No. ' + faker.number.int({ min: 1, max: 250 }) : faker.location.streetAddress();
  const city = local ? pick(local.cities) : faker.location.city();
  const province = local ? pick(local.regions) : (country.subregion || country.region || faker.location.state());
  const postalCode = generatePostalCode(country.countryCode);
  const phone = generatePhone(country);
  const fullAddress = [street, city, province, postalCode, country.name].filter(Boolean).join(', ');

  return {
    country: country.name,
    countryCode: country.countryCode,
    callingCode: country.callingCode,
    flag: country.flag,
    street,
    city,
    province,
    postalCode,
    phone,
    fullAddress,
    source: 'faker',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function htmlEscape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function telegramText(result) {
  return [
    '🏠 ' + result.flag + ' ' + result.country,
    '',
    '🌍 Country Code',
    '<code>' + htmlEscape(result.countryCode) + '</code>',
    '',
    '☎️ Calling Code',
    '<code>' + htmlEscape(result.callingCode || '-') + '</code>',
    '',
    '🛣 Street',
    '<code>' + htmlEscape(result.street) + '</code>',
    '',
    '🏙 City / Town',
    '<code>' + htmlEscape(result.city) + '</code>',
    '',
    '🗺 Province / Region',
    '<code>' + htmlEscape(result.province) + '</code>',
    '',
    '📮 Postal Code',
    '<code>' + htmlEscape(result.postalCode) + '</code>',
    '',
    '📱 Phone Number',
    '<code>' + htmlEscape(result.phone) + '</code>',
  ].join('\n');
}

async function sendTelegram(env, chatId, text) {
  if (!env.TELEGRAM_BOT_TOKEN) return;
  await fetch('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
}

function helpText(origin) {
  return [
    '🏠 Address Generator Bot',
    '',
    'Generate random address from any country.',
    '',
    '━━━━━━━━━━━━━━',
    '',
    '🌍 Send country name:',
    '<code>Indonesia</code>',
    '<code>Timor-Leste</code>',
    '<code>Canada</code>',
    '',
    '⚡ Or use country code:',
    '<code>/id</code>',
    '<code>/tl</code>',
    '<code>/ca</code>',
    '',
    '━━━━━━━━━━━━━━',
    '',
    '🌐 Web Version',
    htmlEscape(origin),
  ].join('\n');
}

async function handleTelegram(request, env) {
  const update = await request.json().catch(() => null);
  const msg = update?.message;
  if (!msg?.chat?.id) return new Response('OK');

  const chatId = msg.chat.id;
  const text = String(msg.text || '').trim();
  const origin = new URL(request.url).origin;

  if (!text || text === '/start' || text === '/help') {
    await sendTelegram(env, chatId, helpText(origin));
    return new Response('OK');
  }

  const country = findCountry(text);
  if (!country) {
    await sendTelegram(env, chatId, '❌ Negara tidak ditemukan.\n\nCoba contoh:\n<code>Indonesia</code>\n<code>/id</code>\n<code>Timor-Leste</code>\n<code>/tl</code>');
    return new Response('OK');
  }

  const result = generateAddress(country);
  await sendTelegram(env, chatId, telegramText(result));
  return new Response('OK');
}

function renderPage(appName) {
  const countriesJson = JSON.stringify(COUNTRIES.map(c => ({
    name: c.name,
    countryCode: c.countryCode,
    callingCode: c.callingCode,
    flag: c.flag,
    aliases: c.aliases,
  })));

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${htmlEscape(appName)}</title>
  <style>
    :root { color-scheme: dark; --bg:#0d1117; --card:#161b22; --card2:#0f1722; --border:#30363d; --text:#e6edf3; --muted:#8b949e; --accent:#58a6ff; --ok:#3fb950; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif; background: radial-gradient(circle at top, #132033, var(--bg) 45%); color: var(--text); min-height:100vh; }
    .wrap { width:min(980px, 100%); margin:0 auto; padding:32px 16px; }
    .hero { margin-bottom:22px; }
    h1 { margin:0 0 8px; font-size: clamp(28px, 5vw, 44px); letter-spacing:-0.04em; }
    .sub { color:var(--muted); margin:0; line-height:1.6; }
    .panel { background:rgba(22,27,34,.92); border:1px solid var(--border); border-radius:18px; box-shadow:0 24px 80px rgba(0,0,0,.35); padding:18px; }
    .grid { display:grid; grid-template-columns: 1fr auto; gap:12px; align-items:end; }
    label { display:block; margin:0 0 8px; color:var(--muted); font-size:14px; }
    .combo { position:relative; }
    .country-input { width:100%; border:1px solid var(--border); background:#0d1117; color:var(--text); border-radius:12px; padding:14px 14px; outline:none; font-size:15px; }
    .country-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(88,166,255,.15); }
    .options { display:none; position:absolute; z-index:20; left:0; right:0; top:calc(100% + 8px); max-height:320px; overflow:auto; background:#0d1117; border:1px solid var(--border); border-radius:14px; padding:6px; box-shadow:0 18px 60px rgba(0,0,0,.55); }
    .options.open { display:block; }
    .option { width:100%; display:flex; gap:10px; align-items:center; border:0; background:transparent; color:var(--text); padding:10px 12px; border-radius:10px; cursor:pointer; text-align:left; font-size:14px; }
    .option:hover, .option.active { background:#162235; }
    .option small { margin-left:auto; color:var(--muted); }
    .btn { border:1px solid #2f81f7; background:#238636; color:white; padding:14px 18px; border-radius:12px; font-weight:700; cursor:pointer; white-space:nowrap; }
    .btn.secondary { background:#21262d; border-color:var(--border); color:var(--text); }
    .btn:hover { filter:brightness(1.08); }
    .result { margin-top:18px; display:none; }
    .result.open { display:block; }
    .result-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; }
    .country-title { font-size:22px; font-weight:800; }
    table { width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border:1px solid var(--border); border-radius:14px; }
    th, td { border-bottom:1px solid var(--border); padding:13px 12px; vertical-align:middle; }
    tr:last-child th, tr:last-child td { border-bottom:0; }
    th { width:190px; text-align:left; color:var(--muted); font-weight:600; background:#0f1722; }
    td.value { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color:#c9d1d9; word-break:break-word; }
    td.action { width:88px; text-align:right; }
    .copy { border:1px solid var(--border); background:#21262d; color:var(--text); border-radius:9px; padding:7px 10px; cursor:pointer; }
    .actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
    .toast { position:fixed; right:16px; bottom:16px; background:#238636; color:#fff; padding:12px 14px; border-radius:12px; opacity:0; transform:translateY(10px); transition:.2s; }
    .toast.show { opacity:1; transform:translateY(0); }
    @media (max-width: 680px) { .grid { grid-template-columns:1fr; } th { width:130px; } td.action { width:72px; } .wrap { padding:22px 12px; } }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <h1>🏠 ${htmlEscape(appName)}</h1>
      <p class="sub">Fast worldwide dummy address generator. Select a country, generate, then copy per field or JSON.</p>
    </section>

    <section class="panel">
      <div class="grid">
        <div class="combo">
          <label for="countryInput">Country</label>
          <input id="countryInput" class="country-input" autocomplete="off" placeholder="🔍 Search or select country..." />
          <div id="options" class="options"></div>
        </div>
        <button id="generateBtn" class="btn">Generate</button>
      </div>

      <div id="result" class="result">
        <div class="result-head">
          <div id="countryTitle" class="country-title"></div>
        </div>
        <table id="resultTable"></table>
        <div class="actions">
          <button id="copyFullBtn" class="btn secondary">Copy Full Address</button>
          <button id="copyJsonBtn" class="btn secondary">Copy JSON</button>
          <button id="againBtn" class="btn">Generate Another</button>
        </div>
      </div>
    </section>
  </main>
  <div id="toast" class="toast">Copied</div>

  <script>
    var COUNTRIES = ${countriesJson};
    var selectedCountry = null;
    var lastResult = null;
    var input = document.getElementById('countryInput');
    var options = document.getElementById('options');
    var resultBox = document.getElementById('result');
    var resultTable = document.getElementById('resultTable');
    var countryTitle = document.getElementById('countryTitle');

    function norm(v) { return String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
    function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]; }); }
    function showToast(text) { var t = document.getElementById('toast'); t.textContent = text || 'Copied'; t.classList.add('show'); setTimeout(function(){ t.classList.remove('show'); }, 1200); }
    async function copyText(text) { await navigator.clipboard.writeText(String(text || '')); showToast('Copied'); }

    function filteredCountries() {
      var q = norm(input.value);
      if (!q) return COUNTRIES.slice(0, 80);
      return COUNTRIES.filter(function(c) {
        return norm(c.name).includes(q) || norm(c.countryCode).includes(q) || c.aliases.some(function(a){ return a.includes(q); });
      }).slice(0, 80);
    }

    function renderOptions() {
      var list = filteredCountries();
      options.innerHTML = list.map(function(c, i) {
        return '<button type="button" class="option ' + (i === 0 ? 'active' : '') + '" data-code="' + esc(c.countryCode) + '"><span>' + esc(c.flag) + '</span><span>' + esc(c.name) + '</span><small>' + esc(c.countryCode) + '</small></button>';
      }).join('') || '<button type="button" class="option">No country found</button>';
      options.classList.add('open');
    }

    function selectCountry(code) {
      selectedCountry = COUNTRIES.find(function(c) { return c.countryCode === code; });
      if (selectedCountry) input.value = selectedCountry.flag + ' ' + selectedCountry.name;
      options.classList.remove('open');
    }

    input.addEventListener('focus', renderOptions);
    input.addEventListener('input', function(){ selectedCountry = null; renderOptions(); });
    options.addEventListener('click', function(e) {
      var btn = e.target.closest('.option');
      if (!btn) return;
      var code = btn.getAttribute('data-code');
      if (code) selectCountry(code);
    });
    document.addEventListener('click', function(e) { if (!e.target.closest('.combo')) options.classList.remove('open'); });

    async function generate() {
      var country = selectedCountry ? selectedCountry.countryCode : input.value;
      if (!country) { input.focus(); renderOptions(); return; }
      var res = await fetch('/api/generate?country=' + encodeURIComponent(country));
      var data = await res.json();
      if (!res.ok) { alert(data.error || 'Failed'); return; }
      lastResult = data;
      renderResult(data);
    }

    function row(label, key, value) {
      return '<tr><th>' + esc(label) + '</th><td class="value">' + esc(value || '-') + '</td><td class="action"><button class="copy" data-copy-key="' + esc(key) + '">Copy</button></td></tr>';
    }

    function renderResult(d) {
      countryTitle.textContent = d.flag + ' ' + d.country;
      resultTable.innerHTML = [
        row('Country', 'country', d.country),
        row('Country Code', 'countryCode', d.countryCode),
        row('Calling Code', 'callingCode', d.callingCode),
        row('Street', 'street', d.street),
        row('City/Town', 'city', d.city),
        row('Province/Region', 'province', d.province),
        row('Postal Code', 'postalCode', d.postalCode),
        row('Phone Number', 'phone', d.phone)
      ].join('');
      resultBox.classList.add('open');
    }

    resultTable.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-copy-key]');
      if (!btn || !lastResult) return;
      copyText(lastResult[btn.getAttribute('data-copy-key')]);
    });
    document.getElementById('generateBtn').addEventListener('click', generate);
    document.getElementById('againBtn').addEventListener('click', generate);
    document.getElementById('copyFullBtn').addEventListener('click', function(){ if (lastResult) copyText(lastResult.fullAddress); });
    document.getElementById('copyJsonBtn').addEventListener('click', function(){ if (lastResult) copyText(JSON.stringify(lastResult, null, 2)); });
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });

    if (url.pathname === '/telegram' && request.method === 'POST') {
      return handleTelegram(request, env);
    }

    if (url.pathname === '/api/countries') {
      return jsonResponse(COUNTRIES.map(c => ({ name: c.name, countryCode: c.countryCode, callingCode: c.callingCode, flag: c.flag, aliases: c.aliases })));
    }

    if (url.pathname === '/api/generate') {
      const country = findCountry(url.searchParams.get('country'));
      if (!country) return jsonResponse({ error: 'Country not found' }, 404);
      return jsonResponse(generateAddress(country));
    }

    return new Response(renderPage(env.APP_NAME || 'Address Generator'), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};
