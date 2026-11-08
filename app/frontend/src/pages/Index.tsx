import { useEffect, useRef, useState, type ReactNode } from 'react';
import SuiteTopBar from '@/components/SuiteTopBar';
import { Icon, Reveal, SectionHead, ShowcaseFrame, SpotCard } from '@/components/SuiteUI';
import { SuiteFaq, SuiteCta } from '@/components/SuiteFooter';
import {
  COPY,
  FLOW,
  NAV_GROUPS,
  SHOTS,
  SUPPORTING,
  URLS,
  type Copy,
  type Lang,
} from '@/lib/content';

type Theme = 'light' | 'dark';

const THEME_KEY = 'repro.theme2';
const LANG_KEY = 'rs-lang';
const ARROW = '\u2197\uFE0E';
const ext = {} as const;   // every link here is another app of the suite: same tab, so the suite feels like one site
const text2 = 'text-[color:var(--text2)]';

function Ext({ t }: { t: Copy }) {
  return (
    <>
      <span aria-hidden className="text-[0.85em]">
        {ARROW}
      </span>
      <span className="sr-only">{t.newTab}</span>
    </>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1d1d1f] text-[17px] font-extrabold text-white dark:bg-white dark:text-[#1d1d1f]"
    >
      R
    </span>
  );
}

function HeroStack({ lang }: { lang: Lang }) {
  const host = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = host.current;
    const s = stack.current;
    if (!h || !s || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move = (e: PointerEvent) => {
      const r = h.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      s.style.setProperty('--ry', `${(22 + x * 22).toFixed(1)}deg`);
      s.style.setProperty('--rx', `${(10 - y * 16).toFixed(1)}deg`);
    };
    const leave = () => {
      s.style.removeProperty('--ry');
      s.style.removeProperty('--rx');
    };
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerleave', leave);
    return () => {
      h.removeEventListener('pointermove', move);
      h.removeEventListener('pointerleave', leave);
    };
  }, []);
  const zh = lang === 'zh';
  return (
    <div ref={host} className="rs-stage" aria-hidden>
      <div className="rs-glow" />
      <div ref={stack} className="rs-stack">
        <div className="rs-sheet rs-s1">
          <span className="tag">1 · {zh ? '学习' : 'Learn'}</span>
          <div className="rs-vid">
            <i>&#9654;</i>
            <span />
          </div>
          <small className={text2}>{zh ? '40 秒讲解视频' : '40 second explainer'}</small>
        </div>
        <div className="rs-sheet rs-s2">
          <span className="tag">2 · {zh ? '核验' : 'Check'}</span>
          <div className="rs-big">0.849</div>
          <small className={text2}>{zh ? '论文报告 0.85' : 'reported 0.85'}</small>
          <span className="rs-ok">{zh ? '✓ 已复现' : '✓ Reproduced'}</span>
          <div className="rs-band">
            <i />
            <b />
          </div>
        </div>
        <div className="rs-sheet rs-s3">
          <span className="tag">3 · {zh ? '对比' : 'Compare'}</span>
          <div className="rs-bars">
            <div>
              DeepSeek-V4.1 · 89.2
              <i style={{ width: '92%' }} />
            </div>
            <div>
              Kimi-K3 · 86.6
              <i style={{ width: '88%' }} />
            </div>
            <div>
              GLM-5.3 · 85.6
              <i style={{ width: '86%' }} />
            </div>
            <div>
              Qwen3.8 · 84.1
              <i style={{ width: '84%' }} />
            </div>
          </div>
          <small className={text2}>{zh ? '5 个模型统计上打平' : '5 of 6 models tied'}</small>
        </div>
      </div>
    </div>
  );
}

const FEATURES: Record<'en' | 'zh', { t: string; p: string; d: string; w?: string }[]> = {
  en: [
    { t: 'Quoted evidence', p: 'Every claim on screen links to a quote copied from the paper text. If a quote cannot be found, it is marked.', d: 'M7 8h10M7 12h6M5 4h14a1 1 0 011 1v14l-4-3H5a1 1 0 01-1-1V5a1 1 0 011-1z' },
    { t: 'A clean second run', p: 'The agent deletes its results and re-runs everything from scratch. The verdict comes from the second run.', d: 'M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5' },
    { t: 'Copied numbers are caught', p: 'The code is searched for the paper value. A number that was simply pasted in does not count.', d: 'M11 4a7 7 0 105 12l4 4M9 11l2 2 3-4' },
    { t: 'Fixed before it runs', p: 'The target and the tolerance are written down before any code runs, so the bar cannot move afterwards.', d: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4' },
    { t: 'English and 中文', p: 'Videos, answers and reports in both languages, with the same checks on each.', d: 'M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M12 5c-1 4-4 7-8 8M14 20l4-9 4 9M15.5 17h5' },
    { t: 'A human reads the report', p: 'For pilot checks from Repro Desk, a person reviews the report before it reaches you.', d: 'M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0' },
  ],
  zh: [
    { t: '引用有出处', p: '屏幕上的每个论断都链接到从论文原文复制的引文；找不到引文会被标出。', d: 'M7 8h10M7 12h6M5 4h14a1 1 0 011 1v14l-4-3H5a1 1 0 01-1-1V5a1 1 0 011-1z' },
    { t: '干净的第二次运行', p: '智能体先删除结果，再从零重跑一遍。最终结论来自第二次运行。', d: 'M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5M20 12a8 8 0 01-14 5.3L4 15M4 20v-5h5' },
    { t: '抄来的数字会被发现', p: '会在代码里搜索论文中的数值，直接写进去的数字不算数。', d: 'M11 4a7 7 0 105 12l4 4M9 11l2 2 3-4' },
    { t: '先定标准再运行', p: '目标值和容差在运行前写定，之后不能再改动标准。', d: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4' },
    { t: '中英双语', p: '视频、回答和报告都有中文和英文两个版本，检查标准相同。', d: 'M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M12 5c-1 4-4 7-8 8M14 20l4-9 4 9M15.5 17h5' },
    { t: '人工审阅报告', p: 'Repro Desk 的试点检查，报告送到你手里之前会由真人审阅。', d: 'M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 21a8 8 0 0116 0' },
  ],
};

function Section({ id, title, sub, children }: { id?: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section id={id} className="su-section">
      <Reveal>
        <h2 className="su-h2">{title}</h2>
        {sub && <p className="su-lead">{sub}</p>}
      </Reveal>
      <Reveal className="mt-10" delay={80}>
        {children}
      </Reveal>
    </section>
  );
}

function Tag({ label, name }: { label: string; name: string }) {
  return (
    <p className="text-[13px] font-semibold">
      <span className="text-[color:var(--accent)]">{label}</span>
      <span className={`mx-1.5 ${text2}`}>·</span>
      <span className="text-[color:var(--text)]">{name}</span>
    </p>
  );
}

function ExplainerCard({ t }: { t: Copy }) {
  return (
    <article className="rs-card flex min-w-0 flex-col p-5 sm:p-6">
      <div className="flex flex-1 flex-col">
        <img src={SHOTS.explainer} alt="" width={1424} height={900} loading="lazy" decoding="async" className="mb-5 aspect-[16/10] w-full rounded-xl border border-[color:var(--line)] object-cover object-top" />
        <Tag label={t.learnTag} name="Paper Explainer" />
        <p className={`mt-3 text-[16px] leading-relaxed ${text2}`}>{t.explainerText}</p>
        <div className="mt-auto pt-7">
          <a href={URLS.explainer} {...ext} className="rs-btn rs-btn-primary">
            {t.makeVideo}
            <Ext t={t} />
          </a>
        </div>
      </div>
    </article>
  );
}

function ReproCard({ t }: { t: Copy }) {
  return (
    <article className="rs-card flex min-w-0 flex-col p-5 sm:p-6">
      <div className="flex flex-1 flex-col">
        <img src={SHOTS.repro} alt="" width={1424} height={900} loading="lazy" decoding="async" className="mb-5 aspect-[16/10] w-full rounded-xl border border-[color:var(--line)] object-cover object-top" />
        <Tag label={t.checkTag} name="Paper Repro Agent" />
        <p className={`mt-3 text-[16px] leading-relaxed ${text2}`}>{t.reproText}</p>
        <div className="mt-auto pt-7">
          <a href={URLS.repro} {...ext} className="rs-btn rs-btn-primary">
            {t.watchRepro}
            <Ext t={t} />
          </a>
        </div>
      </div>
    </article>
  );
}

function Supporting({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 min-[1180px]:grid-cols-4">
      {SUPPORTING.map((s) => (
        <li key={s.name} className="rs-card flex min-w-0 flex-col p-4">
          <img src={s.shot} alt="" width={1424} height={900} loading="lazy" decoding="async" className="mb-3 aspect-[16/10] w-full rounded-lg border border-[color:var(--line)] object-cover object-top" />
          <h3 className="rs-h text-[17px]">{s.name}</h3>
          <p className={`mt-1.5 flex-1 text-[14px] leading-relaxed ${text2}`}>{s.line[lang]}</p>
          <a
            href={s.url}
            {...ext}
            className="rs-focus mt-3 inline-flex min-h-9 w-fit items-center gap-1 rounded text-[14px] font-semibold text-[color:var(--accent)] hover:underline"
          >
            {t.open}
            <Ext t={t} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Footer({ t }: { t: Copy }) {
  const all = NAV_GROUPS.flatMap((g) => g.links);
  return (
    <footer className="mt-24 border-t border-[color:var(--line)] py-12 sm:mt-32">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <Logo />
          <div className="min-w-0 text-sm">
            <p className="font-extrabold tracking-[-0.02em]">Repro Suite</p>
            <p className="mt-2 text-[color:var(--text)]">{t.footTeam}</p>
            <p className={`mt-1 ${text2}`}>{t.footPartners}</p>
          </div>
        </div>
        <nav aria-label={t.footApps}>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${text2}`}>{t.footApps}</p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {all.map((l) => (
              <li key={l.name}>
                <a
                  href={l.url}
                  {...ext}
                  className="rs-focus inline-flex items-center gap-1 rounded py-1 text-sm text-[color:var(--text)] hover:text-[color:var(--accent)]"
                >
                  {l.name}
                  <Ext t={t} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const v = localStorage.getItem(key);
  return allowed.includes(v as T) ? (v as T) : fallback;
}


const FAQ = {
  en: [
    { q: 'What is Repro Suite?', a: 'Two tools for AI research papers. Paper Explainer turns a paper into a short narrated video. Paper Repro Agent re-runs the experiment and tells you whether the reported number holds. Smaller tools sit around them.' },
    { q: 'Which one should I start with?', a: 'Start with Paper Explainer to understand a paper, then use Repro Lite for a quick check of one claim or the Paper Repro Agent for a full reproduction.' },
    { q: 'How do you stop the AI from inventing things?', a: 'Every quote and number in an explainer video is matched against the paper text, and anything that fails is removed before recording. The reproduction agent fixes its tolerance before any code runs and audits its own work.' },
    { q: 'Is it free?', a: 'You can try Paper Explainer without signing up. A free account gets more videos each day. Repro Desk offers a free pilot check.' },
    { q: 'Who built it?', a: 'Group 1 of the AIID capstone at Tsinghua SIGS.' },
  ],
  zh: [
    { q: 'Repro Suite 是什么？', a: '面向 AI 论文的两个工具。Paper Explainer 把论文变成简短的解说视频；Paper Repro Agent 重新运行实验，告诉你报告的数字是否成立。周围还有几个小工具。' },
    { q: '应该先用哪个？', a: '先用 Paper Explainer 读懂论文，再用 Repro Lite 快速核验一个结论，或用 Paper Repro Agent 做完整复现。' },
    { q: '如何避免 AI 编造内容？', a: '解说视频中的每句引文和每个数字都会与论文原文比对，未通过的在录制前被删除。复现智能体在运行代码前固定容差，并审查自己的工作。' },
    { q: '免费吗？', a: 'Paper Explainer 无需注册即可试用，免费账号每天可生成更多视频。Repro Desk 提供免费试点核验。' },
    { q: '谁做的？', a: '清华深圳国际研究生院 AIID 课程项目第 1 组。' },
  ],
};

export default function Index() {
  const [lang, setLang] = useState<Lang>(() => readStored(LANG_KEY, ['en', 'zh'], 'en'));
  const [theme, setTheme] = useState<Theme>(() => readStored(THEME_KEY, ['light', 'dark'], 'light'));
  const t = COPY[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const nav = [
    { label: lang === 'zh' ? '概览' : 'Overview', href: '#top' },
    { label: lang === 'zh' ? '从这里开始' : 'Start here', href: '#start' },
    { label: t.supportTitle, href: '#supporting' },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <SuiteTopBar
        appId="hub"
        brand="Repro Suite"
        letter="R"
        homeTo="/"
        nav={nav}
        dark={theme === 'dark'}
        onToggleDark={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        lang={lang}
        onLang={(l) => setLang(l as Lang)}
      />

      <main id="top" className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <section className="su-hero">
          <span className="su-pill">
            <i />
            {t.eyebrow}
          </span>
          <h1 className="su-title">
            {(() => {
              const parts = t.heroTitle.split(/(?<=[.。])\s*/).filter(Boolean);
              return parts.length > 1 ? (
                <>
                  {parts[0]} <span className="su-grad block">{parts.slice(1).join(" ")}</span>
                </>
              ) : (
                t.heroTitle
              );
            })()}
          </h1>
          <p className="su-sub">{t.heroSub}</p>
          <div className="su-cta">
            <a href={URLS.explainer} {...ext} className="su-btn">
              {t.explain}
              <Ext t={t} />
            </a>
            <a href={URLS.repro} {...ext} className="su-btn-2">
              {t.check}
              <Ext t={t} />
            </a>
          </div>
          <ShowcaseFrame
            slides={[
              { key: 'explainer', label: 'Paper Explainer', url: 'bryan273.github.io/repro-suite/explainer', src: SHOTS.explainer, alt: t.shotAlt('Paper Explainer') },
              { key: 'repro', label: 'Paper Repro Agent', url: 'bryan273.github.io/repro-suite/repro', src: SHOTS.repro, alt: t.shotAlt('Paper Repro Agent') },
              { key: 'lite', label: 'Repro Lite', url: 'bryan273.github.io/repro-suite/lite', src: SHOTS.reproLite, alt: t.shotAlt('Repro Lite') },
              { key: 'reading', label: 'Reading Companion', url: 'bryan273.github.io/repro-suite/reading', src: SHOTS.reading, alt: t.shotAlt('Reading Companion') },
              { key: 'indexboard', label: 'IndexBoard', url: 'bryan273.github.io/repro-suite/indexboard', src: SHOTS.indexboard, alt: t.shotAlt('IndexBoard') },
              { key: 'desk', label: 'Repro Desk', url: 'bryan273.github.io/repro-suite/desk', src: SHOTS.reproDesk, alt: t.shotAlt('Repro Desk') },
            ]}
          />
        </section>

        <Section
          id="start"
          title={lang === 'zh' ? '从这里开始' : 'Start here'}
          sub={lang === 'zh' ? '两个工具各管一件事：先读懂论文，再核验它的数字。' : 'Two tools, one job each: understand the paper first, then check its number.'}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <ExplainerCard t={t} />
            <ReproCard t={t} />
          </div>
        </Section>

        <section className="su-section" id="why">
          <Reveal>
            <SectionHead
              center
              eyebrow={lang === 'zh' ? '为什么可信' : 'Why you can trust it'}
              title={lang === 'zh' ? '每个数字都能回到原文。' : 'Every number traces back to the paper.'}
              lead={lang === 'zh' ? '不是让 AI 给个说法，而是把过程摊开让你检查。' : 'No black-box answer. The steps are laid out so you can check them.'}
            />
          </Reveal>
          <div className="su-bento">
            {FEATURES[lang].map((f, i) => (
              <Reveal key={f.t} delay={i * 70} className={`su-cell ${f.w ?? ''}`}>
                <SpotCard>
                  <Icon d={f.d} />
                  <h3>{f.t}</h3>
                  <p>{f.p}</p>
                </SpotCard>
              </Reveal>
            ))}
          </div>
        </section>

        <Section id="supporting" title={t.supportTitle} sub={t.supportSub}>
          <Supporting t={t} lang={lang} />
        </Section>

        <SuiteFaq lang={lang} id="faq" items={FAQ[lang]} />
        <SuiteCta
          title={lang === 'zh' ? '先读懂，再核验。' : 'Understand it first. Then check it.'}
          body={lang === 'zh' ? '从一篇论文开始，约 40 秒得到视频。' : 'Start with one paper. Get a video in about 40 seconds.'}
          label={t.explain}
          href={URLS.explainer}
        />

        <Footer t={t} />
      </main>
    </div>
  );
}
