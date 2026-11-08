import { useCallback, useEffect, useState } from 'react';
import SuiteTopBar from '@/components/SuiteTopBar';

const SB = 'https://wzdkroxbfrlqijbeiwpk.supabase.co/functions/v1';
const ROOT = 'https://bryan273.github.io/repro-suite';
const THEME_KEY = 'repro.theme2';
const LANG_KEY = 'rs-lang';

type Stat = { k: string; v: number };
type App = { id: string; title: string; href: string; stats: Stat[] };
type UserRow = { id: string; username: string; credits: number; banned: boolean; created_at: string; last_login: string | null; jobs: number; plan?: string | null; plan_until?: string | null };
type Job = { id: string; arxiv: string | null; title: string | null; status: string; stage: string | null; seconds: number | null; langs: string | null; cost_usd: number | null; error: string | null; created_at: string };
type Repro = { id: string; arxiv_id: string; title: string | null; lang: string | null; status: string; verdict: string | null; agent: string | null; model: string | null; created_at: string };
type Order = { id: string; email: string; arxiv: string; status: string; pay_method: string | null; notes?: string | null; created_at: string };
type Feedback = { id: string; rating: number | null; comment: string; kind: string; arxiv: string; created_at: string };
type Board = { slug: string; title: string; updated_at: string };
type Request = { id: string; created_at: string; data: Record<string, unknown> };
type Day = { d: string; signups: number; videos: number; checks: number; llm_tokens: number };
type Data = {
  me: string;
  totals: { users: number; banned: number; credits: number; signups_7d: number };
  apps: App[];
  users: UserRow[];
  jobs: Job[];
  repro: Repro[];
  requests: Request[];
  boards: Board[];
  orders: Order[];
  feedback: Feedback[];
  llm: { app: string; calls_24h: number; calls_7d: number; tokens_24h: number; tokens_7d: number; visitors_7d: number }[];
  perDay: Day[];
};

const token = () => {
  try { return localStorage.getItem('pe-session') || ''; } catch { return ''; }
};
const fmt = (s: string | null) => (s ? new Date(s).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '');
const num = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n));

async function call(fn: string, init?: RequestInit) {
  const res = await fetch(`${SB}/${fn}`, { ...init, headers: { 'x-session': token(), 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(String(out?.error ?? `HTTP ${res.status}`)), { status: res.status });
  return out;
}

type Money = { usd_cny: number; income_total: number; income_month: number; income_30d: number; cost_total: number; cost_month: number; cost_30d: number; orders_paid: number; by_kind: { k: string; n: number; cny: number }[]; days: { d: string; income: number; cost: number }[] };
type Tally = { k: string; n: number }[];
type Audience = { total: number; countries: Tally; ip_countries: Tally; langs: Tally; sources: Tally; roles: Tally };
type Rel = { v: string; at: string; title: string; bullets: string[]; sha: string; url: string };
type Ver = { id: string; label: string; repo: string; latest: string; at: string; list: Rel[] };
// each app is published from its own repository; every change that reached main is one release, numbered 1.N in the order they landed
const APPS: [string, string, string][] = [
  ['hub', 'Landing page and admin', 'repro-suite-hub'], ['explainer', 'Learn by video', 'paper-explainer'], ['reading', 'Read and ask', 'reading-companion'],
  ['backend', 'Backend, video pipeline and Check pages', 'paper-repro-agentv2'], ['lite', 'Quick check', 'repro-lite'], ['desk', 'Human check', 'repro-desk'], ['indexboard', 'Boards', 'indexboard'],
];
const yuan = (n: number) => `¥${(Math.round(n * 100) / 100).toLocaleString('en-GB')}`;
const ago = (iso: string) => {
  const m = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
};
const countryName = (c: string) => { try { return c.length === 2 ? new Intl.DisplayNames(['en'], { type: 'region' }).of(c) ?? c : c; } catch { return c; } };

/** What a release says in a few bullets: the lines of its commit message, without the sign-off lines. */
function bulletsOf(msg: string): { title: string; bullets: string[] } {
  const [first, ...rest] = msg.split('\n');
  const title = first.replace(/\s*\(#\d+\)\s*$/, '').trim();
  const lines = rest.map((l) => l.replace(/^[-*\u2022]\s*/, '').trim()).filter((l) => l && !/^(co-authored-by|generated with|\ud83e\udd16)/i.test(l) && l !== title);
  const bullets = lines.length ? lines : [];
  return { title, bullets: bullets.slice(0, 8).map((l) => (l.length > 170 ? l.slice(0, 167) + '...' : l)) };
}

/** The release history of every app, read from the public repositories: version 1.N, when it landed and what it said. */
function useVersions(): Ver[] | null {
  const [v, setV] = useState<Ver[] | null>(() => { try { const c = JSON.parse(localStorage.getItem('pe-versions3') ?? 'null') as { at: number; v: Ver[] } | null; return c && Date.now() - c.at < 30 * 60000 ? c.v : null; } catch { return null; } });
  useEffect(() => {
    if (v) return;   // seen in the last few minutes of this tab: the public API allows only so many calls
    let alive = true;
    (async () => {
      const got = await Promise.all(APPS.map(async ([id, label, repo]): Promise<Ver | null> => {
        try {
          const list = await fetch(`https://api.github.com/repos/bryan273/${repo}/commits?sha=main&per_page=25`);
          if (!list.ok) return null;
          const commits = (await list.json()) as { sha: string; html_url: string; commit: { author: { date: string }; message: string } }[];
          const rels: Rel[] = commits.map((c, i) => ({ v: c.sha.slice(0, 7), at: c.commit.author.date, sha: c.sha.slice(0, 7), url: c.html_url, ...bulletsOf(c.commit.message) }));
          return rels.length ? { id, label, repo, latest: rels[0].sha, at: rels[0].at, list: rels } : null;
        } catch { return null; }   // rate limited: try again next time
      }));
      const out = got.filter((x): x is Ver => !!x);
      if (alive && out.length) { setV(out); try { localStorage.setItem('pe-versions3', JSON.stringify({ at: Date.now(), v: out })); } catch { /* ignore */ } }
    })();
    return () => { alive = false; };
  }, [v]);
  return v;
}

type SuiteRel = { v: string; at: string; title: string; notes: string[] };
function useReleases(): SuiteRel[] | null {
  const [r, setR] = useState<SuiteRel[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}releases.json?t=${Date.now()}`).then((x) => x.json()).then((j) => alive && setR(j as SuiteRel[])).catch(() => alive && setR([]));
    return () => { alive = false; };
  }, []);
  return r;
}

function usePage<T>(items: T[], size = 10) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(items.length / size));
  const at = Math.min(page, pages - 1);
  return { rows: items.slice(at * size, at * size + size), page: at, pages, total: items.length, set: setPage };
}
function Pager({ p }: { p: { page: number; pages: number; total: number; set: (n: number) => void } }) {
  if (p.pages <= 1) return null;
  return (
    <div className="cs-pager">
      <span>{p.total} rows</span>
      <button type="button" className="cs-btn sm" disabled={p.page === 0} onClick={() => p.set(0)}>«</button>
      <button type="button" className="cs-btn sm" disabled={p.page === 0} onClick={() => p.set(p.page - 1)}>‹</button>
      <b>{p.page + 1} / {p.pages}</b>
      <button type="button" className="cs-btn sm" disabled={p.page >= p.pages - 1} onClick={() => p.set(p.page + 1)}>›</button>
      <button type="button" className="cs-btn sm" disabled={p.page >= p.pages - 1} onClick={() => p.set(p.pages - 1)}>»</button>
    </div>
  );
}

function Bars({ title, values, labels, total, tone }: { title: string; values: number[]; labels: string[]; total: string; tone?: string }) {
  const max = Math.max(1, ...values);
  return (
    <div className="cs-trend">
      <div className="cs-trend-h"><span>{title}</span><b>{total}</b></div>
      <div className="cs-bars" role="img" aria-label={title}>
        {values.map((v, i) => (<i key={i} style={{ height: `${Math.max(4, (v / max) * 100)}%`, opacity: v ? 1 : 0.25, background: tone }} title={`${labels[i]}: ${v}`} />))}
      </div>
    </div>
  );
}

function TallyTable({ title, rows, name }: { title: string; rows: Tally; name?: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="cs-wrap">
      <p className="cs-trend-h" style={{ padding: '10px 14px 0' }}><span>{title}</span></p>
      {rows.length === 0 ? <p className="cs-note sub">Nothing yet.</p> : rows.map((r) => (
        <div key={r.k} className="cs-tally"><span>{name ? name(r.k) : r.k}</span><i style={{ width: `${(r.n / max) * 100}%` }} /><b>{r.n}</b></div>
      ))}
    </div>
  );
}

/** Small bar trend for the last 14 days. */
function Trend({ title, values, labels }: { title: string; values: number[]; labels: string[] }) {
  const max = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <div className="cs-trend">
      <div className="cs-trend-h"><span>{title}</span><b>{num(total)}</b></div>
      <div className="cs-bars" role="img" aria-label={`${title}, last 14 days, total ${total}`}>
        {values.map((v, i) => (
          <i key={i} style={{ height: `${Math.max(4, (v / max) * 100)}%`, opacity: v ? 1 : 0.25 }} title={`${labels[i]}: ${v}`} />
        ))}
      </div>
    </div>
  );
}

const css = `
.cs{max-width:1160px;margin:0 auto;padding:28px 20px 80px}
.cs h1{font-size:30px;margin:0;letter-spacing:-.02em}
.cs h2{font-size:19px;margin:36px 0 12px;letter-spacing:-.01em}
.cs .sub{color:var(--text2);margin:4px 0 0;font-size:14px}
.cs-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-end}
.cs-btn{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:10px;padding:7px 14px;font:600 13px inherit;cursor:pointer}
.cs-btn:hover{border-color:var(--accent);color:var(--accent)}
.cs-tally{position:relative;display:flex;justify-content:space-between;gap:10px;padding:7px 14px;font-size:13.5px}.cs-tally i{position:absolute;left:0;bottom:0;height:3px;background:var(--accent);opacity:.55}.cs-tally b{font-variant-numeric:tabular-nums}
.cs-chart-h{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin:28px 0 10px}.cs-filters{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.cs-chip{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:999px;padding:4px 11px;font:600 12px inherit;cursor:pointer}.cs-chip.on{background:var(--accent);border-color:var(--accent);color:#fff}.cs-chip.chk{display:inline-flex;gap:5px;align-items:center}.cs-chip.chk input{margin:0}.cs-sep{width:1px;height:18px;background:var(--line);margin:0 4px}.cs-pager{display:flex;gap:6px;align-items:center;justify-content:flex-end;padding:8px 12px;font-size:12.5px}
.cs-vers{display:grid}.cs-ver{border-top:1px solid var(--line);padding:10px 14px}.cs-ver:first-child{border-top:0}.cs-ver summary{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;cursor:pointer;font-size:14px}.cs-vtag{background:var(--accent);color:#fff;border-radius:999px;padding:1px 9px;font:700 12px inherit}.cs-rel{margin:10px 0 4px;padding-left:0;list-style:none;display:grid;gap:12px}.cs-rel-h{display:flex;gap:12px;align-items:baseline;font-size:13px}.cs-rel ul{margin:4px 0 0 18px;padding:0;font-size:13px;color:var(--muted,#666)}
@media (pointer:coarse){.cs-btn.sm,.cs-chip,.cs-n{min-height:38px}}
.cs-btn.sm{padding:4px 10px;font-size:12px}
.cs-tot{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:20px}
.cs-tile{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px}
.cs-tile span{display:block;font-size:12px;color:var(--text2)}
.cs-tile b{font-size:26px;letter-spacing:-.02em}
.cs-apps{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px}
.cs-app{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px}
.cs-app header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.cs-app h3{margin:0;font-size:18px}
.cs-app a{font-size:13px;color:var(--accent);text-decoration:none}
.cs-app dl{margin:0;display:grid;grid-template-columns:1fr auto;gap:6px 14px;font-size:14px}
.cs-app dt{color:var(--text2)}
.cs-app dd{margin:0;font-weight:700;text-align:right}
.cs-trends{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.cs-trend{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px}
.cs-trend-h{display:flex;justify-content:space-between;font-size:13px;color:var(--text2)}
.cs-trend-h b{color:var(--text)}
.cs-bars{display:flex;align-items:flex-end;gap:3px;height:64px;margin-top:10px}
.cs-bars i{flex:1;background:var(--accent);border-radius:3px 3px 0 0;min-width:0}
.cs-wrap{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow-x:auto}
.cs table{width:100%;border-collapse:collapse;font-size:13.5px}
.cs th{text-align:left;font-weight:600;color:var(--text2);padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
.cs td{padding:9px 14px;border-bottom:1px solid var(--line);vertical-align:top}
.cs tr:last-child td{border-bottom:0}
.cs-pill{display:inline-block;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:600;background:var(--soft)}
.cs-pill.ok{background:#dff6e6;color:#14693a}.cs-pill.bad{background:#fde4e4;color:#a12020}.cs-pill.wait{background:#fff1d6;color:#8a5a00}
:root.dark .cs-pill.ok{background:#12351f;color:#7ee2a3}:root.dark .cs-pill.bad{background:#3d1818;color:#ff9b9b}:root.dark .cs-pill.wait{background:#3b2d0a;color:#f5c564}
.cs-note{padding:28px;text-align:center}
.cs input.cs-n{width:70px;border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:8px;padding:4px 8px;font-size:13px}
.cs-err{color:#c0392b;margin:10px 0}
.cs-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(420px,1fr));gap:14px}
@media (max-width:520px){.cs-cols{grid-template-columns:1fr}}
`;

const pill = (s: string) => <span className={`cs-pill ${['done', 'paid', 'delivered', 'ok'].includes(s) ? 'ok' : ['failed', 'cancelled'].includes(s) ? 'bad' : ['running', 'waiting', 'new', 'paid_claimed', 'making', 'queued'].includes(s) ? 'wait' : ''}`}>{s}</span>;

/** The one admin screen of the whole suite. Only an admin account sees anything here; the control comes from the server, not from this page. */
export default function Console() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
  });
  const [lang, setLang] = useState<'en' | 'zh'>(() => {
    try { return localStorage.getItem(LANG_KEY) === 'zh' ? 'zh' : 'en'; } catch { return 'en'; }
  });
  const [data, setData] = useState<Data | null>(() => {   // last look first, fresh numbers a moment later
    try { const c = token() ? localStorage.getItem('pe-admin-cache') : null; return c ? (JSON.parse(c) as Data) : null; } catch { return null; }
  });
  const [err, setErr] = useState('');
  const [status, setStatus] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState<Record<string, string>>({});
  type Proof = { id: string; username: string; created_at: string; role: string; school: string; status: string; link: string };
  const versions = useVersions();
  const releases = useReleases();
  const [range, setRange] = useState(14);
  const [group, setGroup] = useState<'day' | 'week'>('day');
  const [shown, setShown] = useState<Record<string, boolean>>({ signups: true, videos: true, checks: true, llm_tokens: true });
  const uP = usePage(data?.users ?? [], 10);
  const jP = usePage(data?.jobs ?? [], 10);
  const rP = usePage(data?.repro ?? [], 10);
  const oP = usePage(data?.orders ?? [], 10);
  const fP = usePage(data?.feedback ?? [], 10);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const loadProofs = useCallback(async () => {
    try { setProofs(((await call('explainer-admin', { method: 'POST', body: JSON.stringify({ op: 'verify_list' }) })) as { items: Proof[] }).items); } catch { /* shown as empty */ }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);
  useEffect(() => {
    try { localStorage.setItem(LANG_KEY, lang); } catch { /* ignore */ }
  }, [lang]);
  useEffect(() => {
    document.title = 'Admin · Paperlit';
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    setErr('');
    try {
      const d = (await call('suite-admin')) as Data;
      setData(d);
      setStatus(200);
      try { localStorage.setItem('pe-admin-cache', JSON.stringify(d)); } catch { /* full or private */ }
    } catch (e) {
      const st = (e as { status?: number }).status ?? 0;
      if (st === 401 || st === 403) { setData(null); try { localStorage.removeItem('pe-admin-cache'); } catch { /* ignore */ } }   // a network failure keeps the last look
      setStatus(st);
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    load();
    loadProofs();
    const on = () => { load(); loadProofs(); };
    window.addEventListener('suite-auth', on);
    return () => window.removeEventListener('suite-auth', on);
  }, [load]);

  const act = async (body: Record<string, unknown>) => {
    setErr('');
    try {
      await call('explainer-admin', { method: 'POST', body: JSON.stringify(body) });
      await load();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const labels = data?.perDay.map((d) => d.d.slice(5)) ?? [];
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <style>{css}</style>
      <SuiteTopBar appId="hub" brand="Paperlit" letter="R" homeTo="/" nav={[]} dark={theme === 'dark'} onToggleDark={() => setTheme(theme === 'dark' ? 'light' : 'dark')} lang={lang} onLang={(l) => setLang(l as 'en' | 'zh')} />
      <main className="cs">
        <div className="cs-head">
          <div>
            <h1>Admin</h1>
            <p className="sub">{data ? `Signed in as ${data.me}. Every app of the suite on one screen.` : 'Every app of the suite on one screen.'}</p>
          </div>
          <button type="button" className="cs-btn" onClick={load} disabled={busy}>{busy ? 'Loading…' : 'Refresh'}</button>
        </div>
        {err && !data && (
          <div className="cs-wrap cs-note" style={{ marginTop: 22 }}>
            <p style={{ margin: '0 0 12px' }}>{status === 401 ? 'Log in with an admin account to see this page.' : status === 403 ? 'This account is not an admin.' : err}</p>
            {status === 401 && <button type="button" className="cs-btn" onClick={() => window.dispatchEvent(new Event('suite-open-auth'))}>Log in</button>}
          </div>
        )}
        {err && data && <p className="cs-err" role="alert">{err}</p>}

        {data && (
          <>
            <div className="cs-tot">
              <div className="cs-tile"><span>Members</span><b>{data.totals.users}</b></div>
              <div className="cs-tile"><span>New this week</span><b>{data.totals.signups_7d}</b></div>
              <div className="cs-tile"><span>Credits held</span><b>{num(data.totals.credits)}</b></div>
              <div className="cs-tile"><span>Active plans</span><b>{(data as unknown as { active_plans?: number }).active_plans ?? 0}</b></div>
              <div className="cs-tile"><span>Banned</span><b>{data.totals.banned}</b></div>
            </div>

            {(() => {
              const fin = (data as unknown as { finance?: Money }).finance;
              const aud = (data as unknown as { audience?: Audience }).audience;
              const when = (data as unknown as { generated_at?: string }).generated_at;
              return (
                <>
                  {fin && (
                    <>
                      <h2>Money</h2>
                      <div className="cs-tot">
                        <div className="cs-tile"><span>Income, all time</span><b>{yuan(fin.income_total)}</b></div>
                        <div className="cs-tile"><span>Income this month</span><b>{yuan(fin.income_month)}</b></div>
                        <div className="cs-tile"><span>Cost, all time</span><b>{yuan(fin.cost_total)}</b></div>
                        <div className="cs-tile"><span>Cost this month</span><b>{yuan(fin.cost_month)}</b></div>
                        <div className="cs-tile"><span>Profit, all time</span><b style={{ color: fin.income_total - fin.cost_total >= 0 ? '#1a9a55' : '#d6453d' }}>{yuan(fin.income_total - fin.cost_total)}</b></div>
                        <div className="cs-tile"><span>Paid orders</span><b>{fin.orders_paid}</b></div>
                      </div>
                      <div className="cs-trends">
                        <Bars title="Income per day, 30 days" values={fin.days.map((x) => x.income)} labels={fin.days.map((x) => x.d.slice(5))} total={yuan(fin.income_30d)} tone="#1a9a55" />
                        <Bars title="Cost per day, 30 days" values={fin.days.map((x) => x.cost)} labels={fin.days.map((x) => x.d.slice(5))} total={yuan(fin.cost_30d)} tone="#d6453d" />
                      </div>
                      <p className="sub" style={{ margin: '8px 0 0' }}>Income is what you confirmed as paid, in yuan. Cost is the model and renderer estimate stored on each video (USD x {fin.usd_cny}). Server and domain fees are not counted.</p>
                      {fin.by_kind.length > 0 && (
                        <div className="cs-wrap" style={{ marginTop: 12 }}>
                          <table><thead><tr><th>What was bought</th><th>Orders</th><th>Income</th></tr></thead>
                            <tbody>{fin.by_kind.map((k) => <tr key={k.k}><td>{k.k.replace('_', ' ')}</td><td>{k.n}</td><td>{yuan(k.cny)}</td></tr>)}</tbody></table>
                        </div>
                      )}
                    </>
                  )}
                  {aud && (
                    <>
                      <h2>Who your members are ({aud.total} sign-ups)</h2>
                      <div className="cs-cols">
                        <TallyTable title="Country they chose" rows={aud.countries} name={countryName} />
                        <TallyTable title="Country from their connection" rows={aud.ip_countries} name={countryName} />
                      </div>
                      <div className="cs-cols" style={{ marginTop: 12 }}>
                        <TallyTable title="Preferred language" rows={aud.langs} />
                        <TallyTable title="Heard about us from" rows={aud.sources} />
                      </div>
                      <div style={{ marginTop: 12 }}><TallyTable title="I am a" rows={aud.roles} /></div>
                    </>
                  )}
                  <h2>Suite version {releases?.[0] ? `v${releases[0].v}` : ''}{releases?.[0] ? <small style={{ fontWeight: 400, marginLeft: 10 }} className="cs-dim">last release {fmt(releases[0].at)} ({ago(releases[0].at)})</small> : null}</h2>
                  <div className="cs-wrap" style={{ padding: '4px 0' }}>
                    {!releases ? <p className="cs-note sub">Loading…</p> : (
                      <ol className="cs-rel" style={{ padding: '10px 16px' }}>
                        {releases.map((r) => (
                          <li key={r.v}>
                            <div className="cs-rel-h"><span className="cs-vtag">v{r.v}</span><b>{r.title}</b><span className="cs-dim">{fmt(r.at)}</span></div>
                            <ul>{r.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>

                  <h2>Changes per app</h2>
                  <div className="cs-wrap">
                    {!versions ? <p className="cs-note sub">Loading versions…</p> : (
                      <div className="cs-vers">
                        {versions.map((v) => (
                          <details key={v.id} className="cs-ver">
                            <summary>
                              <b>{v.label}</b>
                              <span className="cs-vtag">{v.latest}</span>
                              <span className="cs-dim">updated {fmt(v.at)} ({ago(v.at)})</span>
                            </summary>
                            <ol className="cs-rel">
                              {v.list.map((r) => (
                                <li key={r.sha}>
                                  <div className="cs-rel-h"><span className="cs-dim">{fmt(r.at)}</span><a href={r.url} target="_blank" rel="noopener noreferrer" className="cs-dim">{r.sha}</a></div>
                                  <div>{r.title}</div>
                                  {r.bullets.length > 0 && <ul>{r.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
                                </li>
                              ))}
                            </ol>
                          </details>
                        ))}
                      </div>
                    )}
                  </div>
                  {when && <p className="sub" style={{ margin: '8px 0 0' }}>These numbers were read {fmt(when)} ({ago(when)}).</p>}
                </>
              );
            })()}

            <h2>Student and teacher proofs{proofs.some((x) => x.status === 'pending') ? ` (${proofs.filter((x) => x.status === 'pending').length} waiting)` : ''}</h2>
            <div className="cs-wrap">
              {proofs.length === 0 ? <p className="cs-note sub">No proofs sent yet.</p> : (
                <table>
                  <thead><tr><th>Email</th><th>Who</th><th>School</th><th>Sent</th><th>Proof</th><th>Status</th><th>Decision</th></tr></thead>
                  <tbody>
                    {proofs.map((x) => (
                      <tr key={x.id}>
                        <td>{x.username}</td><td>{x.role}</td><td>{x.school || <span className="cs-dim">none</span>}</td><td>{fmt(x.created_at)}</td>
                        <td>{x.link ? <a href={x.link} target="_blank" rel="noopener noreferrer">Open file</a> : <span className="cs-dim">missing</span>}</td>
                        <td>{x.status}</td>
                        <td>{x.status === 'pending' ? (
                          <>
                            <button type="button" className="cs-btn sm" onClick={async () => { await call('explainer-admin', { method: 'POST', body: JSON.stringify({ op: 'verify_decide', id: x.id, approve: true }) }).catch((e) => setErr(String(e.message))); loadProofs(); load(); }}>Approve 1 month</button>{' '}
                            <button type="button" className="cs-btn sm" onClick={async () => { await call('explainer-admin', { method: 'POST', body: JSON.stringify({ op: 'verify_decide', id: x.id, approve: false }) }).catch((e) => setErr(String(e.message))); loadProofs(); }}>Reject</button>
                          </>
                        ) : <span className="cs-dim">done</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <h2>Apps</h2>
            <div className="cs-apps">
              {data.apps.map((a) => (
                <section className="cs-app" key={a.id}>
                  <header>
                    <h3>{a.title}</h3>
                    <span>
                      <a href={`${ROOT}/${a.href}`}>Open</a>
                      {a.id === 'explainer' && <> · <a href={`${ROOT}/explainer/console`}>Detail console</a></>}
                    </span>
                  </header>
                  <dl>
                    {a.stats.map((s) => (
                      <div key={s.k} style={{ display: 'contents' }}>
                        <dt>{s.k}</dt>
                        <dd>{num(s.v)}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>

            <div className="cs-chart-h">
              <h2 style={{ margin: 0 }}>Trends</h2>
              <div className="cs-filters">
                {[7, 14, 30, 90].map((n) => <button key={n} type="button" className={`cs-chip${range === n ? ' on' : ''}`} onClick={() => setRange(n)}>{n} days</button>)}
                <span className="cs-sep" />
                {(['day', 'week'] as const).map((g) => <button key={g} type="button" className={`cs-chip${group === g ? ' on' : ''}`} onClick={() => setGroup(g)}>per {g}</button>)}
                <span className="cs-sep" />
                {([['signups', 'Sign-ups'], ['videos', 'Videos'], ['checks', 'Reproductions'], ['llm_tokens', 'Tokens']] as [string, string][]).map(([k, n]) => (
                  <label key={k} className="cs-chip chk"><input type="checkbox" checked={shown[k]} onChange={() => setShown({ ...shown, [k]: !shown[k] })} />{n}</label>
                ))}
              </div>
            </div>
            {(() => {
              const days = data.perDay.slice(-range);
              const size = group === 'week' ? 7 : 1;
              const buckets: { l: string; v: Day }[] = [];
              for (let i = 0; i < days.length; i += size) {
                const part = days.slice(i, i + size);
                buckets.push({ l: size === 1 ? part[0].d.slice(5) : `${part[0].d.slice(5)} to ${part[part.length - 1].d.slice(5)}`, v: part.reduce((m, d) => ({ d: m.d, signups: m.signups + d.signups, videos: m.videos + d.videos, checks: m.checks + d.checks, llm_tokens: m.llm_tokens + d.llm_tokens }), { d: part[0].d, signups: 0, videos: 0, checks: 0, llm_tokens: 0 }) });
              }
              const lbl = buckets.map((x) => x.l);
              const ser = (k: keyof Day) => buckets.map((x) => Number(x.v[k]));
              return (
                <div className="cs-trends">
                  {shown.signups && <Trend title="Sign-ups" values={ser('signups')} labels={lbl} />}
                  {shown.videos && <Trend title="Videos made" values={ser('videos')} labels={lbl} />}
                  {shown.checks && <Trend title="Reproductions started" values={ser('checks')} labels={lbl} />}
                  {shown.llm_tokens && <Trend title="Gateway tokens (kept 14 days)" values={ser('llm_tokens')} labels={lbl} />}
                </div>
              );
            })()}

            <h2>Members</h2>
            <div className="cs-wrap">
              <table>
                <thead><tr><th>Email</th><th>Plan</th><th>Credits</th><th>Videos</th><th>Joined</th><th>Last login</th><th>Actions</th></tr></thead>
                <tbody>
                  {uP.rows.map((u) => (
                    <tr key={u.id}>
                      <td>{u.username}{u.banned && <> {pill('banned')}</>}</td>
                      <td>{(() => {
                        if (!u.plan_until) return <span className="cs-dim">Free</span>;
                        const days = Math.ceil((new Date(u.plan_until).getTime() - Date.now()) / 86400000);
                        const label = u.plan ? u.plan[0].toUpperCase() + u.plan.slice(1) : 'Plan';
                        return days > 0
                          ? <span style={{ color: days <= 7 ? '#c0392b' : undefined }}>{label} · {days} day{days === 1 ? '' : 's'} left <small>(due {fmt(u.plan_until)})</small></span>
                          : <span className="cs-dim">{label} expired {fmt(u.plan_until)}</span>;
                      })()}</td>
                      <td>{u.credits}</td>
                      <td>{u.jobs}</td>
                      <td>{fmt(u.created_at)}</td>
                      <td>{fmt(u.last_login)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <input className="cs-n" type="number" placeholder="+10" aria-label={`Credits for ${u.username}`} value={amount[u.id] ?? ''} onChange={(e) => setAmount({ ...amount, [u.id]: e.target.value })} />{' '}
                        <button type="button" className="cs-btn sm" onClick={() => { const n = Number(amount[u.id]); if (n) { act({ op: 'grant', username: u.username, amount: n, reason: 'admin grant (suite console)' }); setAmount({ ...amount, [u.id]: '' }); } }}>Grant</button>{' '}
                        <button type="button" className="cs-btn sm" onClick={() => act({ op: 'ban', username: u.username, banned: !u.banned })}>{u.banned ? 'Unban' : 'Ban'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pager p={uP} />
            </div>

            <div className="cs-cols">
              <div>
                <h2>Recent videos</h2>
                <div className="cs-wrap">
                  <table>
                    <thead><tr><th>Paper</th><th>Status</th><th>Lang</th><th>Cost</th><th>When</th></tr></thead>
                    <tbody>
                      {jP.rows.map((j) => (
                        <tr key={j.id}>
                          <td>{j.title || j.arxiv}{j.error && <div className="sub" style={{ fontSize: 12 }}>{j.error}</div>}</td>
                          <td>{pill(j.status)}</td>
                          <td>{j.langs}</td>
                          <td>{j.cost_usd ? `$${Number(j.cost_usd).toFixed(3)}` : ''}</td>
                          <td>{fmt(j.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pager p={jP} />
                </div>
              </div>
              <div>
                <h2>Recent reproductions</h2>
                <div className="cs-wrap">
                  <table>
                    <thead><tr><th>Paper</th><th>Status</th><th>Verdict</th><th>When</th></tr></thead>
                    <tbody>
                      {rP.rows.map((r) => (
                        <tr key={r.id}>
                          <td>{r.title || r.arxiv_id}<div className="sub" style={{ fontSize: 12 }}>{[r.agent, r.model].filter(Boolean).join(' · ')}</div></td>
                          <td>{pill(r.status)}</td>
                          <td>{r.verdict}</td>
                          <td>{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pager p={rP} />
                </div>
              </div>
            </div>

            <div className="cs-cols">
              <div>
                <h2>Orders</h2>
                <div className="cs-wrap">
                  {data.orders.length === 0 ? <p className="cs-note sub">No orders.</p> : (
                    <table>
                      <thead><tr><th>Who</th><th>Order</th><th>Amount</th><th>Status</th><th>When</th><th>Decision</th></tr></thead>
                      <tbody>{oP.rows.map((o) => {
                        const n = o.notes ?? '';
                        const cur = /cur:([a-z]+)/.exec(n)?.[1] ?? 'cny';
                        const amt = Number(/amt:(\d+)/.exec(n)?.[1] ?? /price:(\d+)/.exec(n)?.[1] ?? 0);
                        const money = amt ? (cur === 'vnd' ? `${amt.toLocaleString('vi-VN')} VND` : cur === 'idr' ? `Rp ${amt.toLocaleString('id-ID')}` : `¥${amt}`) : '';
                        const open = o.status === 'new' || o.status === 'paid_claimed';
                        return (
                          <tr key={o.id}>
                            <td>{o.email}</td><td>{o.arxiv}<div className="sub" style={{ fontSize: 12 }}>{o.id.slice(0, 8)}{o.pay_method ? ` · ${o.pay_method}` : ''}</div></td>
                            <td>{money}</td><td>{pill(o.status)}</td><td>{fmt(o.created_at)}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{open ? (
                              <>
                                <button type="button" className="cs-btn sm" onClick={() => act({ op: 'order_status', id: o.id, status: 'paid' })}>Mark paid</button>{' '}
                                <button type="button" className="cs-btn sm" onClick={() => act({ op: 'order_status', id: o.id, status: 'cancelled' })}>Cancel</button>
                              </>
                            ) : <span className="cs-dim">{o.status}</span>}</td>
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  )}
                  <Pager p={oP} />
                </div>
              </div>
              <div>
                <h2>Feedback</h2>
                <div className="cs-wrap">
                  {data.feedback.length === 0 ? <p className="cs-note sub">No feedback yet.</p> : (
                    <table>
                      <thead><tr><th>Rating</th><th>Comment</th><th>When</th></tr></thead>
                      <tbody>{fP.rows.map((f) => <tr key={f.id}><td>{f.rating ?? ''}</td><td>{f.comment}<div className="sub" style={{ fontSize: 12 }}>{f.kind} {f.arxiv}</div></td><td>{fmt(f.created_at)}</td></tr>)}</tbody>
                    </table>
                  )}
                  <Pager p={fP} />
                </div>
              </div>
            </div>

            <div className="cs-cols">
              <div>
                <h2>Human-check requests</h2>
                <div className="cs-wrap">
                  {data.requests.length === 0 ? <p className="cs-note sub">No requests.</p> : (
                    <table>
                      <thead><tr><th>Request</th><th>When</th></tr></thead>
                      <tbody>{data.requests.map((r) => <tr key={r.id}><td>{String((r.data as { arxiv?: string; paper?: string; email?: string }).arxiv ?? (r.data as { paper?: string }).paper ?? '')} <span className="sub">{String((r.data as { email?: string }).email ?? '')}</span></td><td>{fmt(r.created_at)}</td></tr>)}</tbody>
                    </table>
                  )}
                </div>
              </div>
              <div>
                <h2>Boards and gateway</h2>
                <div className="cs-wrap">
                  <table>
                    <thead><tr><th>App</th><th>Calls 24h</th><th>Calls 7d</th><th>Tokens 7d</th><th>Visitors 7d</th></tr></thead>
                    <tbody>{data.llm.map((l) => <tr key={l.app}><td>{l.app}</td><td>{l.calls_24h}</td><td>{l.calls_7d}</td><td>{num(l.tokens_7d)}</td><td>{l.visitors_7d}</td></tr>)}</tbody>
                  </table>
                  {data.boards.length > 0 && <p className="sub" style={{ padding: '10px 14px', margin: 0 }}>Boards: {data.boards.map((b) => b.title || b.slug).join(', ')}</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
