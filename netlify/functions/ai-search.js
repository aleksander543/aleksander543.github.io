// Netlify Function: proxy do xAI Grok dla wyszukiwarki AI
// Odpowiada na POST /.netlify/functions/ai-search (redirect z /api/ai-search)
// Klucz API czytany z env: GROK_API_KEY (ustawiony w Netlify dashboard)

const https = require('https');

const GROK_API_KEY = process.env.GROK_API_KEY || '';
const GROK_MODEL   = process.env.GROK_MODEL   || 'grok-3-mini';

// Prompt systemowy dla AI (zsynchronizowany z server.js)
const AI_SEARCH_PROMPT = [
  'Jestes osobistym doradca nieruchomosci Megapolis (deweloper z Krakowa i Wroclawia).',
  'Uzytkownik opisuje wymarzone mieszkanie - Twoja rola: wyciagnac filtry i napisac krotka, ciepla, spersonalizowana odpowiedz.',
  'Zawsze odpowiadasz CZYSTYM JSON (bez markdown, bez komentarzy, bez tekstu dookola).',
  '',
  'Schemat odpowiedzi (wszystkie pola opcjonalne prócz summary, zwracaj TYLKO to co user wspomnial):',
  '{',
  '  "miasto": "krakow" | "wroclaw",',
  '  "inwestycja": "ozon" | "clou" | "fi" | "link",',
  '  "pokoje": number (1-5),',
  '  "powierzchnia_od": number (m2),',
  '  "powierzchnia_do": number (m2),',
  '  "cena_od": number (zl),',
  '  "cena_do": number (zl),',
  '  "pietro": number (0=parter, 1-4) | "parter" | "ostatnie",',
  '  "strona_swiata": ["N"|"S"|"E"|"W"|"NE"|"NW"|"SE"|"SW"],',
  '  "features": ["balkon"|"loggia"|"ogrodek"|"taras"|"antresola"|"parking"],',
  '  "promocja": boolean,',
  '  "summary": "spersonalizowana odpowiedz, 1-2 zdania (100-180 znakow), po polsku"',
  '}',
  '',
  '=== ZASADY DLA FILTROW ===',
  '- "500k", "500 tys", "pol miliona" = 500000',
  '- "2 miliony" = 2000000',
  '- "dwojka", "2pokoi" = pokoje: 2',
  '- "kawalerka" = pokoje: 1',
  '- "krak", "krakow" = "krakow"; "wroc", "wroclaw" = "wroclaw"',
  '- "poludnie", "na S" = strona_swiata: ["S"]',
  '- Jesli user nie wspomina o polu, POMIJAJ je (nie wpisuj null - po prostu nie dawaj klucza)',
  '',
  '=== ZASADY DLA SUMMARY (KLUCZOWE) ===',
  'Summary to TWOJA odpowiedz dla uzytkownika - NIE opis jego zapytania.',
  'MUSI:',
  '- Zwracac sie BEZPOSREDNIO do uzytkownika w 2. osobie ("Dla Ciebie", "Szukasz", "Twoje", "Masz")',
  '- Byc cieplą, ludzką, doradczą',
  '- Miec 1-2 zdania (100-180 znakow)',
  '- Potwierdzac zrozumienie + sugerowac co pokazujesz',
  '- Brzmiec jak doradca, nie jak robot',
  '',
  'DOBRE PRZYKLADY:',
  '- "Szukasz komfortowej dwojki w Krakowie do 500 tys. - przygotowalem dla Ciebie pasujace oferty z naszych inwestycji."',
  '- "Rozumiem - potrzebujesz mieszkania z balkonem w OZON, idealne na rodzine. Zobacz te 3 propozycje."',
  '- "Kawalerka we Wroclawiu w dobrej cenie - doskonaly pierwszy wybor. Oto co mam dla Ciebie."',
  '- "Penthouse z tarasem na ostatnim pietrze? Luksusowa decyzja - znalazlem 2 oferty wartych uwagi."',
  '',
  'ZLE PRZYKLADY (unikaj!):',
  '- "Uzytkownik pyta o mieszkania..." (NIE opisuj uzytkownika w 3. osobie)',
  '- "Szukanie 2-pokojowego mieszkania" (za suche, robotyczne)',
  '- "Pasujace filtry: miasto=krakow..." (technicznie, nieludzko)',
  '',
  '=== JESLI ZAPYTANIE NIE DOTYCZY MIESZKAN ===',
  'Zwroc: {"summary":"Hmm, nie jestem pewien jak pomoc. Opisz prosze dokladniej jakiego mieszkania szukasz - liczbe pokoi, miasto, budzet."}',
  '',
  'Zwroc TYLKO JSON, zadnego tekstu przed/po.',
].join('\n');

function callGrok(userQuery) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: GROK_MODEL,
      messages: [
        { role: 'system', content: AI_SEARCH_PROMPT },
        { role: 'user',   content: userQuery },
      ],
      temperature: 0.2,
      max_tokens: 512,
      response_format: { type: 'json_object' },
    });

    const r = https.request({
      hostname: 'api.x.ai',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROK_API_KEY,
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (rsp) => {
      let raw = '';
      rsp.on('data', c => raw += c);
      rsp.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (rsp.statusCode >= 400) return reject(new Error('Grok ' + rsp.statusCode + ': ' + (data.error && data.error.message || raw.substring(0, 200))));
          const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
          if (!text) return reject(new Error('Grok empty response'));
          resolve(JSON.parse(text));
        } catch (e) { reject(new Error('Grok parse: ' + e.message)); }
      });
    });
    r.on('error', reject);
    r.setTimeout(15000, () => { r.destroy(); reject(new Error('Grok timeout')); });
    r.write(payload);
    r.end();
  });
}

// Sanityzacja — whitelist znanych pol i wartosci
function sanitizeFilters(raw) {
  if (!raw || typeof raw !== 'object') return { summary: 'Nie rozumiem zapytania' };
  const CITIES = new Set(['krakow', 'wroclaw']);
  const INVS   = new Set(['ozon', 'clou', 'fi', 'link']);
  const DIRS   = new Set(['N','S','E','W','NE','NW','SE','SW']);
  const FEATS  = new Set(['balkon','loggia','ogrodek','taras','antresola','parking']);
  const out = {};
  if (typeof raw.miasto === 'string' && CITIES.has(raw.miasto)) out.miasto = raw.miasto;
  if (typeof raw.inwestycja === 'string' && INVS.has(raw.inwestycja)) out.inwestycja = raw.inwestycja;
  if (Number.isFinite(raw.pokoje) && raw.pokoje >= 1 && raw.pokoje <= 5) out.pokoje = Math.round(raw.pokoje);
  if (Number.isFinite(raw.powierzchnia_od) && raw.powierzchnia_od > 0) out.powierzchnia_od = Math.round(raw.powierzchnia_od);
  if (Number.isFinite(raw.powierzchnia_do) && raw.powierzchnia_do > 0) out.powierzchnia_do = Math.round(raw.powierzchnia_do);
  if (Number.isFinite(raw.cena_od) && raw.cena_od > 0) out.cena_od = Math.round(raw.cena_od);
  if (Number.isFinite(raw.cena_do) && raw.cena_do > 0) out.cena_do = Math.round(raw.cena_do);
  if (raw.pietro === 'parter' || raw.pietro === 'ostatnie' || (Number.isFinite(raw.pietro) && raw.pietro >= 0 && raw.pietro <= 4)) out.pietro = raw.pietro;
  if (Array.isArray(raw.strona_swiata)) {
    const ss = raw.strona_swiata.filter(d => typeof d === 'string' && DIRS.has(d));
    if (ss.length) out.strona_swiata = ss;
  }
  if (Array.isArray(raw.features)) {
    const f = raw.features.filter(x => typeof x === 'string' && FEATS.has(x));
    if (f.length) out.features = f;
  }
  if (typeof raw.promocja === 'boolean') out.promocja = raw.promocja;
  out.summary = typeof raw.summary === 'string' ? raw.summary.substring(0, 240) : '';
  return out;
}

// Prosta rate-limit pamiec - resetuje sie za kazdym cold-startem funkcji (OK dla prototypu)
const rateBuckets = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000;

function rateCheck(ip) {
  const now = Date.now();
  const arr = (rateBuckets.get(ip) || []).filter(t => now - t < RATE_WINDOW);
  if (arr.length >= RATE_LIMIT) return false;
  arr.push(now);
  rateBuckets.set(ip, arr);
  return true;
}

exports.handler = async (event, context) => {
  // CORS
  const baseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: baseHeaders, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: baseHeaders, body: JSON.stringify({ error: 'method not allowed' }) };
  }

  // Rate limit
  const ip = (event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown').split(',')[0].trim();
  if (!rateCheck(ip)) {
    return { statusCode: 429, headers: baseHeaders, body: JSON.stringify({ error: 'rate limit exceeded. try again in a minute' }) };
  }

  // Config check
  if (!GROK_API_KEY) {
    return { statusCode: 503, headers: baseHeaders, body: JSON.stringify({ error: 'AI search not configured (missing GROK_API_KEY env var)' }) };
  }

  // Parse body
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch (e) { return { statusCode: 400, headers: baseHeaders, body: JSON.stringify({ error: 'invalid JSON body' }) }; }
  const query = typeof body.query === 'string' ? body.query.trim().substring(0, 500) : '';
  if (!query || query.length < 2) {
    return { statusCode: 400, headers: baseHeaders, body: JSON.stringify({ error: 'query is required (min 2 chars)' }) };
  }

  // Call Grok
  try {
    const raw = await callGrok(query);
    const filters = sanitizeFilters(raw);
    return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true, provider: 'grok', filters }) };
  } catch (e) {
    console.error('AI search error:', e.message);
    return { statusCode: 502, headers: baseHeaders, body: JSON.stringify({ error: 'AI search failed', detail: e.message }) };
  }
};
