import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from './api/page.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
const PORT = process.env.PORT || 3000;

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/page') return handler(req, res);
  if (url.pathname === '/api/health') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify({ ok: true, ai: !!process.env.AI_API_KEY })); }
  let p = url.pathname === '/' ? '/index.html' : url.pathname;
  const base = p.startsWith('/src/') ? root : join(root, 'public');
  const file = normalize(join(base, p));
  if (!file.startsWith(root)) { res.statusCode = 403; return res.end(); }
  try { const data = await readFile(file); res.setHeader('content-type', TYPES[extname(file)] || 'application/octet-stream'); res.end(data); }
  catch { res.statusCode = 404; res.end('404 - 此号码不存在 / number not in service'); }
}).listen(PORT, () => console.log(`📟 AI Pager Station on http://localhost:${PORT}`));
