import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ruleCompress, triage, detectCode, pagerLength, clip, splitMessages, buildDigest, parseAI, MAX_LEN } from '../src/engine.js';
import { CODES, CODE_MAP } from '../src/codes.js';
import { compress } from '../src/ai.js';

const samples = [
  'Hi team, just a reminder the production server is DOWN and we need everyone on a call ASAP!!',
  '老板说今天下午五点前必须把报告交上去，非常紧急，请马上处理',
  '周末一起吃饭吗？哈哈哈',
  'Newsletter: 50% discount sale this week, unsubscribe anytime',
  '我爱你，晚上早点回家',
  'x'.repeat(500), '长'.repeat(300)
];

test('every page is <= 20 chars', () => {
  for (const s of samples) assert.ok(pagerLength(ruleCompress(s).page) <= MAX_LEN, s);
  for (const s of samples) assert.ok(pagerLength(ruleCompress(s, { sender: 'Alexander' }).page) <= MAX_LEN);
});
test('urgent messages are high priority', () => {
  assert.equal(triage(samples[0]).priority, 'high');
  assert.equal(triage(samples[1]).priority, 'high');
});
test('promo is low priority', () => assert.equal(triage(samples[3]).priority, 'low'));
test('detects classic codes', () => {
  assert.equal(detectCode('我爱你'), '520');
  assert.equal(detectCode('urgent help'), '9958');
  assert.equal(detectCode('ok bye'), '886');
  assert.equal(ruleCompress('我爱你，晚上早点回家').code, '520');
});
test('deterministic', () => assert.deepEqual(ruleCompress(samples[1]), ruleCompress(samples[1])));
test('empty input', () => assert.equal(ruleCompress('').page, ''));
test('clip counts code points', () => { assert.equal(pagerLength(clip('😀'.repeat(30))), 20); });
test('splitMessages splits chat dumps', () => assert.equal(splitMessages('A: hi\nB: urgent\nC: lol').length, 3));
test('digest', () => { assert.equal(buildDigest([]), null); assert.ok(buildDigest([1, 2], 'zh').page.includes('2')); });
test('parseAI valid and invalid', () => {
  assert.equal(parseAI('{"page":"9958 SERVER DOWN","code":"9958","score":95}', 'x').priority, 'high');
  assert.equal(parseAI('garbage', 'urgent now').mode, 'rules');
});
test('code dictionary unique', () => { assert.equal(Object.keys(CODE_MAP).length, CODES.length); assert.ok(CODE_MAP['07734'] && CODE_MAP['143']); });
test('compress without key uses fallback', async () => assert.equal((await compress('urgent', {}, {})).mode, 'rules'));
