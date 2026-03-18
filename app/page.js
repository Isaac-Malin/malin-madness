// app/page.js
import Link from 'next/link';
import Nav from '@/components/Nav';
import Starfield from '@/components/Starfield';
import ImperialEmblem from '@/components/ImperialEmblem';
import { sql } from '@/lib/db';

async function getCounts() {
  try {
    const [{ rows: m }, { rows: e }] = await Promise.all([
      sql`SELECT COUNT(*) FROM media;`,
      sql`SELECT COUNT(*) FROM events;`,
    ]);
    return { files: Number(m[0].count), events: Number(e[0].count) };
  } catch {
    return { files: 0, events: 0 };
  }
}

export default async function HomePage() {
  const { files, events } = await getCounts();

  return (
    <>
      <Starfield />
      <Nav />

      <style>{`
        /* ── Hero ── */
        .home-wrap {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 120px 24px 120px;
          text-align: center;
        }

        .emblem-wrap {
          margin-bottom: 52px;
          animation: emblem-pulse 4s ease-in-out infinite;
        }

        .hero-eyebrow {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.55em;
          color: var(--imperial-glow);
          text-transform: uppercase;
          opacity: 0.7;
          margin-bottom: 20px;
        }

        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 8vw, 6.5rem);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--imperial-white);
          line-height: 1.05;
          text-shadow:
            0 0 40px rgba(30,144,255,0.45),
            0 0 80px rgba(30,144,255,0.15);
          margin-bottom: 0;
        }

        .hero-title-accent {
          display: block;
          color: var(--imperial-bright);
          text-shadow:
            0 0 30px rgba(77,184,255,0.7),
            0 0 60px rgba(77,184,255,0.3);
        }

        .hero-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 300;
          letter-spacing: 0.35em;
          color: var(--text-mid);
          text-transform: uppercase;
          margin-top: 28px;
          margin-bottom: 0;
        }

        /* ── Divider ── */
        .hero-divider {
          display: flex;
          align-items: center;
          gap: 20px;
          margin: 60px 0;
          width: 100%;
          max-width: 560px;
        }
        .hero-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--imperial-border));
        }
        .hero-divider-line.right {
          background: linear-gradient(90deg, var(--imperial-border), transparent);
        }
        .hero-divider-dot {
          width: 6px; height: 6px;
          border: 1px solid var(--imperial-glow);
          transform: rotate(45deg);
          box-shadow: 0 0 8px rgba(30,144,255,0.5);
        }

        /* ── Nav Cards ── */
        .nav-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 820px;
          width: 100%;
        }

        .nav-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 44px 28px 36px;
          background: rgba(17,24,32,0.7);
          border: 1px solid var(--imperial-border);
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
          overflow: hidden;
          backdrop-filter: blur(8px);
          cursor: pointer;
        }

        /* top accent bar */
        .nav-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--imperial-glow), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        /* hover glow layer */
        .nav-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(30,144,255,0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.35s;
        }

        .nav-card:hover {
          border-color: rgba(77,184,255,0.45);
          transform: translateY(-6px);
          box-shadow:
            0 20px 60px rgba(8,10,14,0.6),
            0 0 30px rgba(30,144,255,0.1);
        }
        .nav-card:hover::before { opacity: 1; }
        .nav-card:hover::after  { opacity: 1; }

        .nav-card:hover .card-icon-wrap {
          box-shadow: 0 0 28px rgba(30,144,255,0.35);
          border-color: rgba(77,184,255,0.5);
        }
        .nav-card:hover .card-arrow { opacity: 1; transform: translateX(0); }

        /* icon ring */
        .card-icon-wrap {
          width: 72px; height: 72px;
          border: 1px solid var(--imperial-border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 28px;
          background: rgba(30,144,255,0.05);
          transition: all 0.3s;
          position: relative; z-index: 1;
        }
        .card-icon { font-size: 1.8rem; line-height: 1; }

        .card-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.35em;
          color: var(--imperial-white);
          text-transform: uppercase;
          margin-bottom: 10px;
          position: relative; z-index: 1;
        }

        .card-desc {
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--text-dim);
          letter-spacing: 0.05em;
          line-height: 1.5;
          position: relative; z-index: 1;
        }

        .card-arrow {
          margin-top: 24px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: var(--imperial-glow);
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.3s;
          position: relative; z-index: 1;
        }

        /* stat badge on the status card */
        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 6px 14px;
          border: 1px solid rgba(30,144,255,0.2);
          background: rgba(30,144,255,0.05);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: var(--text-mid);
          letter-spacing: 0.1em;
          position: relative; z-index: 1;
        }
        .stat-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--imperial-glow);
          box-shadow: 0 0 6px var(--imperial-glow);
          animation: blink 2s infinite;
        }

        /* ── Footer terminal ── */
        .home-terminal {
          margin-top: 72px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: var(--text-dim);
          letter-spacing: 0.18em;
          line-height: 2.2;
          opacity: 0.5;
        }
        .home-terminal span { color: var(--imperial-glow); opacity: 0.8; margin-right: 8px; }

        /* ── Status bar ── */
        .sbar {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: rgba(8,10,14,0.96);
          border-top: 1px solid var(--imperial-border);
          padding: 7px 48px;
          display: flex; align-items: center; gap: 28px;
          z-index: 900;
          backdrop-filter: blur(10px);
        }
        .si {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem; color: var(--text-dim);
          letter-spacing: 0.12em;
          display: flex; align-items: center; gap: 7px;
        }
        .sd {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--imperial-glow);
          box-shadow: 0 0 6px var(--imperial-glow);
          animation: blink 2s infinite;
        }
        .sbar-right { margin-left: auto; opacity: 0.4; }

        /* ── Mobile ── */
        @media(max-width:720px) {
          .home-wrap { padding: 100px 20px 100px; }
          .nav-cards { grid-template-columns: 1fr; gap: 14px; max-width: 400px; }
          .nav-card { padding: 32px 24px 28px; flex-direction: row; text-align: left; gap: 20px; }
          .card-icon-wrap { width: 52px; height: 52px; flex-shrink: 0; margin-bottom: 0; }
          .card-icon { font-size: 1.3rem; }
          .card-arrow { margin-top: 6px; }
          .hero-divider { margin: 44px 0; }
          .sbar { bottom: 56px; padding: 5px 16px; gap: 14px; }
          .si { font-size: 0.55rem; }
          .sbar-right { display: none; }
        }
      `}</style>

      <main className="home-wrap">
        <div className="emblem-wrap">
          <ImperialEmblem size={140} />
        </div>

        <p className="hero-eyebrow">Imperial Family Databank</p>

        <h1 className="hero-title">
          The Malin
          <span className="hero-title-accent">Madness</span>
        </h1>

        <p className="hero-sub">Est. 2025 &nbsp;·&nbsp; Authorized Access Only</p>

        {/* Divider */}
        <div className="hero-divider">
          <div className="hero-divider-line" />
          <div className="hero-divider-dot" />
          <div className="hero-divider-dot" style={{ width:4, height:4 }} />
          <div className="hero-divider-dot" />
          <div className="hero-divider-line right" />
        </div>

        {/* Nav cards */}
        <div className="nav-cards">
          <Link href="/gallery" className="nav-card">
            <div className="card-icon-wrap">
              <span className="card-icon">⬡</span>
            </div>
            <span className="card-label">Archives</span>
            <span className="card-desc">Upload and browse family photos &amp; videos</span>
            <span className="card-arrow">ENTER ▸</span>
          </Link>

          <Link href="/calendar" className="nav-card">
            <div className="card-icon-wrap">
              <span className="card-icon">◈</span>
            </div>
            <span className="card-label">Chronology</span>
            <span className="card-desc">Track birthdays, gatherings &amp; family trips</span>
            <span className="card-arrow">ENTER ▸</span>
          </Link>

          <div className="nav-card" style={{ cursor:'default' }}>
            <div className="card-icon-wrap">
              <span className="card-icon">◉</span>
            </div>
            <span className="card-label">Status</span>
            <span className="card-desc">Live databank telemetry</span>
            <div className="stat-badge">
              <span className="stat-dot" />
              {files} Files &nbsp;·&nbsp; {events} Events
            </div>
          </div>
        </div>

        {/* Terminal footer */}
        <div className="home-terminal">
          <div><span>&gt;</span>IMPERIAL FAMILY NETWORK — AUTHORIZED ACCESS ONLY</div>
          <div><span>&gt;</span>ALL TRANSMISSIONS ENCRYPTED AND ARCHIVED</div>
          <div><span>&gt;</span>LONG LIVE THE MALIN MADNESS</div>
        </div>
      </main>

      {/* Status bar */}
      <div className="sbar">
        <span className="si"><span className="sd" />NETWORK SECURE</span>
        <span className="si">FILES: {files}</span>
        <span className="si">EVENTS: {events}</span>
        <span className="si sbar-right">THE MALIN MADNESS — IMPERIAL FAMILY DATABANK</span>
      </div>
    </>
  );
}
