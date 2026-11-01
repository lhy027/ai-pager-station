// Classic pager numeric codes (Chinese 数字暗语 + English pager codes)
export const CODES = [
  { code: '520', zh: '我爱你', en: 'I love you', kw: ['我爱你', '爱你', 'i love you', 'love you'] },
  { code: '1314', zh: '一生一世', en: 'Forever', kw: ['一生一世', '永远', 'forever'] },
  { code: '9958', zh: '救我/急事', en: 'Help! Urgent', kw: ['救命', '紧急', '急事', '十万火急', 'urgent', 'emergency', 'asap', 'help'] },
  { code: '886', zh: '拜拜了', en: 'Bye bye', kw: ['拜拜', '再见', 'bye', 'goodbye'] },
  { code: '7456', zh: '气死我了', en: "I'm so angry", kw: ['气死', '生气', 'angry', 'furious'] },
  { code: '555', zh: '呜呜呜(哭)', en: 'Crying', kw: ['哭', '难过', 'sad', 'crying'] },
  { code: '748', zh: '去死吧', en: 'Drop dead (joke)', kw: [] },
  { code: '88', zh: '再见', en: 'Bye', kw: [] },
  { code: '3344', zh: '生生世世', en: 'Life after life', kw: [] },
  { code: '530', zh: '我想你', en: 'I miss you', kw: ['想你', 'miss you'] },
  { code: '0748', zh: '你去死吧', en: 'Go away!', kw: [] },
  { code: '1573', zh: '一往情深', en: 'Deeply devoted', kw: [] },
  { code: '9420', zh: '就是爱你', en: 'Just love you', kw: [] },
  { code: '143', zh: '我爱你(英)', en: 'I love you (1-4-3 letters)', kw: [] },
  { code: '911', zh: '速回电', en: 'Emergency, call now', kw: ['call me', '回电', '速回', '马上打'] },
  { code: '07734', zh: 'hELLO(倒过来看)', en: 'hELLO (upside down)', kw: ['hello', '你好'] },
  { code: '411', zh: '有消息告诉你', en: 'I have info for you', kw: ['fyi', '告诉你'] },
  { code: '187', zh: '危险(慎用)', en: 'Danger', kw: [] }
];
export const CODE_MAP = Object.fromEntries(CODES.map(c => [c.code, c]));
