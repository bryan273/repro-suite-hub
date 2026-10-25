export type Lang = 'en' | 'zh';
type L = Record<Lang, string>;

export interface Tool {
  id: string;
  url: string;
  shot: string;
  name: L;
  line: L;
  audience: L;
}

export const DEMO_URL = 'https://paperrepro-aiid.atoms.world';
export const RECORDED_RUN_URL = 'https://paperrepro-aiid.atoms.world';

export const SHOTS = {
  paperrepro: '/shots/paperrepro.webp',
  benchmark: '/shots/paperrepro-benchmark.webp',
  reprolite: '/shots/reprolite.webp',
  readingcompanion: '/shots/readingcompanion.webp',
  indexboard: '/shots/indexboard.webp',
  reprodesk: '/shots/reprodesk.webp',
  paperexplainer: '/shots/paperexplainer.webp',
} as const;

export const TOOLS: Tool[] = [
  {
    id: 'paper-repro-agent',
    url: 'https://paperrepro-aiid.atoms.world',
    shot: SHOTS.paperrepro,
    name: { en: 'Paper Repro Agent', zh: 'Paper Repro Agent' },
    line: {
      en: 'Give it a paper and it checks whether the headline number reproduces: reads, fixes the tolerance, writes code, re-runs clean, audits.',
      zh: '给它一篇论文，它会检验核心数字能否复现：阅读论文、确定容差、编写代码、干净重跑、完成审计。',
    },
    audience: { en: 'Researchers and reviewers', zh: '研究者与审稿人' },
  },
  {
    id: 'repro-lite',
    url: 'https://reprolite-aiid.pub.atoms.world',
    shot: SHOTS.reprolite,
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
    shot: SHOTS.readingcompanion,
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
    shot: SHOTS.indexboard,
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
    shot: SHOTS.reprodesk,
    name: { en: 'Repro Desk', zh: 'Repro Desk' },
    line: {
      en: 'Ask for a human-checked reproduction of a paper; a free pilot to test real demand.',
      zh: '申请一次经人工核查的论文复现；这是一个用于检验真实需求的免费试点。',
    },
    audience: { en: 'Labs and authors', zh: '实验室与论文作者' },
  },
  {
    id: 'paper-explainer',
    url: 'https://paperexplainer-aiid.pub.atoms.world',
    shot: SHOTS.paperexplainer,
    name: { en: 'Paper Explainer', zh: 'Paper Explainer' },
    line: {
      en: 'Turn a paper into a short cinematic explainer video; the first 20 seconds are free, and you can make a preview of your own paper.',
      zh: '把一篇论文变成一段简短的电影感讲解视频；前 20 秒免费，你也可以为自己的论文制作预览。',
    },
    audience: {
      en: 'Authors promoting a new paper, and readers who want a quick overview',
      zh: '推广新论文的作者，以及想快速了解概要的读者',
    },
  },
];

export const STATS: { value: string; label: L }[] = [
  { value: '32', label: { en: 'papers', zh: '篇论文' } },
  { value: '6', label: { en: 'models compared', zh: '个模型对比' } },
  { value: '281', label: { en: 'benchmark runs', zh: '次基准运行' } },
  { value: '~7 pt', label: { en: 'run-to-run noise measured', zh: '实测运行间噪声' } },
  { value: '6', label: { en: 'live tools', zh: '个在线工具' } },
];

export type StepIcon = 'read' | 'tolerance' | 'code' | 'rerun' | 'audit';

export const STEPS: { icon: StepIcon; title: L; text: L }[] = [
  {
    icon: 'read',
    title: { en: 'Read the paper', zh: '阅读论文' },
    text: {
      en: 'The agent reads the paper and pins down the exact claim and headline number to test.',
      zh: '智能体阅读论文，锁定要检验的具体结论与核心数字。',
    },
  },
  {
    icon: 'tolerance',
    title: { en: 'Fix the tolerance before running', zh: '运行前确定容差' },
    text: {
      en: 'An acceptance band is set in advance, so the verdict cannot be tuned after the fact.',
      zh: '事先设定可接受区间，结论无法在事后被调整。',
    },
  },
  {
    icon: 'code',
    title: { en: 'Write and run code', zh: '编写并运行代码' },
    text: {
      en: "It implements the method from the paper's description and runs the experiment.",
      zh: '依据论文描述实现方法，并运行实验。',
    },
  },
  {
    icon: 'rerun',
    title: { en: 'Clean re-run from scratch', zh: '从头干净重跑' },
    text: {
      en: 'The code runs again in a fresh environment to rule out leftover state.',
      zh: '在全新环境中从头再跑一次，排除残留状态的影响。',
    },
  },
  {
    icon: 'audit',
    title: { en: 'Audit and verdict', zh: '审计与结论' },
    text: {
      en: 'Each step is audited and the result is compared with the band to reach a verdict.',
      zh: '审计每一步，并将结果与预设区间对比，得出结论。',
    },
  },
];

export const EXAMPLE = {
  reported: 0.85,
  reproduced: 0.849,
  tolerance: 0.03,
  axisMin: 0.8,
  axisMax: 0.9,
};

export type SafetyIcon = 'key' | 'browser' | 'lang';

export const SAFETY: { icon: SafetyIcon; title: L; text: L }[] = [
  {
    icon: 'key',
    title: { en: 'The key stays on the server', zh: '密钥留在服务器端' },
    text: {
      en: 'Model API keys sit on the server behind a rate-limited gateway and never reach the browser.',
      zh: '模型 API 密钥保存在服务器端、位于限流网关之后，绝不会进入浏览器。',
    },
  },
  {
    icon: 'browser',
    title: { en: 'Agent code runs in your browser', zh: '智能体代码在你的浏览器中运行' },
    text: {
      en: "Code written by the agent executes in the visitor's browser, not on a shared machine.",
      zh: '智能体编写的代码在访问者的浏览器中执行，而不是在共享机器上。',
    },
  },
  {
    icon: 'lang',
    title: { en: 'Bilingual throughout', zh: '全程中英双语' },
    text: {
      en: 'Every tool works in both English and Chinese.',
      zh: '每一款工具都同时支持英文与中文。',
    },
  },
];

export const COPY = {
  en: {
    nav: { tools: 'Tools', how: 'How it works', example: 'Example' },
    heroKicker: 'Research reproducibility suite',
    heroTitle: 'Does the research claim really hold?',
    heroLine:
      'Six focused tools to read, test, track, and explain scientific claims, all opened from one place.',
    explore: 'Explore the tools',
    demo: 'Watch the demo',
    credit: 'Built on Atoms by Group 1, Tsinghua SIGS AIID capstone.',
    statsLabel: 'Results so far',
    toolsKicker: 'The tools',
    toolsTitle: 'Pick the right tool for the question',
    toolsLine: 'Each tool opens in a new tab.',
    forLabel: 'For',
    open: 'Open',
    opensNewTab: '(opens in a new tab)',
    shotAlt: 'Screenshot of',
    howKicker: 'Method',
    howTitle: 'How a check works',
    howLine: 'The same five steps behind every reproduction.',
    exKicker: 'Example result',
    exTitle: 'Isolation Forest, from the paper alone',
    exVerdict: 'Inside the band',
    exInput: 'Input',
    exInputValue: 'Paper only',
    exReported: 'Reported AUC',
    exReproduced: 'Reproduced, clean re-run',
    exBand: 'Tolerance band',
    exBandValue: '±0.03, set before running',
    exTime: 'Time',
    exTimeValue: '23 min',
    exCost: 'Cost',
    exCostValue: 'about ¥0.53',
    exAxisReported: 'reported',
    exAxisReproduced: 'reproduced',
    exLink: 'See the recorded run',
    exShotCaption: 'Paper Repro Agent, Benchmark tab',
    safeKicker: 'Infrastructure',
    safeTitle: 'Shared, safe back end',
    safeLine: 'All six tools sit on one back end designed to keep keys and code safe.',
    footTeam: 'Group 1, Tsinghua SIGS AIID capstone',
    footPartners: 'Partners: DeepWisdom and StepFun',
    footBuilt: 'Built on Atoms.',
    footTools: 'Tools',
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    langLabel: 'Language',
  },
  zh: {
    nav: { tools: '工具', how: '工作方式', example: '示例' },
    heroKicker: '科研可复现性工具集',
    heroTitle: '这项研究结论真的站得住吗？',
    heroLine: '六款专注的工具，帮你阅读、检验、追踪并讲解科研结论，一处即可打开。',
    explore: '浏览工具',
    demo: '观看演示',
    credit: '由清华大学深圳国际研究生院 AIID 毕业设计第 1 组基于 Atoms 构建。',
    statsLabel: '目前的结果',
    toolsKicker: '工具',
    toolsTitle: '为你的问题选对工具',
    toolsLine: '每个工具都会在新标签页中打开。',
    forLabel: '适用',
    open: '打开',
    opensNewTab: '（在新标签页打开）',
    shotAlt: '截图：',
    howKicker: '方法',
    howTitle: '一次检验如何进行',
    howLine: '每一次复现背后都是同样的五个步骤。',
    exKicker: '示例结果',
    exTitle: 'Isolation Forest，仅凭论文复现',
    exVerdict: '落在区间内',
    exInput: '输入',
    exInputValue: '仅论文',
    exReported: '论文报告 AUC',
    exReproduced: '复现结果（干净重跑）',
    exBand: '容差区间',
    exBandValue: '±0.03，运行前设定',
    exTime: '用时',
    exTimeValue: '23 分钟',
    exCost: '成本',
    exCostValue: '约 ¥0.53',
    exAxisReported: '报告值',
    exAxisReproduced: '复现值',
    exLink: '查看录制的运行',
    exShotCaption: 'Paper Repro Agent 的 Benchmark 页面',
    safeKicker: '基础设施',
    safeTitle: '共享、安全的后端',
    safeLine: '六款工具共用同一个后端，确保密钥与代码的安全。',
    footTeam: '清华大学深圳国际研究生院 AIID 毕业设计第 1 组',
    footPartners: '合作伙伴：DeepWisdom 与 StepFun',
    footBuilt: '基于 Atoms 构建。',
    footTools: '工具',
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    langLabel: '语言',
  },
} as const;

export type Copy = (typeof COPY)[Lang];
