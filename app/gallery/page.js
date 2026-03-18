'use client';
// app/gallery/page.js
import { useState, useEffect, useRef, useCallback } from 'react';
import Nav from '@/components/Nav';
import Starfield from '@/components/Starfield';

export default function GalleryPage() {
  const [media, setMedia]         = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState('');
  const [dragOver, setDragOver]   = useState(false);
  const [lightbox, setLightbox]   = useState(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [autoplay, setAutoplay]   = useState(false);
  const autoRef = useRef(null);
  const fileRef = useRef(null);

  const fetchMedia = useCallback(async () => {
    const res = await fetch('/api/media');
    const data = await res.json();
    setMedia(data.media || []);
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  // Autoplay
  useEffect(() => {
    if (autoplay && media.length > 0) {
      autoRef.current = setInterval(() => {
        setCarouselIdx(i => (i + 1) % media.length);
      }, 3000);
    } else {
      clearInterval(autoRef.current);
    }
    return () => clearInterval(autoRef.current);
  }, [autoplay, media.length]);

  async function uploadFiles(files) {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      setProgress(`Uploading ${i + 1} of ${files.length}…`);
      const fd = new FormData();
      fd.append('file', files[i]);
      await fetch('/api/media', { method: 'POST', body: fd });
    }
    setProgress('');
    setUploading(false);
    fetchMedia();
  }

  async function deleteMedia(id) {
    await fetch(`/api/media/${id}`, { method: 'DELETE' });
    setMedia(m => m.filter(x => x.id !== id));
  }

  function slide(dir) {
    setCarouselIdx(i => {
      const max = Math.max(0, media.length - 1);
      return Math.max(0, Math.min(i + dir, max));
    });
  }

  const itemW = 296;

  return (
    <>
      <Starfield />
      <Nav />
      <main style={{ position:'relative', zIndex:1, paddingTop:80, paddingBottom:80 }}>
        <style>{`
          .sec { max-width:900px; margin:0 auto; padding:20px 40px 40px; }
          .sec-hdr { font-family:'Orbitron',sans-serif; font-size:0.65rem; letter-spacing:0.4em; color:var(--imperial-glow); text-transform:uppercase; margin-bottom:6px; opacity:0.7; }
          .sec-title { font-family:'Orbitron',sans-serif; font-weight:700; font-size:clamp(1.2rem,3vw,2rem); letter-spacing:0.15em; color:var(--imperial-white); text-transform:uppercase; text-shadow:0 0 20px rgba(30,144,255,0.4); }
          .upload-zone { border:1px solid var(--imperial-border); background:rgba(13,17,23,0.8); padding:60px 40px; text-align:center; cursor:pointer; transition:all 0.3s; position:relative; overflow:hidden; margin:32px 0; }
          .upload-zone:hover,.upload-zone.drag { border-color:var(--imperial-glow); background:rgba(30,144,255,0.04); box-shadow:0 0 30px rgba(30,144,255,0.1); }
          .upload-zone.drag { box-shadow:0 0 40px rgba(30,144,255,0.2); }
          .u-icon { font-size:3rem; margin-bottom:16px; opacity:0.6; }
          .u-text { font-family:'Orbitron',sans-serif; font-size:0.75rem; letter-spacing:0.3em; color:var(--text-mid); text-transform:uppercase; margin-bottom:8px; }
          .u-sub { font-size:0.85rem; color:var(--text-dim); font-family:'Share Tech Mono',monospace; }
          .spinner { display:inline-block; width:20px; height:20px; border:2px solid var(--imperial-border); border-top-color:var(--imperial-glow); border-radius:50%; animation:spin 0.8s linear infinite; margin-right:10px; vertical-align:middle; }
          /* Carousel */
          .car-wrap { max-width:1100px; margin:0 auto; padding:0 40px 60px; }
          .car-box { border:1px solid var(--imperial-border); background:var(--imperial-panel); overflow:hidden; position:relative; margin-top:32px; }
          .car-box::before,.car-box::after { content:''; position:absolute; top:0; bottom:0; width:80px; z-index:2; pointer-events:none; }
          .car-box::before { left:0; background:linear-gradient(90deg,var(--imperial-panel),transparent); }
          .car-box::after  { right:0; background:linear-gradient(-90deg,var(--imperial-panel),transparent); }
          .car-track-wrap { overflow:hidden; padding:20px 0; }
          .car-track { display:flex; gap:16px; padding:0 20px; transition:transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94); }
          .car-item { flex-shrink:0; width:280px; height:200px; border:1px solid var(--imperial-border); overflow:hidden; position:relative; cursor:pointer; transition:all 0.3s; }
          .car-item:hover { border-color:var(--imperial-glow); box-shadow:0 0 20px rgba(30,144,255,0.2); transform:scale(1.02); }
          .car-item img,.car-item video { width:100%; height:100%; object-fit:cover; }
          .car-label { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent,rgba(8,10,14,0.9)); padding:20px 10px 8px; font-family:'Share Tech Mono',monospace; font-size:0.7rem; color:var(--text-mid); }
          .car-del { position:absolute; top:6px; right:6px; background:rgba(204,34,0,0.8); border:1px solid #ff3300; color:white; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:0.7rem; cursor:pointer; opacity:0; transition:opacity 0.2s; }
          .car-item:hover .car-del { opacity:1; }
          .car-nav { display:flex; justify-content:center; gap:12px; padding:16px; border-top:1px solid var(--imperial-border); }
          .car-btn { background:transparent; border:1px solid var(--imperial-border); color:var(--text-mid); padding:8px 20px; font-family:'Orbitron',sans-serif; font-size:0.6rem; letter-spacing:0.2em; cursor:pointer; text-transform:uppercase; transition:all 0.2s; }
          .car-btn:hover { border-color:var(--imperial-glow); color:var(--imperial-bright); background:rgba(30,144,255,0.05); }
          .car-btn.on { border-color:var(--imperial-glow); color:var(--imperial-bright); }
          .empty-car { display:flex; flex-direction:column; align-items:center; justify-content:center; height:200px; color:var(--text-dim); font-family:'Share Tech Mono',monospace; font-size:0.8rem; letter-spacing:0.2em; gap:12px; }
          /* Lightbox */
          .lb { display:none; position:fixed; inset:0; background:rgba(8,10,14,0.95); z-index:2000; align-items:center; justify-content:center; flex-direction:column; }
          .lb.open { display:flex; }
          .lb img,.lb video { max-width:90vw; max-height:80vh; border:1px solid var(--imperial-border); box-shadow:0 0 60px rgba(30,144,255,0.2); }
          .lb-close { position:absolute; top:20px; right:30px; font-family:'Orbitron',sans-serif; font-size:0.7rem; letter-spacing:0.3em; color:var(--text-mid); cursor:pointer; background:transparent; border:1px solid var(--imperial-border); padding:8px 16px; transition:all 0.2s; }
          .lb-close:hover { color:#ff3300; border-color:#cc2200; }
          /* Status bar */
          .sbar { position:fixed; bottom:0; left:0; right:0; background:rgba(8,10,14,0.95); border-top:1px solid var(--imperial-border); padding:6px 40px; display:flex; align-items:center; gap:24px; z-index:900; }
          .si { font-family:'Share Tech Mono',monospace; font-size:0.65rem; color:var(--text-dim); letter-spacing:0.1em; display:flex; align-items:center; gap:6px; }
          .sd { width:6px; height:6px; border-radius:50%; background:var(--imperial-glow); box-shadow:0 0 6px var(--imperial-glow); animation:blink 2s infinite; }
          @media(max-width:680px) {
            .sec { padding:12px 16px 24px; }
            .car-wrap { padding:0 16px 60px; }
            .car-item { width:calc(100vw - 64px); height:220px; }
            .car-del { opacity:1; }
            .car-btn { padding:8px 12px; font-size:0.55rem; }
            .sbar { bottom:56px; padding:4px 12px; gap:10px; }
            .si { font-size:0.55rem; }
          }
        `}</style>

        {/* Upload Section */}
        <div className="sec">
          <div className="sec-hdr">Imperial Archives</div>
          <div className="sec-title">Photo &amp; Video Uplink</div>
          <div
            className={`upload-zone${dragOver ? ' drag' : ''}`}
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
          >
            {uploading ? (
              <>
                <div className="u-icon"><span className="spinner"/>⬡</div>
                <div className="u-text">{progress}</div>
              </>
            ) : (
              <>
                <div className="u-icon">⬡</div>
                <div className="u-text">Transmit Files to the Archive</div>
                <div className="u-sub">Drop images or videos here — or click to select</div>
                <div className="u-sub" style={{ marginTop:6, opacity:0.5 }}>JPG · PNG · GIF · MP4 · MOV · WEBM</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display:'none' }}
            onChange={e => uploadFiles(e.target.files)} />
        </div>

        {/* Carousel */}
        <div className="car-wrap">
          <div className="sec-hdr">Holographic Display</div>
          <div className="sec-title">The Archive Carousel</div>
          <div className="car-box">
            <div className="car-track-wrap">
              <div className="car-track" style={{ transform:`translateX(-${carouselIdx * itemW}px)` }}>
                {media.length === 0 ? (
                  <div className="empty-car">
                    <span style={{ opacity:0.4, fontSize:'2rem' }}>◌</span>
                    <span>// NO FILES ARCHIVED — UPLOAD TO BEGIN //</span>
                  </div>
                ) : media.map(m => (
                  <div key={m.id} className="car-item" onClick={() => setLightbox(m)}>
                    {m.media_type === 'video'
                      ? <video src={m.url} muted loop playsInline poster={m.thumb_url} />
                      : <img src={m.thumb_url || m.url} alt={m.name} loading="lazy" />
                    }
                    <div className="car-label">{m.name}</div>
                    <button className="car-del" onClick={e => { e.stopPropagation(); deleteMedia(m.id); }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="car-nav">
              <button className="car-btn" onClick={() => slide(-1)}>◂ Previous</button>
              <button className={`car-btn${autoplay ? ' on' : ''}`} onClick={() => setAutoplay(a => !a)}>
                {autoplay ? '⏸ Pause' : '⏵ Autoplay'}
              </button>
              <button className="car-btn" onClick={() => slide(1)}>Next ▸</button>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      <div className={`lb${lightbox ? ' open' : ''}`} onClick={() => setLightbox(null)}>
        <button className="lb-close" onClick={() => setLightbox(null)}>✕ CLOSE</button>
        {lightbox && (lightbox.media_type === 'video'
          ? <video src={lightbox.url} controls autoPlay onClick={e => e.stopPropagation()} />
          : <img src={lightbox.url} alt={lightbox.name} onClick={e => e.stopPropagation()} />
        )}
      </div>

      {/* Status bar */}
      <div className="sbar">
        <span className="si"><span className="sd"/>NETWORK SECURE</span>
        <span className="si">FILES: {media.length}</span>
      </div>
    </>
  );
}
