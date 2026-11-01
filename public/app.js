import { ruleCompress, splitMessages, buildDigest } from '/src/engine.js';
import { CODES, CODE_MAP } from '/src/codes.js';
const $ = id => document.getElementById(id);
const QUOTA = 5, KEY = 'aps.pages.v1';
const I18N = {
  en: { title: '📟 AI Pager Station', tabPager: 'Pager', tabCall: 'Operator Call', inbox: "Today's pages", quota: 'Daily important-page quota', clear: 'Clear all', read: 'READ',
    greet: '“Pager station, operator 027. Which number are you paging?”', to: 'Pager number / name', msg: 'Your message (long text, chat dump or email)', batch: 'Group chat dump (one message per line)',
    send: 'Page it ☎', dict: 'Code dictionary', sent: n => `Operator: ${n} page(s) sent. Beep beep!`, batched: 'Low priority → batched into daily digest.', modeAI: 'AI operator', modeRules: 'Rule-based operator (no key needed)' },
  zh: { title: '📟 AI 寻呼台', tabPager: '寻呼机', tabCall: '呼叫寻呼台', inbox: '今日传呼', quota: '每日重要传呼额度', clear: '清空', read: '查看',
    greet: '“您好，寻呼台 027 号话务员，请问您要呼几号？”', to: '呼机号 / 姓名', msg: '留言内容（长消息、群聊记录或邮件）', batch: '群聊记录（每行一条）',
    send: '帮我呼 ☎', dict: '数字暗语对照表', sent: n => `话务员：已为您发出 ${n} 条传呼，嘀嘀！`, batched: '不重要的已归入每日汇总。', modeAI: 'AI 话务员', modeRules: '规则话务员（无需密钥）' }
};
let lang = localStorage.getItem('aps.lang') || 'en', pages = JSON.parse(localStorage.getItem(KEY) || '[]'), idx = 0, aiOn = false;
const t = k => I18N[lang][k];
const today = () => new Date().toDateString();
const save = () => localStorage.setItem(KEY, JSON.stringify(pages));

function beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(); [0, .18, .36].forEach(d => { const o = a.createOscillator(), g = a.createGain(); o.type = 'square'; o.frequency.value = 2400; g.gain.value = .05; o.connect(g).connect(a.destination); o.start(a.currentTime + d); o.stop(a.currentTime + d + .12); }); } catch {} }
function buzz() { const d = $('device'); d.classList.remove('vibrate'); void d.offsetWidth; d.classList.add('vibrate'); navigator.vibrate?.(300); beep(); }

function render() {
  document.documentElement.lang = lang; $('lang').textContent = lang === 'en' ? '中文' : 'EN';
  document.querySelectorAll('[data-i18n]').forEach(e => { const v = t(e.dataset.i18n); if (typeof v === 'string') e.textContent = v; });
  const todays = pages.filter(p => p.day === today());
  const delivered = todays.filter(p => p.priority !== 'queued');
  $('quota').textContent = `${todays.filter(p => p.priority === 'high' || p.priority === 'normal').length}/${QUOTA}`;
  $('count').textContent = '✉' + delivered.length;
  $('pages').innerHTML = delivered.slice().reverse().map(p => `<li class="${p.priority}"><b>${esc(p.page)}</b><small>${p.time} · ${p.priority}${p.code && CODE_MAP[p.code] ? ' · ' + p.code + '=' + CODE_MAP[p.code][lang] : ''} · ${p.mode}</small></li>`).join('');
  const cur = delivered[delivered.length - 1 - idx]; $('lcdText').textContent = cur ? cur.page : 'READY';
  $('dict').innerHTML = CODES.map(c => `<tr><td><b>${c.code}</b></td><td>${c.zh}</td><td>${c.en}</td></tr>`).join('');
  $('mode').textContent = aiOn ? t('modeAI') : t('modeRules');
}
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function compressOne(text, sender) {
  try { const r = await fetch('/api/page', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text, sender }) }); if (r.ok) return await r.json(); } catch {}
  return ruleCompress(text, { sender }); // offline fallback in the browser
}

async function send() {
  const text = $('text').value.trim(), sender = $('sender').value.trim(); if (!text) return;
  const msgs = $('batch').checked ? splitMessages(text) : [text];
  const now = new Date(), time = now.toTimeString().slice(0, 5);
  let sent = 0, low = [];
  for (const m of msgs) {
    const r = await compressOne(m, sender);
    const used = pages.filter(p => p.day === today() && (p.priority === 'high' || p.priority === 'normal')).length;
    if (r.priority === 'low' || (r.priority === 'normal' && used >= QUOTA - 1) || used >= QUOTA) { low.push(r); continue; }
    pages.push({ ...r, day: today(), time }); sent++;
  }
  if (low.length) { const old = pages.find(p => p.day === today() && p.priority === 'digest'); const total = (old?.count || 0) + low.length; pages = pages.filter(p => p !== old); const d = buildDigest(Array(total).fill(0), lang); pages.push({ ...d, day: today(), time }); sent++; }
  save(); idx = 0; render(); buzz();
  $('opReply').textContent = t('sent')(sent) + (low.length ? ' ' + t('batched') : '');
}

$('send').onclick = send;
$('lang').onclick = () => { lang = lang === 'en' ? 'zh' : 'en'; localStorage.setItem('aps.lang', lang); render(); };
$('tabPager').onclick = () => { $('pagerView').hidden = false; $('callView').hidden = true; $('tabPager').classList.add('on'); $('tabCall').classList.remove('on'); };
$('tabCall').onclick = () => { $('pagerView').hidden = true; $('callView').hidden = false; $('tabCall').classList.add('on'); $('tabPager').classList.remove('on'); };
$('prev').onclick = () => { idx++; render(); beep(); };
$('next').onclick = () => { idx = Math.max(0, idx - 1); render(); beep(); };
$('read').onclick = buzz;
$('clear').onclick = () => { pages = []; save(); render(); };
setInterval(() => $('clock').textContent = new Date().toTimeString().slice(0, 5), 1000);
fetch('/api/health').then(r => r.json()).then(j => { aiOn = j.ai; render(); }).catch(() => {});
if (!pages.length) { pages.push({ page: '07734 WELCOME 寻呼台', code: '07734', priority: 'normal', mode: 'rules', day: today(), time: '--:--' }); }
render();
