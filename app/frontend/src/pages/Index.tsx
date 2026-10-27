import { useEffect, useState, type ReactNode } from 'react';
import {
  COPY,
  EXPLAINER_FEED,
  FLOW,
  NAV_GROUPS,
  REPRO_FACTS,
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

interface ControlsProps {
  t: Copy;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

function Controls({ t, lang, setLang, theme, setTheme }: ControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
        className="rs-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] bg-[var(--card)] text-lg leading-none text-[color:var(--text)] hover:bg-[var(--soft)]"
      >
        {theme === 'dark' ? '\u2600\uFE0E' : '\u263E\uFE0E'}
      </button>
      <div
        role="group"
        aria-label={t.langLabel}
        className="flex h-10 items-center rounded-full border border-[color:var(--line)] bg-[var(--card)] p-1"
      >
        {(['en', 'zh'] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`rs-focus h-8 rounded-full px-3 text-sm font-semibold transition-colors ${
              lang === code ? 'bg-[var(--tint)] text-[color:var(--accent)]' : `${text2} hover:text-[color:var(--text)]`
            }`}
          >
            {code === 'en' ? 'EN' : '中文'}
          </button>
        ))}
      </div>
    </div>
  );
}

function SidebarBody(props: ControlsProps & { onNavigate?: () => void }) {
  const { t, lang, onNavigate } = props;
  return (
    <div className="flex h-full flex-col">
      <a href="#top" onClick={onNavigate} className="rs-focus flex items-start gap-3 rounded-xl">
        <Logo />
        <span className="min-w-0">
          <span className="block text-[15px] font-extrabold tracking-[-0.02em]">Repro Suite</span>
          <span className={`block text-[13px] leading-snug ${text2}`}>{t.tagline}</span>
        </span>
      </a>
      <nav className="mt-8 flex-1 space-y-7 overflow-y-auto">
        {NAV_GROUPS.map((g) => (
          <div key={g.title.en}>
            <p className={`px-3 text-[11px] font-semibold uppercase tracking-[0.08em] ${text2}`}>{g.title[lang]}</p>
            <ul className="mt-2 space-y-0.5">
              {g.links.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.url}
                    {...ext}
                    onClick={onNavigate}
                    className="rs-focus flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[14px] font-medium text-[color:var(--text)] hover:bg-[var(--soft)]"
                  >
                    <span className="truncate">{l.name}</span>
                    <span className={text2}>
                      <Ext t={t} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-6 border-t border-[color:var(--line)] pt-5">
        <Controls {...props} />
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
        <p className="mt-5 flex items-center gap-2 text-sm" aria-live="polite">
          {feed.status === 'ok' && (
            <>
              <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              {t.videosMade[0] && <span className={text2}>{t.videosMade[0]}</span>}
              <span className="rs-mono font-semibold text-[color:var(--text)]">{feed.count}</span>
              <span className={text2}>{t.videosMade[1]}</span>
            </>
          )}
          {feed.status === 'loading' && <span className={text2}>{t.videosLoading}</span>}
          {feed.status === 'error' && <span className={text2}>{t.videosError}</span>}
        </p>
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
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {REPRO_FACTS.map((f) => (
            <div key={f.label.en} className="min-w-0 rounded-xl bg-[var(--soft)] px-3 py-2.5">
              <dt className="sr-only">{f.label[lang]}</dt>
              <dd className="rs-mono text-[18px] font-semibold text-[color:var(--text)]">{f.value}</dd>
              <dd className={`mt-0.5 text-[12px] leading-tight ${text2}`}>{f.label[lang]}</dd>
            </div>
          ))}
        </dl>
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
            className="rs-focus mt-4 inline-flex w-fit items-center gap-1 rounded text-[14px] font-semibold text-[color:var(--accent)] hover:underline"
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

export default function Index() {
  const [lang, setLang] = useState<Lang>(() => readStored(LANG_KEY, ['en', 'zh'], 'en'));
  const [theme, setTheme] = useState<Theme>(() => readStored(THEME_KEY, ['light', 'dark'], 'light'));
  const [drawer, setDrawer] = useState(false);
  const feed = useExplainerFeed();
  const t = COPY[lang];
  const controls: ControlsProps = { t, lang, setLang, theme, setTheme };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawer]);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 border-r border-[color:var(--line)] bg-[var(--bg)] px-4 py-6 min-[900px]:block">
        <SidebarBody {...controls} />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 min-[900px]:hidden" role="dialog" aria-modal="true" aria-label="Repro Suite">
          <button
            type="button"
            aria-label={t.close}
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-[var(--scrim)]"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-[color:var(--line)] bg-[var(--bg)] px-4 py-6 shadow-[var(--shadow)]">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label={t.close}
              className={`rs-focus absolute right-3 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-xl ${text2} hover:bg-[var(--soft)]`}
            >
              {'\u00D7'}
            </button>
            <SidebarBody {...controls} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="rs-topbar sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[color:var(--line)] px-4 min-[900px]:hidden">
          <a href="#top" className="rs-focus flex items-center gap-2.5 rounded-lg">
            <Logo />
            <span className="text-[15px] font-extrabold tracking-[-0.02em]">Repro Suite</span>
          </a>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label={t.menu}
            aria-expanded={drawer}
            className="rs-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--line)] text-lg text-[color:var(--text)]"
          >
            {'\u2630'}
          </button>
        </header>

        <main id="top" className="mx-auto w-full max-w-[1080px] px-5 sm:px-8 lg:px-12">
          <section className="pt-14 sm:pt-24">
            <p className="text-[14px] font-semibold text-[color:var(--accent)]">{t.eyebrow}</p>
            <h1 className="rs-h mt-4 max-w-3xl text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02]">{t.heroTitle}</h1>
            <p className={`mt-6 max-w-2xl text-[18px] leading-relaxed sm:text-[20px] ${text2}`}>{t.heroSub}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={URLS.explainer} {...ext} className="rs-btn rs-btn-primary">
                {t.explain}
                <Ext t={t} />
              </a>
              <a href={URLS.repro} {...ext} className="rs-btn rs-btn-secondary">
                {t.check}
                <Ext t={t} />
              </a>
            </div>
          </section>

          <section className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-2">
            <ExplainerCard t={t} lang={lang} feed={feed} />
            <ReproCard t={t} lang={lang} />
          </section>

          <Section id="fit" title={t.fitTitle} sub={t.fitSub}>
            <FlowDiagram t={t} lang={lang} />
          </Section>

          <Section id="supporting" title={t.supportTitle} sub={t.supportSub}>
            <Supporting t={t} lang={lang} />
          </Section>

          <Footer t={t} />
        </main>
      </div>
    </div>
  );
}
