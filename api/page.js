// Vercel-style serverless function: POST /api/page {text, sender}
import { compress } from '../src/ai.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('{"error":"POST only"}'); }
  let body = req.body;
  if (!body) { let s = ''; for await (const c of req) s += c; try { body = JSON.parse(s || '{}'); } catch { body = {}; } }
  if (typeof body === 'string') body = JSON.parse(body || '{}');
  const text = String(body.text || '').slice(0, 20000);
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if (!text.trim()) { res.statusCode = 400; return res.end(JSON.stringify({ error: 'text required' })); }
  res.end(JSON.stringify(await compress(text, { sender: body.sender || '' })));
}
