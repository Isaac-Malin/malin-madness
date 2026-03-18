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
      <main style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'80px 20px 80px', textAlign:'center' }}>
        <style>{`
          .hero-title{font-family:'Orbitron',sans-serif;font-weight:900;font-size:clamp(2rem,6vw,4.5rem);
            letter-spacing:0.25em;text-transform:uppercase;color:var(--imperial-white);line-height:1;
            text-shadow:0 0 30px rgba(30,144,255,0.5),0 0 60px rgba(30,144,255,0.2);margin-bottom:8px;}
          .hero-sub{font-family:'Orbitron',sans-serif;font-size:clamp(0.6rem,1.5vw,0.85rem);letter-spacing:0.5em;
            color:var(--imperial-glow);text-transform:uppercase;margin-bottom:48px;opacity:0.8;}
          .emblem-wrap{margin-bottom:32px;animation:emblem-pulse 4s ease-in-out infinite;}
          .hero-divider{width:300px;height:1px;background:linear-gradient(90deg,transparent,var(--imperial-glow),transparent);margin:0 auto 48px;}
          .home-panels{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;max-width:600px;width:100%;}
          .home-panel{border:1px solid var(--imperial-border);background:var(--imperial-panel);padding:32px 20px;
            text-align:center;cursor:pointer;transition:all 0.2s;text-decoration:none;display:block;position:relative;}
          .home-panel::before,.home-panel::after{content:'';position:absolute;width:12px;height:12px;border-color:var(--imperial-glow);border-style:solid;}
          .home-panel::before{top:-1px;left:-1px;border-width:2px 0 0 2px;}
          .home-panel::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
          .home-panel:hover{border-color:var(--imperial-glow);background:rgba(30,144,255,0.05);box-shadow:0 0 20px rgba(30,144,255,0.1);}
          .panel-icon{font-size:1.8rem;margin-bottom:8px;}
          .panel-label{font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.3em;color:var(--imperial-glow);text-transform:uppercase;}
          .panel-sub{font-size:0.8rem;color:var(--text-dim);margin-top:4px;font-family:'Rajdhani',sans-serif;}
          .terminal{margin-top:40px;font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:var(--text-dim);letter-spacing:0.15em;line-height:2;}
          @media(max-width:680px){
            .home-panels{grid-template-columns:1fr;max-width:100%;}
            .hero-divider{width:180px;}
          }
        `}</style>

        <div className="emblem-wrap"><ImperialEmblem size={120} /></div>
        <h1 className="hero-title">THE MALIN<br/>MADNESS</h1>
        <p className="hero-sub">Imperial Family Databank &nbsp;·&nbsp; Est. 2025</p>
        <div className="hero-divider" />

        <div className="home-panels">
          <Link href="/gallery" className="home-panel">
            <div className="panel-icon">⬡</div>
            <div className="panel-label">Archives</div>
            <div className="panel-sub">Photos &amp; Videos</div>
          </Link>
          <Link href="/calendar" className="home-panel">
            <div className="panel-icon">◈</div>
            <div className="panel-label">Chronology</div>
            <div className="panel-sub">Family Calendar</div>
          </Link>
          <div className="home-panel" style={{ cursor:'default' }}>
            <div className="panel-icon">◉</div>
            <div className="panel-label">Status</div>
            <div className="panel-sub">{files} Files · {events} Events</div>
          </div>
        </div>

        <div className="terminal">
          &gt; IMPERIAL FAMILY NETWORK — AUTHORIZED ACCESS ONLY<br/>
          &gt; ALL TRANSMISSIONS ENCRYPTED AND ARCHIVED<br/>
          &gt; LONG LIVE THE MALIN MADNESS
        </div>
      </main>

      {/* Status bar */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'rgba(8,10,14,0.95)',
        borderTop:'1px solid var(--imperial-border)', padding:'6px 40px', display:'flex',
        alignItems:'center', gap:24, zIndex:900 }}>
        <style>{`.sd{width:6px;height:6px;border-radius:50%;background:var(--imperial-glow);box-shadow:0 0 6px var(--imperial-glow);animation:blink 2s infinite;}
          .si{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:var(--text-dim);letter-spacing:0.1em;display:flex;align-items:center;gap:6px;}
          @media(max-width:680px){.status-root{bottom:56px!important;padding:4px 12px!important;}}`}
        </style>
        <span className="si"><span className="sd"/>NETWORK SECURE</span>
        <span className="si">FILES: {files}</span>
        <span className="si">EVENTS: {events}</span>
      </div>
    </>
  );
}
