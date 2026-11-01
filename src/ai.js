import { SYSTEM_PROMPT, parseAI, ruleCompress } from './engine.js';

export async function compress(text, opts = {}, env = process.env) {
  const key = env.AI_API_KEY;
  if (!key) return ruleCompress(text, opts);
  const base = (env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  try {
    const r = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + key },
      body: JSON.stringify({ model: env.AI_MODEL || 'gpt-4o-mini', temperature: 0.3, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: String(text).slice(0, 8000) }] }),
      signal: AbortSignal.timeout(15000)
    });
    if (!r.ok) throw new Error('AI ' + r.status);
    const j = await r.json();
    return parseAI(j.choices?.[0]?.message?.content, text);
  } catch { return { ...ruleCompress(text, opts), note: 'ai_failed_fallback' }; }
}
