'use client';
// app/login/page.js
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ImperialEmblem from '@/components/ImperialEmblem';
import Starfield from '@/components/Starfield';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get('from') || '/';

  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [dots,     setDots]     = useState('');

  // Animated "loading" dots
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(id);
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res  = await fetch('/api/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || 'ACCESS DENIED');
        setPassword('');
        setLoading(false);
      }
    } catch {
      setError('TRANSMISSION FAILURE — TRY AGAIN');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative', zIndex: 1,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');
        .login-box {
          border: 1px solid var(--imperial-border);
          background: var(--imperial-panel);
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          position: relative;
        }
        .login-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--imperial-glow), var(--imperial-red), var(--imperial-glow), transparent);
        }
        .login-box::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 14px; height: 14px;
          border-right: 2px solid var(--imperial-glow);
          border-bottom: 2px solid var(--imperial-glow);
        }
        .corner-tl {
          position: absolute;
          top: 0; left: 0;
          width: 14px; height: 14px;
          border-top: 2px solid var(--imperial-glow);
          border-left: 2px solid var(--imperial-glow);
        }
        .login-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          letter-spacing: 0.25em;
          color: var(--imperial-white);
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 6px;
        }
        .login-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: var(--text-dim);
          text-align: center;
          margin-bottom: 36px;
        }
        .login-label {
          display: block;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.35em;
          color: var(--imperial-glow);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .login-input {
          width: 100%;
          background: rgba(8,10,14,0.9);
          border: 1px solid var(--imperial-border);
          color: var(--imperial-white);
          padding: 14px 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          letter-spacing: 0.2em;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 24px;
        }
        .login-input:focus {
          border-color: var(--imperial-glow);
          box-shadow: 0 0 12px rgba(30,144,255,0.15);
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: rgba(30,144,255,0.08);
          border: 1px solid var(--imperial-glow);
          color: var(--imperial-bright);
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          background: rgba(30,144,255,0.18);
          box-shadow: 0 0 20px rgba(30,144,255,0.2);
        }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-error {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          color: var(--imperial-red-glow);
          letter-spacing: 0.15em;
          text-align: center;
          margin-top: 16px;
          padding: 10px;
          border: 1px solid rgba(204,34,0,0.3);
          background: rgba(204,34,0,0.08);
          animation: flicker 0.15s 2;
        }
        @keyframes flicker {
          0%,100% { opacity:1; } 50% { opacity:0.5; }
        }
        .emblem-wrap {
          margin-bottom: 28px;
          display: flex;
          justify-content: center;
          animation: emblem-pulse 4s ease-in-out infinite;
        }
        .scan-line {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: var(--text-dim);
          letter-spacing: 0.15em;
          text-align: center;
          margin-top: 28px;
          line-height: 1.8;
          opacity: 0.6;
        }
        @media(max-width:480px) {
          .login-box { padding: 36px 24px; }
        }
      `}</style>

      <div className="login-box">
        <div className="corner-tl" />

        <div className="emblem-wrap">
          <ImperialEmblem size={80} />
        </div>

        <div className="login-title">The Malin Madness</div>
        <div className="login-sub">// IMPERIAL FAMILY ACCESS ONLY //</div>

        <form onSubmit={handleSubmit}>
          <label className="login-label" htmlFor="password">
            Authorization Code
          </label>
          <input
            id="password"
            type="password"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter family password"
            autoComplete="current-password"
            autoFocus
            disabled={loading}
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? `Authenticating${dots}` : '⬡ Transmit Credentials'}
          </button>
        </form>

        {error && <div className="login-error">⚠ {error}</div>}

        <div className="scan-line">
          &gt; UNAUTHORIZED ACCESS IS PROHIBITED<br />
          &gt; ALL ATTEMPTS ARE LOGGED
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Starfield />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
