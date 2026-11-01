// Netlify Function (v2, ESM): POST /api/page {text, sender}
import { compress } from '../../src/ai.js';
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  let body = {};
  try { body = JSON.parse((await req.text()) || '{}'); } catch { body = {}; }
  const text = String(body.text || '').slice(0, 20000);
  if (!text.trim()) return json({ error: 'text required' }, 400);
  return json(await compress(text, { sender: body.sender || '' }));
};
