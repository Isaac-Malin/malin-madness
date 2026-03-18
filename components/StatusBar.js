'use client';
// components/StatusBar.js
import { useEffect, useState } from 'react';

export default function StatusBar({ fileCount = 0, eventCount = 0 }) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleDateString('en-US', {
        weekday:'short', year:'numeric', month:'short', day:'numeric',
      }).toUpperCase();
    setDateStr(fmt());
    const id = setInterval(() => setDateStr(fmt()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0,
      background:'rgba(8,10,14,0.95)', borderTop:'1px solid var(--imperial-border)',
      padding:'6px 40px', display:'flex', alignItems:'center', gap:24, zIndex:900,
    }}>
      <style>{`
        .status-item{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:var(--text-dim);letter-spacing:0.1em;display:flex;align-items:center;gap:6px;}
        .status-dot{width:6px;height:6px;border-radius:50%;background:var(--imperial-glow);box-shadow:0 0 6px var(--imperial-glow);animation:blink 2s infinite;}
        @media(max-width:680px){
          .status-bar-root{bottom:56px!important;padding:4px 12px!important;gap:10px!important;}
          .status-item{font-size:0.55rem;}
          .status-date{display:none!important;}
        }
      `}</style>
      <div className="status-item"><div className="status-dot"/> NETWORK SECURE</div>
      <div className="status-item">FILES: {fileCount}</div>
      <div className="status-item">EVENTS: {eventCount}</div>
      <div className="status-item status-date" style={{ marginLeft:'auto' }}>{dateStr}</div>
    </div>
  );
}
