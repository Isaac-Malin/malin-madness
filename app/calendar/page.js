'use client';
// app/calendar/page.js
import { useState, useEffect, useCallback } from 'react';
import Nav from '@/components/Nav';
import Starfield from '@/components/Starfield';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EMPTY_FORM = { title:'', event_date:'', type:'birthday', notes:'' };

export default function CalendarPage() {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [events, setEvents] = useState([]);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    const res  = await fetch(`/api/events?year=${year}&month=${month + 1}`);
    const data = await res.json();
    setEvents(data.events || []);
  }, [year, month]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  function changeMonth(dir) {
    setMonth(m => {
      let nm = m + dir;
      if (nm > 11) { setYear(y => y + 1); return 0; }
      if (nm <  0) { setYear(y => y - 1); return 11; }
      return nm;
    });
  }

  function openAdd(dateStr) {
    setEditId(null);
    setForm({ ...EMPTY_FORM, event_date: dateStr });
    setModal(true);
  }

  function openEdit(ev) {
    setEditId(ev.id);
    setForm({
      title:      ev.title,
      event_date: ev.event_date.slice(0, 10),
      type:       ev.type,
      notes:      ev.notes || '',
    });
    setModal(true);
  }

  async function saveEvent() {
    if (!form.title.trim() || !form.event_date) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/events/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setModal(false);
    fetchEvents();
  }

  async function deleteEvent() {
    if (!editId) return;
    setSaving(true);
    await fetch(`/api/events/${editId}`, { method: 'DELETE' });
    setSaving(false);
    setModal(false);
    fetchEvents();
  }

  // Build calendar grid
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();
  const totalCells   = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    let day, mo, yr, other = false;
    if (i < firstDay) {
      day = daysInPrev - firstDay + i + 1; mo = month - 1; yr = year;
      if (mo < 0) { mo = 11; yr--; }
      other = true;
    } else if (i >= firstDay + daysInMonth) {
      day = i - firstDay - daysInMonth + 1; mo = month + 1; yr = year;
      if (mo > 11) { mo = 0; yr++; }
      other = true;
    } else {
      day = i - firstDay + 1; mo = month; yr = year;
    }
    const dateStr  = `${yr}-${String(mo+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isToday  = !other && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const dayEvs   = events.filter(e => e.event_date.slice(0,10) === dateStr);
    return { day, dateStr, other, isToday, dayEvs };
  });

  return (
    <>
      <Starfield />
      <Nav />
      <main style={{ position:'relative', zIndex:1, padding:'84px 40px 80px', maxWidth:1000, margin:'0 auto' }}>
        <style>{`
          .sec-hdr{font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:0.4em;color:var(--imperial-glow);text-transform:uppercase;margin-bottom:6px;opacity:0.7;}
          .sec-title{font-family:'Orbitron',sans-serif;font-weight:700;font-size:clamp(1.2rem,3vw,2rem);letter-spacing:0.15em;color:var(--imperial-white);text-transform:uppercase;text-shadow:0 0 20px rgba(30,144,255,0.4);}
          .cal-hdr{display:flex;align-items:center;justify-content:space-between;margin:24px 0 20px;}
          .cal-month{font-family:'Orbitron',sans-serif;font-weight:700;font-size:1.3rem;letter-spacing:0.2em;color:var(--imperial-white);text-shadow:0 0 15px rgba(30,144,255,0.4);text-transform:uppercase;}
          .cal-nav{background:transparent;border:1px solid var(--imperial-border);color:var(--text-mid);padding:10px 20px;font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:0.2em;cursor:pointer;text-transform:uppercase;transition:all 0.2s;}
          .cal-nav:hover{border-color:var(--imperial-glow);color:var(--imperial-bright);background:rgba(30,144,255,0.05);}
          .legend{display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap;}
          .leg-item{display:flex;align-items:center;gap:8px;font-family:'Orbitron',sans-serif;font-size:0.55rem;letter-spacing:0.2em;color:var(--text-mid);text-transform:uppercase;}
          .leg-dot{width:10px;height:10px;border-left:3px solid;}
          .leg-dot.birthday{border-color:#cc2200;background:rgba(204,34,0,0.2);}
          .leg-dot.gathering{border-color:var(--imperial-glow);background:rgba(30,144,255,0.15);}
          .leg-dot.vacation{border-color:#44aa66;background:rgba(100,200,100,0.12);}
          .cal-grid{border:1px solid var(--imperial-border);background:var(--imperial-panel);overflow:hidden;}
          .cal-day-hdrs{display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--imperial-border);background:rgba(30,144,255,0.04);}
          .cal-day-hdr{padding:12px;text-align:center;font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.3em;color:var(--imperial-glow);text-transform:uppercase;border-right:1px solid rgba(30,58,95,0.4);}
          .cal-day-hdr:last-child{border-right:none;}
          .cal-days{display:grid;grid-template-columns:repeat(7,1fr);}
          .cal-day{min-height:100px;padding:8px;border-right:1px solid rgba(30,58,95,0.3);border-bottom:1px solid rgba(30,58,95,0.3);cursor:pointer;transition:background 0.2s;position:relative;}
          .cal-day:hover{background:rgba(30,144,255,0.04);}
          .cal-day:nth-child(7n){border-right:none;}
          .cal-day.other .cal-num{opacity:0.2;}
          .cal-day.istoday{background:rgba(30,144,255,0.06);}
          .cal-day.istoday .cal-num{color:var(--imperial-bright);text-shadow:0 0 8px var(--imperial-glow);}
          .cal-num{font-family:'Share Tech Mono',monospace;font-size:0.75rem;color:var(--text-dim);margin-bottom:4px;display:block;}
          .ev{font-size:0.65rem;padding:2px 6px;margin-bottom:2px;border-left:2px solid;font-family:'Rajdhani',sans-serif;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;transition:opacity 0.2s;letter-spacing:0.05em;}
          .ev:hover{opacity:0.7;}
          .ev.birthday{background:rgba(204,34,0,0.15);border-color:#cc2200;color:#ff6644;}
          .ev.gathering{background:rgba(30,144,255,0.12);border-color:var(--imperial-glow);color:var(--imperial-bright);}
          .ev.vacation{background:rgba(100,200,100,0.1);border-color:#44aa66;color:#66cc88;}
          .hint{margin-top:12px;font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:var(--text-dim);letter-spacing:0.1em;}
          /* Modal */
          .overlay{display:none;position:fixed;inset:0;background:rgba(8,10,14,0.9);z-index:2000;align-items:center;justify-content:center;}
          .overlay.open{display:flex;}
          .modal{background:var(--imperial-panel);border:1px solid var(--imperial-border);box-shadow:0 0 60px rgba(30,144,255,0.15);padding:40px;width:440px;max-width:95vw;position:relative;}
          .modal::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--imperial-glow),var(--imperial-red),var(--imperial-glow),transparent);}
          .modal-title{font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.9rem;letter-spacing:0.25em;color:var(--imperial-white);text-transform:uppercase;margin-bottom:28px;}
          .fg{margin-bottom:16px;}
          .fg label{display:block;font-family:'Orbitron',sans-serif;font-size:0.55rem;letter-spacing:0.3em;color:var(--imperial-glow);text-transform:uppercase;margin-bottom:6px;}
          .fg input,.fg select,.fg textarea{width:100%;background:rgba(8,10,14,0.8);border:1px solid var(--imperial-border);color:var(--text-bright);padding:10px 14px;font-family:'Rajdhani',sans-serif;font-size:0.95rem;font-weight:500;outline:none;transition:border-color 0.2s;}
          .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--imperial-glow);box-shadow:0 0 8px rgba(30,144,255,0.1);}
          .fg select option{background:var(--imperial-panel);}
          .modal-btns{display:flex;gap:10px;margin-top:24px;flex-wrap:wrap;}
          .btn{flex:1;padding:12px;font-family:'Orbitron',sans-serif;font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all 0.2s;min-width:80px;}
          .btn-p{background:rgba(30,144,255,0.1);border-color:var(--imperial-glow);color:var(--imperial-bright);}
          .btn-p:hover{background:rgba(30,144,255,0.2);box-shadow:0 0 15px rgba(30,144,255,0.2);}
          .btn-d{background:rgba(204,34,0,0.1);border-color:#cc2200;color:#ff6644;}
          .btn-d:hover{background:rgba(204,34,0,0.2);}
          .btn-g{background:transparent;border-color:var(--imperial-border);color:var(--text-dim);}
          .btn-g:hover{border-color:var(--text-mid);color:var(--text-mid);}
          /* Status */
          .sbar{position:fixed;bottom:0;left:0;right:0;background:rgba(8,10,14,0.95);border-top:1px solid var(--imperial-border);padding:6px 40px;display:flex;align-items:center;gap:24px;z-index:900;}
          .si{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:var(--text-dim);letter-spacing:0.1em;display:flex;align-items:center;gap:6px;}
          .sd{width:6px;height:6px;border-radius:50%;background:var(--imperial-glow);box-shadow:0 0 6px var(--imperial-glow);animation:blink 2s infinite;}
          @media(max-width:680px){
            main{padding:70px 12px 24px!important;}
            .cal-month{font-size:0.85rem;letter-spacing:0.08em;}
            .cal-nav{padding:8px 10px;font-size:0.55rem;letter-spacing:0.08em;}
            .cal-day{min-height:52px;padding:4px 3px;}
            .cal-num{font-size:0.65rem;}
            .cal-day-hdr{padding:8px 2px;font-size:0.45rem;letter-spacing:0.1em;}
            .ev{font-size:0.55rem;padding:1px 3px;}
            .legend{gap:12px;}
            .leg-item{font-size:0.48rem;}
            .sbar{bottom:56px;padding:4px 12px;gap:10px;}
            .si{font-size:0.55rem;}
            .modal{padding:24px 20px;}
          }
        `}</style>

        <div className="sec-hdr">Imperial Chronology</div>
        <div className="sec-title">Family Calendar</div>

        <div className="cal-hdr">
          <button className="cal-nav" onClick={() => changeMonth(-1)}>◂ Prev</button>
          <div className="cal-month">{MONTHS[month]} {year}</div>
          <button className="cal-nav" onClick={() => changeMonth(1)}>Next ▸</button>
        </div>

        <div className="legend">
          <div className="leg-item"><div className="leg-dot birthday"/>Birthday / Anniversary</div>
          <div className="leg-item"><div className="leg-dot gathering"/>Family Gathering</div>
          <div className="leg-item"><div className="leg-dot vacation"/>Vacation / Trip</div>
        </div>

        <div className="cal-grid">
          <div className="cal-day-hdrs">
            {DAYS.map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
          </div>
          <div className="cal-days">
            {cells.map((c, i) => (
              <div
                key={i}
                className={`cal-day${c.other ? ' other' : ''}${c.isToday ? ' istoday' : ''}`}
                onClick={() => openAdd(c.dateStr)}
              >
                <span className="cal-num">{c.day}</span>
                {c.dayEvs.map(ev => (
                  <div key={ev.id} className={`ev ${ev.type}`}
                    onClick={e => { e.stopPropagation(); openEdit(ev); }}>
                    {ev.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="hint">&gt; CLICK ANY DAY TO LOG A NEW EVENT &nbsp;·&nbsp; CLICK AN EVENT TO EDIT OR DELETE</div>
      </main>

      {/* Event Modal */}
      <div className={`overlay${modal ? ' open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setModal(false); }}>
        <div className="modal">
          <div className="modal-title">{editId ? 'Edit Event' : 'Log New Event'}</div>
          <div className="fg">
            <label>Event Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter event name…" />
          </div>
          <div className="fg">
            <label>Date</label>
            <input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
          </div>
          <div className="fg">
            <label>Category</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="birthday">Birthday / Anniversary</option>
              <option value="gathering">Family Gathering</option>
              <option value="vacation">Vacation / Trip</option>
            </select>
          </div>
          <div className="fg">
            <label>Notes (optional)</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional details…" />
          </div>
          <div className="modal-btns">
            <button className="btn btn-p" onClick={saveEvent} disabled={saving}>{saving ? '…' : 'Transmit'}</button>
            {editId && <button className="btn btn-d" onClick={deleteEvent} disabled={saving}>Delete</button>}
            <button className="btn btn-g" onClick={() => setModal(false)}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="sbar">
        <span className="si"><span className="sd"/>NETWORK SECURE</span>
        <span className="si">EVENTS: {events.length}</span>
      </div>
    </>
  );
}
