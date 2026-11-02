import { useEffect, useRef, useState, type ReactNode } from 'react';
import SuiteTopBar from '@/components/SuiteTopBar';
import { SuiteFaq, SuiteCta } from '@/components/SuiteFooter';
import {
  COPY,
  EXPLAINER_FEED,
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
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
const text2 = 'text-[color:var(--text2)]';

interface FeedItem {
  title?: string;
  videos?: { en?: string; zh?: string };
}

interface Feed {
  status: 'loading' | 'ok' | 'error';
  count: number;
  videoEn?: string;
  videoZh?: string;
  title?: string;
}

function useExplainerFeed(): Feed {
  const [feed, setFeed] = useState<Feed>({ status: 'loading', count: 0 });
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(EXPLAINER_FEED, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<FeedItem[]>;
      })
      .then((list) => {
        if (!Array.isArray(list)) throw new Error('bad feed');
        const first = list[0];
        setFeed({
          status: 'ok',
          count: list.length,
          videoEn: first?.videos?.en,
          videoZh: first?.videos?.zh,
          title: first?.title,
        });
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') setFeed({ status: 'error', count: 0 });
      });
    return () => ctrl.abort();
  }, []);
  return feed;
}

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

function Shot({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={1440}
      height={900}
      loading="eager"
      decoding="sync"
      className="block aspect-[16/10] w-full rounded-xl border border-[color:var(--line)] bg-[var(--soft)] object-cover object-top"
    />
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

function Section({ id, title, sub, children }: { id?: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 pt-20 sm:pt-28">
      <h2 className="rs-h text-[1.75rem] leading-tight sm:text-[2.25rem]">{title}</h2>
      {sub && <p className={`mt-3 max-w-xl text-[17px] leading-relaxed ${text2}`}>{sub}</p>}
      <div className="mt-10">{children}</div>
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

function ExplainerCard({ t, lang, feed }: { t: Copy; lang: Lang; feed: Feed }) {
  const video = lang === 'zh' ? feed.videoZh ?? feed.videoEn : feed.videoEn ?? feed.videoZh;
  return (
    <article className="rs-card flex min-w-0 flex-col p-5 sm:p-6">
      {feed.status === 'ok' && video ? (
        <video
          key={video}
          controls
          preload="metadata"
          playsInline
          src={`${video}#t=2`}
          aria-label={t.videoLabel(feed.title ?? 'Paper Explainer')}
          className="block aspect-[16/10] w-full rounded-xl border border-[color:var(--line)] bg-black object-contain"
        />
      ) : (
        <Shot src={SHOTS.explainer} alt={t.shotAlt('Paper Explainer')} />
      )}
      <div className="mt-6 flex flex-1 flex-col">
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

function ReproCard({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <article className="rs-card flex min-w-0 flex-col p-5 sm:p-6">
      <Shot src={SHOTS.repro} alt={t.shotAlt('Paper Repro Agent')} />
      <div className="mt-6 flex flex-1 flex-col">
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

function FlowDiagram({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <ol className="rs-card flex flex-col px-6 py-8 sm:px-8 md:flex-row md:items-start md:py-10">
      {FLOW.map((step, i) => {
        const body = (
          <>
            <span className="rs-mono inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--accent)] bg-[var(--tint)] text-sm font-semibold text-[color:var(--accent)]">
              {i + 1}
            </span>
            <span className="min-w-0 md:mt-4 md:block">
              <span className="block text-[16px] font-bold text-[color:var(--text)]">
                {step.name[lang]}
                {step.url && (
                  <span className={`ml-1 ${text2}`}>
                    <Ext t={t} />
                  </span>
                )}
              </span>
              <span className={`block text-[14px] ${text2}`}>{step.role[lang]}</span>
            </span>
          </>
        );
        const cls = 'flex items-center gap-4 md:flex-col md:items-center md:gap-0 md:text-center';
        return (
          <li key={step.name.en} className="flex min-w-0 flex-col md:flex-1 md:flex-row md:items-start">
            {step.url ? (
              <a href={step.url} {...ext} className={`rs-focus rounded-xl ${cls} md:flex-1`}>
                {body}
              </a>
            ) : (
              <div className={`${cls} md:flex-1`}>{body}</div>
            )}
            {i < FLOW.length - 1 && (
              <span
                aria-hidden
                className="ml-5 h-7 w-px bg-[var(--line)] md:ml-0 md:mt-5 md:h-px md:w-8 md:shrink-0 lg:w-12"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Supporting({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 min-[1180px]:grid-cols-4">
      {SUPPORTING.map((s) => (
        <li key={s.name} className="rs-card flex min-w-0 flex-col p-4">
          <Shot src={s.shot} alt={t.shotAlt(s.name)} />
          <h3 className="rs-h mt-4 text-[17px]">{s.name}</h3>
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
  const feed = useExplainerFeed();
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
    { label: t.fitTitle, href: '#fit' },
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
        onLang={setLang}
      />

      <main id="top" className="mx-auto w-full max-w-[1160px] px-5 sm:px-8">
        <section className="grid justify-items-center gap-10 pt-10 text-center sm:pt-16">
          <div className="flex flex-col items-center">
            <p className="text-[14px] font-semibold text-[color:var(--accent)]">{t.eyebrow}</p>
            <h1 className="rs-h mx-auto mt-4 max-w-3xl text-[clamp(2.4rem,6.4vw,4.4rem)] leading-[1.02]">{t.heroTitle}</h1>
            <p className={`mx-auto mt-6 max-w-xl text-[18px] leading-relaxed ${text2}`}>{t.heroSub}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={URLS.explainer} {...ext} className="rs-btn rs-btn-primary">
                {t.explain}
                <Ext t={t} />
              </a>
              <a href={URLS.repro} {...ext} className="rs-btn rs-btn-secondary">
                {t.check}
                <Ext t={t} />
              </a>
            </div>
          </div>
          <HeroStack lang={lang} />
        </section>

        <Section
          id="start"
          title={lang === 'zh' ? '从这里开始' : 'Start here'}
          sub={lang === 'zh' ? '两个工具各管一件事：先读懂论文，再核验它的数字。' : 'Two tools, one job each: understand the paper first, then check its number.'}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <ExplainerCard t={t} lang={lang} feed={feed} />
            <ReproCard t={t} lang={lang} />
          </div>
        </Section>

        <Section id="fit" title={t.fitTitle} sub={t.fitSub}>
          <FlowDiagram t={t} lang={lang} />
        </Section>

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
