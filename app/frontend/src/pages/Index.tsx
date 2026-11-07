import { useEffect, useRef, useState } from 'react';
import SuiteTopBar from '@/components/SuiteTopBar';
import { Reveal } from '@/components/SuiteUI';
import '@/components/landing.css';
import { COPY, SUPPORTING, URLS, type Lang } from '@/lib/content';
import { EXPLAINER_DEMO, HERO_RUN, METRICS, RUNS, STEPS, T, TABLE, replay, type Metric, type Verdict } from '@/lib/landing';

type Theme = 'light' | 'dark';
type Tx = (typeof T)['en'] | (typeof T)['zh'];

const THEME_KEY = 'repro.theme2';
const LANG_KEY = 'rs-lang';
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
const STEP_MS = 1500;
const TOOL_ICONS = [
  'M4 6h16M4 12h7M4 18h7M14 15l2.5 2.5L21 12',
  'M12 6.5C10 5 7 4.5 4 5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5V20.5',
  'M5 20v-7M12 20V5M19 20v-4M3 20h18',
  'M16 8a4 4 0 11-8 0 4 4 0 018 0zM4.5 20.5a7.5 7.5 0 0115 0',
];

function readStored<K extends string>(key: string, allowed: readonly K[], fallback: K): K {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v as K) ? (v as K) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* private mode: the choice just lasts for this page */
  }
}

function Tag({ v, t }: { v: Verdict; t: Tx }) {
  return <span className={`pp-tag ${v}`}>{t[v]}</span>;
}

/** Replays the recorded fastText run. Steps advance while the window is on screen; reduced motion shows the finished run. */
function RunWindow({ t, lang }: { t: Tx; lang: Lang }) {
  const steps = STEPS[lang];
  const end = steps.length;
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [step, setStep] = useState(still ? end : 0);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver((e) => setSeen(e[0].isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || step >= end) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : STEP_MS);
    return () => window.clearTimeout(id);
  }, [seen, step, end]);

  return (
    <div className="pp-win" ref={box} data-step={step > 0 ? step : undefined}>
      <div className="pp-win-bar">
        <span>
          {t.winTitle} <b>arXiv:1607.01759</b>
        </span>
        <span>{t.winRun}</span>
      </div>
      <div className="pp-win-body">
        <div className="pp-sheet">
          <p className="pp-cap">
            <b>{t.cap1}</b> {t.cap2}
          </p>
          <table className="pp-tbl">
            <thead>
              <tr>
                {TABLE.head.map((h, i) => (
                  <th key={h} className={i > 2 ? 'opt' : undefined}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE.rows.map((r, ri) => (
                <tr key={r[0]} className={ri === 4 ? 'sep' : undefined}>
                  {r.map((c, i) => (
                    <td key={i} className={[i > 2 ? 'opt' : '', ri === 5 && i === 1 ? 'hit' : ''].join(' ').trim() || undefined}>
                      {ri === 5 && i === 1 ? <span>{c}</span> : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="pp-source">{t.source}</p>
          <div className={`pp-verdict ${step >= end ? 'on' : ''}`}>
            <div>
              <span>{t.paper}</span>
              <strong>92.5</strong>
            </div>
            <div>
              <span>{t.rerun}</span>
              <strong>92.34</strong>
            </div>
            <div>
              <span>{t.gap}</span>
              <strong>0.16</strong>
            </div>
            <Tag v="ok" t={t} />
          </div>
        </div>
        <div className="pp-log">
          <ol className="pp-steps">
            {steps.map((s, i) => (
              <li key={s.t} className={`pp-step ${i < step ? 'done' : i === step ? 'now' : ''}`}>
                <i aria-hidden />
                <div>
                  <b>{s.t}</b>
                  <small>{s.p}</small>
                </div>
                <time>{s.at}</time>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="pp-win-foot">
        <span>{t.footRun}</span>
        <span>
          {!still && (
            <>
              <button type="button" className="pp-replay" onClick={() => setStep(0)}>
                {t.again}
              </button>
              {' · '}
            </>
          )}
          <a className="pp-link" href={replay(HERO_RUN)} {...ext}>
            {t.open}
          </a>
        </span>
      </div>
    </div>
  );
}

function Bars({ m }: { m: Metric }) {
  const pos = (v: number) => `${((v - m.min) / (m.max - m.min)) * 100}%`;
  return (
    <div className="pp-rows">
      {m.rows.map((r) => (
        <div className="pp-row" key={r.name}>
          <span>{r.name}</span>
          <span className="pp-track" aria-hidden>
            {r.lo !== undefined && r.hi !== undefined ? (
              <>
                <i style={{ left: pos(r.lo), width: `calc(${pos(r.hi)} - ${pos(r.lo)})` }} />
                <b style={{ left: pos(r.v) }} />
              </>
            ) : (
              <u style={{ width: pos(r.v) }} />
            )}
          </span>
          <span>
            <b>{r.label}</b>
            {r.lo !== undefined && ` (${r.lo}–${r.hi})`}
          </span>
        </div>
      ))}
    </div>
  );
}

function Benchmark({ t, lang }: { t: Tx; lang: Lang }) {
  const [k, setK] = useState(0);
  const m = METRICS[k];
  return (
    <section id="benchmark" className="pp-bench-sec">
      <Reveal>
        <div className="pp-bench-head">
          <div>
            <p className="pp-kick">{t.benchKick}</p>
            <h2 className="pp-h2">{t.benchH}</h2>
          </div>
          <a className="pp-btn line" href={URLS.benchmark} {...ext}>
            {t.benchAll}
          </a>
        </div>
      </Reveal>
      <Reveal delay={60}>
        <div className="pp-bench">
          <div>
            <div className="pp-tabs" role="tablist" aria-label={t.benchKick}>
              {METRICS.map((x, i) => (
                <button key={x.key} type="button" role="tab" aria-selected={i === k} onClick={() => setK(i)}>
                  {x.tab[lang]}
                </button>
              ))}
              <p className="pp-tabnote">{m.note[lang]}</p>
            </div>
          </div>
          <Bars m={m} />
        </div>
        <p className="pp-bench-note">{t.flips}</p>
      </Reveal>
    </section>
  );
}

function Runs({ t }: { t: Tx }) {
  return (
    <section id="runs" className="pp-runs-sec">
      <Reveal>
        <p className="pp-kick">{t.runsKick}</p>
        <h2 className="pp-h2">{t.runsH}</h2>
        <p className="pp-p" style={{ maxWidth: '62ch' }}>
          {t.runsP}
        </p>
      </Reveal>
      <Reveal delay={60}>
        <table className="pp-runs">
          <thead>
            <tr>
              <th scope="col">{t.colPaper}</th>
              <th scope="col">{t.colVerdict}</th>
              <th scope="col">{t.colRoute}</th>
              <th scope="col" style={{ textAlign: 'right' }}>
                {t.colCost}
              </th>
            </tr>
          </thead>
          <tbody>
            {RUNS.map((r) => (
              <tr key={r.file}>
                <td>
                  <a href={replay(r.file)} {...ext}>
                    {r.title}
                  </a>
                </td>
                <td>
                  <Tag v={r.verdict} t={t} />
                </td>
                <td className="rt">{t.route[r.route]}</td>
                <td className="n">
                  {r.min} min · ¥{r.cny}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}

export default function Index() {
  const [lang, setLang] = useState<Lang>(() => readStored(LANG_KEY, ['en', 'zh'], 'en'));
  const [theme, setTheme] = useState<Theme>(() => readStored(THEME_KEY, ['light', 'dark'], 'light'));
  const t: Tx = T[lang];
  const copy = COPY[lang];
  const zh = lang === 'zh';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    save(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = zh ? 'zh-CN' : 'en';
    save(LANG_KEY, lang);
  }, [lang, zh]);

  const nav = [
    { label: zh ? '产品' : 'Products', href: '#products' },
    { label: zh ? '基准' : 'Benchmark', href: '#benchmark' },
    { label: zh ? '运行记录' : 'Runs', href: '#runs' },
    { label: zh ? '工具' : 'Tools', href: '#tools' },
  ];

  return (
    <div className="pp min-h-screen">
      <SuiteTopBar appId="hub" brand="Repro Suite" letter="R" homeTo="/" nav={nav} dark={theme === 'dark'} onToggleDark={() => setTheme(theme === 'dark' ? 'light' : 'dark')} lang={lang} onLang={setLang} cta={{ label: t.explain, href: URLS.explainer }} />

      <main id="top" className="pp-wrap">
        <section className="pp-hero">
          <div className="pp-hero-top">
            <h1 className="pp-h1">
              {t.h1a}
              {zh && <br />}
              {t.h1c}
              <em className="pp-mark">{t.h1b}</em>
            </h1>
            <div>
              <p className="pp-lede">{t.lede}</p>
              <div className="pp-cta">
                <a className="pp-btn ink" href={URLS.explainer} {...ext}>
                  {t.explain}
                </a>
                <a className="pp-btn line" href={URLS.repro} {...ext}>
                  {t.check}
                </a>
              </div>
              <p className="pp-with">{t.withLine}</p>
            </div>
          </div>
          <RunWindow t={t} lang={lang} />
          <dl className="pp-nums">
            {t.nums.map(([v, l]) => (
              <div key={l}>
                <dt>{l}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pp-state">
          <Reveal>
            <p>
              {t.state1}
              <span>{t.state2}</span>
            </p>
          </Reveal>
        </section>

        <section id="products" style={{ paddingTop: 112 }}>
          <Reveal>
            <p className="pp-kick">{t.prodKick}</p>
            <h2 className="pp-h2">{t.prodH}</h2>
          </Reveal>
          <div className="pp-prods">
            <Reveal className="pp-prod">
              <div>
                <p className="pp-kick">01</p>
                <h3>{t.expName}</h3>
                <p className="pp-p">{t.expText}</p>
                <ul className="pp-facts">
                  {t.expFacts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className="pp-btn ink" href={URLS.explainer} {...ext}>
                  {t.expCta}
                </a>
              </div>
              <div>
                <div className="pp-media">
                  <video controls playsInline preload="none" poster={`${EXPLAINER_DEMO}/poster0.jpg`} src={`${EXPLAINER_DEMO}/${zh ? 'zh' : 'en'}.mp4`} title={t.expCap} />
                </div>
                <p className="pp-media-cap">{t.expCap}</p>
              </div>
            </Reveal>
            <Reveal className="pp-prod">
              <div>
                <p className="pp-kick">02</p>
                <h3>{t.repName}</h3>
                <p className="pp-p">{t.repText}</p>
                <ul className="pp-facts">
                  {t.repFacts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a className="pp-btn ink" href={replay(HERO_RUN)} {...ext}>
                  {t.repCta}
                </a>
              </div>
              <div className="pp-report">
                <h4>{t.logA}</h4>
                <blockquote>{t.logAText}</blockquote>
                <hr />
                <h4>{t.logB}</h4>
                <blockquote>{t.logBText}</blockquote>
              </div>
            </Reveal>
          </div>
        </section>

        <Benchmark t={t} lang={lang} />
        <Runs t={t} />

        <section id="rules" className="pp-rules-sec">
          <Reveal>
            <p className="pp-kick">{t.rulesKick}</p>
            <h2 className="pp-h2">{t.rulesH}</h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="pp-rules">
              {t.rules.map(([h, p], i) => (
                <div className="pp-rule" key={h}>
                  <span className="pp-kick">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="tools" className="pp-tools-sec">
          <Reveal>
            <p className="pp-kick">{t.toolsKick}</p>
            <h2 className="pp-h2">{t.toolsH}</h2>
          </Reveal>
          <Reveal delay={60}>
            <ul className="pp-tools">
              {SUPPORTING.map((s, i) => (
                <li key={s.name}>
                  <a href={s.url} {...ext}>
                    <span className="ic" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d={TOOL_ICONS[i]} />
                      </svg>
                    </span>
                    <span>
                      <b>{s.name}</b>
                      <p>{s.line[lang]}</p>
                    </span>
                    <span className="kind">{t.kinds[i]}</span>
                    <span className="sr-only">{copy.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section id="faq" className="pp-faq-sec">
          <h2 className="pp-h2" style={{ marginTop: 0 }}>
            {t.faqH}
          </h2>
          <div className="pp-faq">
            {t.faq.map(([q, a], i) => (
              <details key={q} open={i === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="pp-close">
          <h2>{t.closeH}</h2>
          <div className="pp-cta">
            <a className="pp-btn ink" href={URLS.explainer} {...ext}>
              {t.explain}
            </a>
            <a className="pp-btn line" href={URLS.repro} {...ext}>
              {t.check}
            </a>
          </div>
        </section>
      </main>

      <footer className="pp-foot">
        <div className="pp-wrap pp-foot-in">
          <div className="who">
            <b>Repro Suite</b>
            {t.tag} {copy.footTeam}
          </div>
          <nav aria-label={t.footApps}>
            <h2>{t.footApps}</h2>
            <ul>
              <li>
                <a href={URLS.explainer} {...ext}>
                  Paper Explainer
                </a>
              </li>
              <li>
                <a href={URLS.repro} {...ext}>
                  Paper Repro Agent
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label={t.footTools}>
            <h2>{t.footTools}</h2>
            <ul>
              {SUPPORTING.map((s) => (
                <li key={s.name}>
                  <a href={s.url} {...ext}>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={t.footResearch}>
            <h2>{t.footResearch}</h2>
            <ul>
              <li>
                <a href={URLS.benchmark} {...ext}>
                  Benchmark
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
