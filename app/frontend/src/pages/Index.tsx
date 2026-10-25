import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Code2,
  KeyRound,
  Languages,
  MonitorSmartphone,
  Moon,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Sun,
  type LucideIcon,
} from 'lucide-react';
import BrowserFrame from '@/components/site/BrowserFrame';
import {
  COPY,
  DEMO_URL,
  EXAMPLE,
  RECORDED_RUN_URL,
  SAFETY,
  SHOTS,
  STATS,
  STEPS,
  TOOLS,
  type Copy,
  type Lang,
  type SafetyIcon,
  type StepIcon,
} from '@/lib/content';

type Theme = 'light' | 'dark';

const STEP_ICONS: Record<StepIcon, LucideIcon> = {
  read: BookOpen,
  tolerance: Ruler,
  code: Code2,
  rerun: RotateCcw,
  audit: ShieldCheck,
};
const SAFETY_ICONS: Record<SafetyIcon, LucideIcon> = {
  key: KeyRound,
  browser: MonitorSmartphone,
  lang: Languages,
};

const serif = 'font-serif-display';
const wrap = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10';
const kicker = 'text-[13px] font-medium uppercase tracking-[0.08em] text-primary';
const caption = 'text-[13px] font-medium uppercase tracking-[0.08em] text-[hsl(var(--subtle))]';
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const btnBase = `inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[15px] font-medium transition-colors duration-150 ${focusRing}`;
const btnPrimary = `${btnBase} bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]`;
const btnSecondary = `${btnBase} border border-border !bg-transparent text-foreground hover:!bg-secondary`;
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const value = localStorage.getItem(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function host(url: string) {
  return new URL(url).host;
}

function SectionHead({ k, title, line }: { k: string; title: string; line?: string }) {
  return (
    <div className="max-w-2xl">
      <p className={kicker}>{k}</p>
      <h2 className={`${serif} mt-3 text-[1.75rem] font-semibold leading-tight sm:text-[2.25rem]`}>{title}</h2>
      {line && <p className="mt-3 text-muted-foreground">{line}</p>}
    </div>
  );
}

function Header({
  t,
  lang,
  setLang,
  theme,
  setTheme,
}: {
  t: Copy;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}) {
  const links = [
    ['#tools', t.nav.tools],
    ['#how', t.nav.how],
    ['#example', t.nav.example],
  ] as const;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className={`${wrap} flex h-16 items-center justify-between gap-3`}>
        <a href="#top" className={`${serif} rounded text-xl font-semibold tracking-tight ${focusRing}`}>
          Repro Suite
        </a>
        <div className="flex items-center gap-2">
          <nav className="mr-2 hidden items-center gap-1 md:flex">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className={`inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground ${focusRing}`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div role="group" aria-label={t.langLabel} className="flex h-10 items-center rounded-lg border border-border p-1">
            {(['en', 'zh'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`h-8 rounded-md px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  lang === code ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {code === 'en' ? 'EN' : '中文'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ t }: { t: Copy }) {
  return (
    <section className={`${wrap} grid items-center gap-12 pb-16 pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-20`}>
      <div className="min-w-0 lg:col-span-5">
        <p className={kicker}>{t.heroKicker}</p>
        <h1 className={`${serif} mt-5 break-words text-[clamp(2.25rem,5.4vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.01em]`}>
          {t.heroTitle}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t.heroLine}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#tools" className={btnPrimary}>
            {t.explore}
          </a>
          <a href={DEMO_URL} {...ext} className={btnSecondary}>
            {t.demo}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
            <span className="sr-only">{t.opensNewTab}</span>
          </a>
        </div>
        <p className="mt-6 text-sm text-[hsl(var(--subtle))]">{t.credit}</p>
      </div>

      <div className="relative min-w-0 pb-[20%] lg:col-span-7 lg:pb-[16%]">
        <BrowserFrame
          eager
          src={SHOTS.paperrepro}
          alt={`${t.shotAlt} Paper Repro Agent`}
          host={host(TOOLS[0].url)}
          className="ml-auto w-[90%]"
        />
        <BrowserFrame
          compact
          src={SHOTS.reprolite}
          alt={`${t.shotAlt} Repro Lite`}
          host={host(TOOLS[1].url)}
          className="absolute left-0 top-[34%] w-[36%]"
        />
        <BrowserFrame
          compact
          src={SHOTS.indexboard}
          alt={`${t.shotAlt} IndexBoard`}
          host={host(TOOLS[3].url)}
          className="absolute bottom-0 right-[6%] w-[46%]"
        />
      </div>
    </section>
  );
}

function Stats({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <section aria-label={t.statsLabel} className="border-y border-border bg-card">
      <dl className={`${wrap} grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5`}>
        {STATS.map((s) => (
          <div key={s.value} className="min-w-0 border-l border-border pl-4">
            <dt className="sr-only">{s.label[lang]}</dt>
            <dd className={`${serif} text-[2rem] font-semibold leading-none text-primary sm:text-[2.5rem]`}>{s.value}</dd>
            <dd className="mt-2 text-sm leading-snug text-muted-foreground">{s.label[lang]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Tools({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <section id="tools" className="scroll-mt-16 bg-secondary/50">
      <div className={`${wrap} py-16 lg:py-24`}>
        <SectionHead k={t.toolsKicker} title={t.toolsTitle} line={t.toolsLine} />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <li
              key={tool.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_-12px_rgba(20,32,46,0.18)]"
            >
              <a href={tool.url} {...ext} tabIndex={-1} aria-hidden className="block border-b border-border bg-secondary">
                <img
                  src={tool.shot}
                  alt=""
                  width={1440}
                  height={900}
                  loading="eager"
                  decoding="async"
                  className="block aspect-[16/10] w-full object-cover object-top"
                />
              </a>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-xs text-[hsl(var(--subtle))]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`${serif} mt-2 text-xl font-semibold`}>{tool.name[lang]}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{tool.line[lang]}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className={caption}>{t.forLabel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{tool.audience[lang]}</p>
                </div>
                <div className="mt-auto pt-6">
                  <a
                    href={tool.url}
                    {...ext}
                    className={`${btnPrimary} w-full`}
                    aria-label={`${t.open} ${tool.name[lang]} ${t.opensNewTab}`}
                  >
                    {t.open}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function How({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <section id="how" className="scroll-mt-16">
      <div className={`${wrap} py-16 lg:py-24`}>
        <SectionHead k={t.howKicker} title={t.howTitle} line={t.howLine} />
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {STEPS.map((step, i) => {
            const Icon = STEP_ICONS[step.icon];
            return (
              <li key={step.icon} className="min-w-0 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-[hsl(var(--subtle))]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className={`${serif} mt-5 text-lg font-semibold leading-snug`}>{step.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text[lang]}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function BandChart({ t }: { t: Copy }) {
  const { reported, reproduced, tolerance, axisMin, axisMax } = EXAMPLE;
  const pct = (v: number) => `${((v - axisMin) / (axisMax - axisMin)) * 100}%`;
  const ticks = [0.8, 0.82, 0.85, 0.88, 0.9];
  return (
    <div className="mt-8" aria-hidden>
      <div className="relative mx-2 h-12">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        <div
          className="absolute top-1/2 h-6 -translate-y-1/2 rounded bg-accent ring-1 ring-primary/30"
          style={{ left: pct(reported - tolerance), width: pct(axisMin + 2 * tolerance) }}
        />
        <div className="absolute top-1 h-10 w-px bg-foreground/60" style={{ left: pct(reported) }} />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary"
          style={{ left: pct(reproduced) }}
        />
      </div>
      <div className="relative mx-2 mt-1 h-4 font-mono text-[11px] text-[hsl(var(--subtle))]">
        {ticks.map((v) => (
          <span key={v} className="absolute -translate-x-1/2" style={{ left: pct(v) }}>
            {v.toFixed(2)}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-px bg-foreground/60" />
          {t.exAxisReported} {reported.toFixed(2)}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          {t.exAxisReproduced} {reproduced.toFixed(3)}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-4 rounded-sm bg-accent ring-1 ring-primary/30" />
          {t.exBand} ±{tolerance}
        </span>
      </div>
    </div>
  );
}

function Example({ t }: { t: Copy }) {
  const rows: [string, string][] = [
    [t.exInput, t.exInputValue],
    [t.exReported, EXAMPLE.reported.toFixed(2)],
    [t.exReproduced, EXAMPLE.reproduced.toFixed(3)],
    [t.exBand, t.exBandValue],
    [t.exTime, t.exTimeValue],
    [t.exCost, t.exCostValue],
  ];
  return (
    <section id="example" className="scroll-mt-16 border-t border-border bg-secondary/50">
      <div className={`${wrap} grid items-center gap-10 py-16 lg:grid-cols-12 lg:py-24`}>
        <div className="min-w-0 lg:col-span-6">
          <p className={kicker}>{t.exKicker}</p>
          <article className="mt-5 rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className={`${serif} text-2xl font-semibold leading-snug sm:text-[1.75rem]`}>{t.exTitle}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {t.exVerdict}
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-1 gap-x-6 border-t border-border sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border py-3">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <BandChart t={t} />
            <a
              href={RECORDED_RUN_URL}
              {...ext}
              className={`mt-8 inline-flex items-center gap-1.5 rounded font-medium text-primary hover:underline ${focusRing}`}
            >
              {t.exLink}
              <ArrowRight className="h-4 w-4" aria-hidden />
              <span className="sr-only">{t.opensNewTab}</span>
            </a>
          </article>
        </div>
        <div className="min-w-0 lg:col-span-6">
          <BrowserFrame src={SHOTS.benchmark} alt={t.exShotCaption} host={host(DEMO_URL)} />
          <p className="mt-3 text-sm text-[hsl(var(--subtle))]">{t.exShotCaption}</p>
        </div>
      </div>
    </section>
  );
}

function Safety({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <section className="border-t border-border">
      <div className={`${wrap} py-16 lg:py-24`}>
        <SectionHead k={t.safeKicker} title={t.safeTitle} line={t.safeLine} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {SAFETY.map((item) => {
            const Icon = SAFETY_ICONS[item.icon];
            return (
              <li key={item.icon} className="min-w-0 rounded-xl border border-border bg-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className={`${serif} mt-5 text-lg font-semibold`}>{item.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text[lang]}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Footer({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <footer className="border-t border-border bg-card">
      <div className={`${wrap} grid gap-10 py-12 md:grid-cols-12`}>
        <div className="min-w-0 md:col-span-6">
          <p className={`${serif} text-xl font-semibold`}>Repro Suite</p>
          <p className="mt-3 text-sm text-foreground">{t.footTeam}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.footPartners}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.footBuilt}</p>
        </div>
        <nav aria-label={t.footTools} className="min-w-0 md:col-span-6">
          <p className={caption}>{t.footTools}</p>
          <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <li key={tool.id}>
                <a
                  href={tool.url}
                  {...ext}
                  className={`inline-flex items-center gap-1 rounded py-1 text-sm text-foreground hover:text-primary ${focusRing}`}
                >
                  {tool.name[lang]}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">{t.opensNewTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`${wrap} border-t border-border py-5 text-xs text-[hsl(var(--subtle))]`}>
        © {new Date().getFullYear()} Repro Suite
      </div>
    </footer>
  );
}

export default function Index() {
  const [lang, setLang] = useState<Lang>(() => readStored('rs-lang', ['en', 'zh'], 'en'));
  const [theme, setTheme] = useState<Theme>(() =>
    readStored('rs-theme', ['light', 'dark'], window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  );
  const t = COPY[lang];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('rs-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('rs-lang', lang);
  }, [lang]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header t={t} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main id="top">
        <Hero t={t} />
        <Stats t={t} lang={lang} />
        <Tools t={t} lang={lang} />
        <How t={t} lang={lang} />
        <Example t={t} />
        <Safety t={t} lang={lang} />
      </main>
      <Footer t={t} lang={lang} />
    </div>
  );
}
