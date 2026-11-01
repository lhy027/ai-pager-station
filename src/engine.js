// Pager compression engine: rule-based fallback + AI wrapper. Shared by browser and server.
import { CODES } from './codes.js';

export const MAX_LEN = 20;
const HIGH = ['urgent', 'asap', 'emergency', 'help', 'deadline', 'today', 'now', 'immediately', 'outage', 'down', 'critical', 'call me', '紧急', '马上', '立刻', '急', '今天', '截止', '救命', '故障', '宕机', '速回', '回电', '医院'];
const MED = ['meeting', 'tomorrow', 'please', 'review', 'reply', 'schedule', 'invoice', 'payment', '会议', '明天', '请', '回复', '确认', '付款', '安排'];
const LOW = ['newsletter', 'unsubscribe', 'promo', 'sale', 'discount', 'lol', 'meme', '广告', '促销', '优惠', '哈哈', '表情', '退订'];
const FILLER_EN = /\b(hi|hello|hey|dear|thanks|thank you|regards|best|please|just|really|very|kindly|i think|i want to|let you know|that|the|a|an)\b/gi;
const FILLER_ZH = /(你好|您好|谢谢|麻烦|请问|那个|就是|其实|然后|一下|哈哈+|呢|吧|啊|呀|嗯)/g;

export const isCJK = s => /[\u3400-\u9fff]/.test(s);
// Pager length: every character counts as 1 (like a 20-char LCD)
export const pagerLength = s => [...s].length;
export const clip = (s, n = MAX_LEN) => { const a = [...s]; return a.length <= n ? s : a.slice(0, n - 1).join('') + '…'; };

export function triage(text) {
  const t = text.toLowerCase();
  const hit = list => list.filter(k => t.includes(k)).length;
  const h = hit(HIGH), m = hit(MED), l = hit(LOW);
  let score = 50 + h * 25 + m * 8 - l * 20 + (/[!！]{2,}/.test(text) ? 10 : 0);
  score = Math.max(0, Math.min(100, score));
  const priority = score >= 70 ? 'high' : score >= 45 ? 'normal' : 'low';
  return { score, priority };
}

export function detectCode(text) {
  const t = text.toLowerCase();
  for (const c of CODES) if (c.kw.some(k => t.includes(k))) return c.code;
  return null;
}

function firstSentence(text) {
  const parts = text.replace(/\s+/g, ' ').split(/(?<=[.!?。！？\n])\s*/).map(s => s.trim()).filter(Boolean);
  // pick the sentence carrying the most priority keywords, else the first
  let best = parts[0] || '', bestScore = -1;
  for (const p of parts) { const s = triage(p).score; if (s > bestScore) { best = p; bestScore = s; } }
  return best;
}

export function ruleCompress(text, { sender = '' } = {}) {
  const raw = String(text || '').trim();
  if (!raw) return { page: '', code: null, priority: 'low', score: 0, mode: 'rules' };
  const { score, priority } = triage(raw);
  const code = detectCode(raw);
  let core = firstSentence(raw).replace(FILLER_ZH, '').replace(FILLER_EN, '')
    .replace(/[,，;；:："“”'‘’()（）]/g, ' ').replace(/\s+/g, ' ').replace(/[.。]+$/, '').trim();
  if (!isCJK(core)) core = core.toUpperCase();
  const prefix = [code, sender && clip(sender, 4)].filter(Boolean).join(' ');
  const room = MAX_LEN - (prefix ? pagerLength(prefix) + 1 : 0);
  const page = (prefix ? prefix + ' ' : '') + clip(core, Math.max(room, 1));
  return { page: clip(page), code, priority, score, mode: 'rules' };
}

export function splitMessages(dump) {
  // group chat dumps: one message per line / blank-line separated block
  return String(dump || '').split(/\n\s*\n|\n(?=\S+[:：])/).map(s => s.trim()).filter(Boolean);
}

export function buildDigest(items, lang = 'en') {
  const n = items.length;
  if (!n) return null;
  const page = lang === 'zh' ? `日报:${n}条闲讯 已归档` : `DIGEST:${n} LOW MSGS`;
  return { page: clip(page), code: null, priority: 'digest', score: 0, mode: 'rules', count: n };
}

export const SYSTEM_PROMPT = `You are a 1990s pager operator (寻呼台话务员). Compress the user's message into ONE pager page of at most ${MAX_LEN} characters. Optionally prefix a classic numeric code (520 I love you, 1314 forever, 9958 urgent/help, 886 bye, 7456 angry, 555 crying, 530 miss you, 911 call back now, 143 I love you, 07734 hello). Keep the language of the input. Rate importance 0-100. Reply ONLY JSON: {"page":"...","code":"..."|null,"score":0-100}`;

export function parseAI(content, fallbackText) {
  try {
    const m = String(content).match(/\{[\s\S]*\}/);
    const j = JSON.parse(m[0]);
    if (!j.page) throw new Error('no page');
    const score = Math.max(0, Math.min(100, Number(j.score) || 50));
    return { page: clip(String(j.page)), code: j.code || null, score, priority: score >= 70 ? 'high' : score >= 45 ? 'normal' : 'low', mode: 'ai' };
  } catch { return ruleCompress(fallbackText); }
}
