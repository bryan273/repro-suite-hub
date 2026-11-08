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
type Order = { id: string; email: string; arxiv: string; status: string; pay_method: string | null; created_at: string };
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
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState('');
  const [status, setStatus] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState<Record<string, string>>({});

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
      setData(await call('suite-admin'));
      setStatus(200);
    } catch (e) {
      setData(null);
      setStatus((e as { status?: number }).status ?? 0);
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    load();
    const on = () => load();
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

            <h2>Last 14 days</h2>
            <div className="cs-trends">
              <Trend title="Sign-ups" values={data.perDay.map((d) => d.signups)} labels={labels} />
              <Trend title="Videos made" values={data.perDay.map((d) => d.videos)} labels={labels} />
              <Trend title="Reproductions started" values={data.perDay.map((d) => d.checks)} labels={labels} />
              <Trend title="Gateway tokens" values={data.perDay.map((d) => d.llm_tokens)} labels={labels} />
            </div>

            <h2>Members</h2>
            <div className="cs-wrap">
              <table>
                <thead><tr><th>Email</th><th>Plan</th><th>Credits</th><th>Videos</th><th>Joined</th><th>Last login</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.users.map((u) => (
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
            </div>

            <div className="cs-cols">
              <div>
                <h2>Recent videos</h2>
                <div className="cs-wrap">
                  <table>
                    <thead><tr><th>Paper</th><th>Status</th><th>Lang</th><th>Cost</th><th>When</th></tr></thead>
                    <tbody>
                      {data.jobs.map((j) => (
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
                </div>
              </div>
              <div>
                <h2>Recent reproductions</h2>
                <div className="cs-wrap">
                  <table>
                    <thead><tr><th>Paper</th><th>Status</th><th>Verdict</th><th>When</th></tr></thead>
                    <tbody>
                      {data.repro.map((r) => (
                        <tr key={r.id}>
                          <td>{r.title || r.arxiv_id}<div className="sub" style={{ fontSize: 12 }}>{[r.agent, r.model].filter(Boolean).join(' · ')}</div></td>
                          <td>{pill(r.status)}</td>
                          <td>{r.verdict}</td>
                          <td>{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="cs-cols">
              <div>
                <h2>Orders</h2>
                <div className="cs-wrap">
                  {data.orders.length === 0 ? <p className="cs-note sub">No orders.</p> : (
                    <table>
                      <thead><tr><th>Email</th><th>Paper</th><th>Status</th><th>When</th></tr></thead>
                      <tbody>{data.orders.map((o) => <tr key={o.id}><td>{o.email}</td><td>{o.arxiv}</td><td>{pill(o.status)}</td><td>{fmt(o.created_at)}</td></tr>)}</tbody>
                    </table>
                  )}
                </div>
              </div>
              <div>
                <h2>Feedback</h2>
                <div className="cs-wrap">
                  {data.feedback.length === 0 ? <p className="cs-note sub">No feedback yet.</p> : (
                    <table>
                      <thead><tr><th>Rating</th><th>Comment</th><th>When</th></tr></thead>
                      <tbody>{data.feedback.map((f) => <tr key={f.id}><td>{f.rating ?? ''}</td><td>{f.comment}<div className="sub" style={{ fontSize: 12 }}>{f.kind} {f.arxiv}</div></td><td>{fmt(f.created_at)}</td></tr>)}</tbody>
                    </table>
                  )}
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
