'use client';
// components/Nav.js
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/',         label: 'Holonet',    icon: '⬡' },
  { href: '/gallery',  label: 'Archives',   icon: '◈' },
  { href: '/calendar', label: 'Chronology', icon: '◉' },
];

export default function Nav() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'linear-gradient(180deg,rgba(8,10,14,0.98) 0%,rgba(8,10,14,0.85) 100%)',
        borderBottom: '1px solid var(--imperial-border)',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <style>{`
          nav::after { content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
            background:linear-gradient(90deg,transparent,var(--imperial-glow),var(--imperial-red),var(--imperial-glow),transparent);opacity:0.6; }
          .nav-link { text-decoration:none; font-family:'Orbitron',sans-serif; font-size:0.65rem; letter-spacing:0.2em;
            color:var(--text-mid); padding:8px 16px; border:1px solid transparent; transition:all 0.2s; text-transform:uppercase; }
          .nav-link:hover,.nav-link.active { color:var(--imperial-bright); border-color:var(--imperial-border);
            background:rgba(30,144,255,0.05); text-shadow:0 0 8px var(--imperial-glow); }
          .logout-btn { font-family:'Orbitron',sans-serif; font-size:0.65rem; letter-spacing:0.2em;
            color:var(--text-dim); padding:8px 16px; border:1px solid transparent; transition:all 0.2s;
            text-transform:uppercase; background:transparent; cursor:pointer; }
          .logout-btn:hover { color:#ff6644; border-color:rgba(204,34,0,0.4); background:rgba(204,34,0,0.05); }
          .mobile-nav { display:none; }
          @media(max-width:680px) {
            nav { padding:0 16px; height:52px; justify-content:center; }
            .nav-logo-text { font-size:0.75rem !important; letter-spacing:0.1em !important; }
            .nav-logo-cog { width:24px !important; height:24px !important; }
            .desktop-links { display:none; }
            .mobile-nav { display:flex; position:fixed; bottom:0; left:0; right:0; z-index:1000;
              background:rgba(8,10,14,0.98); border-top:1px solid var(--imperial-border);
              height:56px; justify-content:space-around; align-items:center; }
            .mobile-nav-btn { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
              gap:3px; cursor:pointer; padding:8px 0; color:var(--text-dim); font-family:'Orbitron',sans-serif;
              font-size:0.42rem; letter-spacing:0.15em; text-transform:uppercase; text-decoration:none; height:100%; transition:color 0.2s; }
            .mobile-nav-btn.active { color:var(--imperial-bright); }
            .mobile-nav-btn .nav-icon,.mobile-logout .nav-icon { font-size:1.1rem; line-height:1; }
            .mobile-logout { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
              gap:3px; cursor:pointer; padding:8px 0; color:var(--text-dim); font-family:'Orbitron',sans-serif;
              font-size:0.42rem; letter-spacing:0.15em; text-transform:uppercase; height:100%;
              background:transparent; border:none; transition:color 0.2s; }
            .mobile-logout:hover { color:#ff6644; }
          }
        `}</style>

        <div style={{ fontFamily:'Orbitron,sans-serif', fontWeight:900, display:'flex', alignItems:'center', gap:12 }}>
          <svg className="nav-logo-cog" width="32" height="32" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="18" fill="none" stroke="#4db8ff" strokeWidth="2.5"/>
            <circle cx="50" cy="50" r="8" fill="#4db8ff" opacity="0.7"/>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#4db8ff" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.5"/>
            <g fill="#4db8ff" opacity="0.8">
              <polygon points="50,2 54,14 46,14"/><polygon points="50,98 54,86 46,86"/>
              <polygon points="2,50 14,54 14,46"/><polygon points="98,50 86,54 86,46"/>
              <polygon points="15,15 23,25 13,25"/><polygon points="85,15 87,27 77,25"/>
              <polygon points="15,85 23,75 13,75"/><polygon points="85,85 87,73 77,75"/>
            </g>
          </svg>
          <span className="nav-logo-text" style={{ fontFamily:'Orbitron,sans-serif', fontWeight:900, fontSize:'1.1rem', letterSpacing:'0.15em', color:'var(--imperial-white)', textTransform:'uppercase' }}>
            THE MALIN MADNESS
          </span>
        </div>

        <ul className="desktop-links" style={{ display:'flex', gap:8, listStyle:'none', alignItems:'center' }}>
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`nav-link${pathname === l.href ? ' active' : ''}`}>{l.label}</Link>
            </li>
          ))}
          <li><button className="logout-btn" onClick={handleLogout}>⏻ Logout</button></li>
        </ul>
      </nav>

      <nav className="mobile-nav">
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`mobile-nav-btn${pathname === l.href ? ' active' : ''}`}>
            <span className="nav-icon">{l.icon}</span>{l.label}
          </Link>
        ))}
        <button className="mobile-logout" onClick={handleLogout}>
          <span className="nav-icon">⏻</span>Logout
        </button>
      </nav>
    </>
  );
}
