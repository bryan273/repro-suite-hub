export type Lang = 'en' | 'zh';

export interface Tool {
  id: string;
  url: string;
  name: Record<Lang, string>;
  line: Record<Lang, string>;
  audience: Record<Lang, string>;
}

export const DEMO_URL = 'https://paperrepro-aiid.atoms.world';

export const TOOLS: Tool[] = [
  {
    id: 'paper-repro-agent',
    url: 'https://paperrepro-aiid.atoms.world',
    name: { en: 'Paper Repro Agent', zh: 'Paper Repro Agent' },
    line: {
      en: 'Give it a paper and it checks whether the headline number reproduces: reads, fixes the tolerance, writes code, re-runs clean, audits.',
      zh: '给它一篇论文，它会检验核心数字能否复现：阅读论文、确定容差、编写代码、干净重跑、完成审计。',
    },
    audience: {
      en: 'Researchers and reviewers',
      zh: '研究者与审稿人',
    },
  },
  {
    id: 'repro-lite',
    url: 'https://reprolite-aiid.pub.atoms.world',
    name: { en: 'Repro Lite', zh: 'Repro Lite' },
    line: {
      en: 'Check one claim in about 40 seconds; the agent runs Python in your browser.',
      zh: '约 40 秒检验一个结论；智能体直接在你的浏览器中运行 Python。',
    },
    audience: {
      en: 'Students and readers who want a quick check',
      zh: '想要快速核查的学生与读者',
    },
  },
  {
    id: 'reading-companion',
    url: 'https://readingcompanion-aiid.pub.atoms.world',
    name: { en: 'Reading Companion', zh: 'Reading Companion' },
    line: {
      en: 'An agent reads arXiv papers with you, saves quoted notes, cites every claim and marks what it could not verify.',
      zh: '智能体陪你阅读 arXiv 论文，保存附带原文引用的笔记，为每个结论注明出处，并标出它无法核实的内容。',
    },
    audience: {
      en: 'Anyone reading papers outside their own field',
      zh: '阅读本领域之外论文的任何人',
    },
  },
  {
    id: 'indexboard',
    url: 'https://indexboard-aiid.pub.atoms.world',
    name: { en: 'IndexBoard', zh: 'IndexBoard' },
    line: {
      en: 'Turn any results, or just a sentence, into an honest leaderboard with intervals and ties; AI can build the board and pull live model data.',
      zh: '把任意结果，甚至只是一句话，变成一份标注置信区间与并列名次的诚实排行榜；AI 可以搭建榜单并拉取实时模型数据。',
    },
    audience: {
      en: 'Evaluation teams and anyone comparing models',
      zh: '评测团队以及任何需要比较模型的人',
    },
  },
  {
    id: 'repro-desk',
    url: 'https://reprodesk-aiid.pub.atoms.world',
    name: { en: 'Repro Desk', zh: 'Repro Desk' },
    line: {
      en: 'Ask for a human-checked reproduction of a paper; a free pilot to test real demand.',
      zh: '申请一次经人工核查的论文复现；这是一个用于检验真实需求的免费试点。',
    },
    audience: {
      en: 'Labs and authors',
      zh: '实验室与论文作者',
    },
  },
];

export const COPY = {
  en: {
    nav: 'Tools',
    heroKicker: 'Research reproducibility suite',
    heroTitle: 'Does the research claim really hold?',
    heroLine:
      'Five focused tools to read, test, and track scientific claims, all opened from one place.',
    explore: 'Explore the tools',
    demo: 'Watch the demo',
    credit: 'Built on Atoms by Group 1, Tsinghua SIGS AIID capstone.',
    ledgerTitle: 'In the suite',
    toolsKicker: 'The tools',
    toolsTitle: 'Pick the right tool for the question',
    toolsLine: 'Each tool opens in a new tab.',
    forLabel: 'For',
    open: 'Open',
    opensNewTab: '(opens in a new tab)',
    footer: 'Repro Suite. A hub for research reproducibility tools.',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    langLabel: 'Language',
  },
  zh: {
    nav: '工具',
    heroKicker: '科研可复现性工具集',
    heroTitle: '这项研究结论真的站得住吗？',
    heroLine: '五款专注的工具，帮你阅读、检验并追踪科研结论，一处即可打开。',
    explore: '浏览工具',
    demo: '观看演示',
    credit: '由清华大学深圳国际研究生院 AIID 毕业设计第 1 组基于 Atoms 构建。',
    ledgerTitle: '工具一览',
    toolsKicker: '工具',
    toolsTitle: '为你的问题选对工具',
    toolsLine: '每个工具都会在新标签页中打开。',
    forLabel: '适用',
    open: '打开',
    opensNewTab: '（在新标签页打开）',
    footer: 'Repro Suite · 科研可复现性工具入口。',
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    langLabel: '语言',
  },
} as const;
