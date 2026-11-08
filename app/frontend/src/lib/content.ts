export type Lang = 'en' | 'zh';
type L = Record<Lang, string>;

export const URLS = {
  explainer: 'https://bryan273.github.io/repro-suite/explainer',
  repro: 'https://bryan273.github.io/repro-suite/repro/index.html',
  reproLite: 'https://bryan273.github.io/repro-suite/lite',
  reading: 'https://bryan273.github.io/repro-suite/reading',
  indexboard: 'https://bryan273.github.io/repro-suite/indexboard/b/5dhum9j5h0',
  reproDesk: 'https://bryan273.github.io/repro-suite/desk',
  benchmark: 'https://bryan273.github.io/repro-suite/repro/bench.html',
} as const;


export const SHOTS = {
  explainer: import.meta.env.BASE_URL + 'shots/paperexplainer.webp',
  repro: import.meta.env.BASE_URL + 'shots/paperrepro.webp',
  reproLite: import.meta.env.BASE_URL + 'shots/reprolite.webp',
  reading: import.meta.env.BASE_URL + 'shots/readingcompanion.webp',
  indexboard: import.meta.env.BASE_URL + 'shots/indexboard.webp',
  reproDesk: import.meta.env.BASE_URL + 'shots/reprodesk.webp',
} as const;

export interface NavLink {
  name: string;
  url: string;
}

export const NAV_GROUPS: { title: L; links: NavLink[] }[] = [
  {
    title: { en: 'Main products', zh: '主要产品' },
    links: [
      { name: 'Paper Explainer', url: URLS.explainer },
      { name: 'Paper Repro Agent', url: URLS.repro },
    ],
  },
  {
    title: { en: 'Supporting tools', zh: '辅助工具' },
    links: [
      { name: 'Repro Lite', url: URLS.reproLite },
      { name: 'Reading Companion', url: URLS.reading },
      { name: 'IndexBoard', url: URLS.indexboard },
      { name: 'Repro Desk', url: URLS.reproDesk },
    ],
  },
  {
    title: { en: 'Research', zh: '研究' },
    links: [{ name: 'Benchmark', url: URLS.benchmark }],
  },
];

export const REPRO_FACTS: { value: string; label: L }[] = [
  { value: '6', label: { en: 'models', zh: '个模型' } },
  { value: '32', label: { en: 'papers', zh: '篇论文' } },
  { value: '281', label: { en: 'runs', zh: '次运行' } },
  { value: '89.2', label: { en: 'best Repro Index', zh: '最佳 Repro Index' } },
];

export const FLOW: { name: L; role: L; url?: string }[] = [
  { name: { en: 'Paper', zh: '论文' }, role: { en: 'an AI research paper', zh: '一篇 AI 研究论文' } },
  { name: { en: 'Explainer', zh: 'Explainer' }, role: { en: 'understand it', zh: '理解它' }, url: URLS.explainer },
  { name: { en: 'Repro Agent', zh: 'Repro Agent' }, role: { en: 'check it', zh: '检验它' }, url: URLS.repro },
  { name: { en: 'Benchmark', zh: 'Benchmark' }, role: { en: 'compare models', zh: '比较模型' }, url: URLS.benchmark },
];

export const SUPPORTING: { name: string; url: string; shot: string; line: L }[] = [
  {
    name: 'Repro Lite',
    url: URLS.reproLite,
    shot: SHOTS.reproLite,
    line: {
      en: 'Check one claim in about 40 seconds; the agent runs Python in your browser.',
      zh: '约 40 秒检验一个结论；智能体直接在你的浏览器中运行 Python。',
    },
  },
  {
    name: 'Reading Companion',
    url: URLS.reading,
    shot: SHOTS.reading,
    line: {
      en: 'An agent reads arXiv papers with you, cites every claim and marks what it could not verify.',
      zh: '智能体陪你阅读 arXiv 论文，为每个结论注明出处，并标出无法核实的内容。',
    },
  },
  {
    name: 'IndexBoard',
    url: URLS.indexboard,
    shot: SHOTS.indexboard,
    line: {
      en: 'Turn any results into an honest leaderboard with intervals and ties.',
      zh: '把任意结果变成一份标注置信区间与并列名次的诚实排行榜。',
    },
  },
  {
    name: 'Repro Desk',
    url: URLS.reproDesk,
    shot: SHOTS.reproDesk,
    line: {
      en: 'Ask for a human-checked reproduction of a paper, as a free pilot.',
      zh: '以免费试点的形式，申请一次经人工核查的论文复现。',
    },
  },
];

export const COPY = {
  en: {
    tagline: 'Learn a paper. Then check it.',
    menu: 'Open menu',
    close: 'Close menu',
    newTab: '(opens in a new tab)',
    themeToDark: 'Switch to dark mode',
    themeToLight: 'Switch to light mode',
    langLabel: 'Language',
    eyebrow: 'Paperlit',
    heroTitle: 'Learn a paper. Then check it.',
    heroSub:
      'Two tools for AI research papers: a short narrated video that explains the paper, and an agent that re-runs the experiment and tells you whether the number holds.',
    explain: 'Explain a paper',
    check: 'Check a paper',
    learnTag: 'Learn',
    checkTag: 'Check',
    explainerText:
      'Paste an arXiv link and get a 40 second video in English and 中文. Every quote and number on screen is checked against the paper.',
    videosMade: ['', 'videos made'] as [string, string],
    videosLoading: 'Loading recent videos…',
    videosError: 'Recent videos are unavailable right now.',
    videoLabel: (title: string) => `Paper Explainer video: ${title}`,
    makeVideo: 'Make a video',
    reproText:
      'The agent reads the paper, fixes a tolerance before any code runs, writes and runs the code, re-runs it from scratch and gives a verdict.',
    watchRepro: 'Watch a reproduction',
    shotAlt: (name: string) => `Screenshot of ${name}`,
    fitTitle: 'How they fit together',
    fitSub: 'One path from reading a paper to trusting its numbers.',
    supportTitle: 'Supporting tools',
    supportSub: 'Smaller tools around the same workflow.',
    open: 'Open',
    footTeam: 'Group 1, Tsinghua SIGS AIID capstone',
    footPartners: 'Partners: DeepWisdom and StepFun',
    footApps: 'All apps',
  },
  zh: {
    tagline: '先读懂论文，再检验它。',
    menu: '打开菜单',
    close: '关闭菜单',
    newTab: '（在新标签页打开）',
    themeToDark: '切换到深色模式',
    themeToLight: '切换到浅色模式',
    langLabel: '语言',
    eyebrow: 'Paperlit',
    heroTitle: '先读懂论文，再检验它。',
    heroSub:
      '两款面向 AI 研究论文的工具：一段讲解论文的简短配音视频，以及一个重新运行实验、告诉你数字是否站得住的智能体。',
    explain: '讲解一篇论文',
    check: '检验一篇论文',
    learnTag: '学习',
    checkTag: '检验',
    explainerText: '粘贴一个 arXiv 链接，即可得到一段 40 秒的中英文视频。屏幕上的每一句引文和每一个数字都与论文原文核对过。',
    videosMade: ['已制作', '个视频'] as [string, string],
    videosLoading: '正在加载最新视频…',
    videosError: '暂时无法获取最新视频。',
    videoLabel: (title: string) => `Paper Explainer 视频：${title}`,
    makeVideo: '制作视频',
    reproText: '智能体阅读论文，在运行任何代码之前确定容差，编写并运行代码，从头重新运行，最后给出结论。',
    watchRepro: '观看一次复现',
    shotAlt: (name: string) => `${name} 截图`,
    fitTitle: '它们如何协同',
    fitSub: '从读懂一篇论文到信任其中的数字，一条完整的路径。',
    supportTitle: '辅助工具',
    supportSub: '围绕同一工作流的小工具。',
    open: '打开',
    footTeam: '清华大学深圳国际研究生院 AIID 毕业设计第 1 组',
    footPartners: '合作伙伴：DeepWisdom 与 StepFun',
    footApps: '全部应用',
  },
};

export type Copy = (typeof COPY)['en'];
