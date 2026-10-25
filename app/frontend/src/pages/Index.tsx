import { useEffect, useState } from 'react';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { COPY, DEMO_URL, TOOLS, type Lang } from '@/lib/content';

type Theme = 'light' | 'dark';

const btnBase =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const btnPrimary = `${btnBase} bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))]`;
const btnSecondary = `${btnBase} border border-border !bg-transparent text-foreground hover:!bg-secondary`;

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  const value = localStorage.getItem(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export default function Index() {
  const [lang, setLang] = useState<Lang>(() => readStored('rs-lang', ['en', 'zh'], 'en'));
  const [theme, setTheme] = useState<Theme>(() =>
    readStored(
      'rs-theme',
      ['light', 'dark'],
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    ),
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

  const serif = 'font-serif-display';

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-3 px-5 sm:px-8 lg:px-10">
          <a href="#top" className={`${serif} text-xl font-semibold tracking-tight`}>
            Repro Suite
          </a>
          <div className="flex items-center gap-2">
            <a
              href="#tools"
              className="hidden h-10 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              {t.nav}
            </a>
            <div
              role="group"
              aria-label={t.langLabel}
              className="flex h-10 items-center rounded-lg border border-border p-1"
            >
              {(['en', 'zh'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`h-8 rounded-md px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    lang === code
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
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

      <main id="top">
        <section className="mx-auto grid max-w-[1120px] gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-24 lg:pt-24">
          <div className="min-w-0 lg:col-span-7">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-primary">
              {t.heroKicker}
            </p>
            <h1
              className={`${serif} mt-5 break-words text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.08] tracking-[-0.01em]`}
            >
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.heroLine}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#tools" className={btnPrimary}>
                {t.explore}
              </a>
              <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                {t.demo}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
                <span className="sr-only">{t.opensNewTab}</span>
              </a>
            </div>
            <p className="mt-6 text-sm text-[hsl(var(--subtle))]">{t.credit}</p>
          </div>

          <aside
            aria-label={t.ledgerTitle}
            className="min-w-0 self-end rounded-xl border border-border bg-card lg:col-span-5"
          >
            <p className="border-b border-border px-6 py-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[hsl(var(--subtle))]">
              {t.ledgerTitle}
            </p>
            <ol>
              {TOOLS.map((tool, i) => (
                <li key={tool.id} className="border-b border-border last:border-b-0">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  >
                    <span className="w-6 shrink-0 font-mono text-xs text-[hsl(var(--subtle))]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`${serif} min-w-0 flex-1 truncate text-[17px] font-medium`}>
                      {tool.name[lang]}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[hsl(var(--subtle))] transition-colors group-hover:text-primary"
                      aria-hidden
                    />
                    <span className="sr-only">{t.opensNewTab}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <section id="tools" className="scroll-mt-16 border-t border-border bg-secondary/50">
          <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-primary">
              {t.toolsKicker}
            </p>
            <h2 className={`${serif} mt-3 text-[2rem] font-semibold leading-tight`}>
              {t.toolsTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">{t.toolsLine}</p>

            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool, i) => (
                <li
                  key={tool.id}
                  className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_8px_24px_-12px_rgba(20,32,46,0.18)]"
                >
                  <span className="font-mono text-xs text-[hsl(var(--subtle))]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`${serif} mt-3 text-xl font-semibold`}>{tool.name[lang]}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{tool.line[lang]}</p>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-[hsl(var(--subtle))]">
                      {t.forLabel}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                      {tool.audience[lang]}
                    </p>
                  </div>
                  <div className="mt-auto pt-6">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${btnPrimary} w-full`}
                      aria-label={`${t.open} ${tool.name[lang]} ${t.opensNewTab}`}
                    >
                      {t.open}
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1120px] px-5 py-8 text-sm text-[hsl(var(--subtle))] sm:px-8 lg:px-10">
          © {new Date().getFullYear()} {t.footer}
        </div>
      </footer>
    </div>
  );
}
