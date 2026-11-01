// Netlify Function (v2, ESM): GET /api/health
export default async () => new Response(JSON.stringify({ ok: true, ai: !!process.env.AI_API_KEY }), { headers: { 'content-type': 'application/json' } });
