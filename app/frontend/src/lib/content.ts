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
      en: 'Walks through a paper and checks whether its central claim can be reproduced.',
      zh: '逐步解读论文，检验其核心结论能否被复现。',
    },
    audience: {
      en: 'Researchers and reviewers auditing a study in depth',
      zh: '需要深入审查研究的研究者与审稿人',
    },
  },
  {
    id: 'repro-lite',
    url: 'https://reprolite-aiid.pub.atoms.world',
    name: { en: 'Repro Lite', zh: 'Repro Lite' },
    line: {
      en: 'A fast, lightweight reproducibility check for a single claim.',
      zh: '针对单个结论的快速、轻量复现检查。',
    },
    audience: {
      en: 'Students and readers who want a quick first look',
      zh: '想要快速初步判断的学生与读者',
    },
  },
  {
    id: 'reading-companion',
    url: 'https://readingcompanion-aiid.pub.atoms.world',
    name: { en: 'Reading Companion', zh: 'Reading Companion' },
    line: {
      en: 'Reads alongside you, explaining methods and flagging weak evidence.',
      zh: '陪你阅读论文，解释方法并标出证据薄弱之处。',
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
      en: 'A board that tracks reproducibility signals across many papers.',
      zh: '跨多篇论文追踪可复现性信号的看板。',
    },
    audience: {
      en: 'Lab leads and editors comparing a body of work',
      zh: '需要横向比较一批研究的课题组负责人与编辑',
    },
  },
  {
    id: 'repro-desk',
    url: 'https://reprodesk-aiid.pub.atoms.world',
    name: { en: 'Repro Desk', zh: 'Repro Desk' },
    line: {
      en: 'A workspace for organizing reproduction projects and their findings.',
      zh: '组织复现项目及其结论的工作台。',
    },
    audience: {
      en: 'Teams running reproduction studies together',
      zh: '协作开展复现研究的团队',
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
