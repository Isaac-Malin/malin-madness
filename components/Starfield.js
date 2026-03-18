'use client';
// components/Starfield.js

export default function Starfield() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
    }}>
      <style>{`
        .sf::before, .sf::after {
          content: '';
          position: absolute;
          width: 2px; height: 2px;
          background: white;
          border-radius: 50%;
          box-shadow:
            120px 80px rgba(255,255,255,0.6), 240px 160px rgba(255,255,255,0.4),
            360px 50px rgba(255,255,255,0.7), 480px 200px rgba(255,255,255,0.3),
            600px 120px rgba(255,255,255,0.5), 720px 300px rgba(255,255,255,0.6),
            840px 80px rgba(255,255,255,0.4), 960px 220px rgba(255,255,255,0.7),
            80px 350px rgba(255,255,255,0.5), 200px 420px rgba(255,255,255,0.3),
            320px 500px rgba(255,255,255,0.6), 440px 380px rgba(255,255,255,0.4),
            560px 460px rgba(255,255,255,0.7), 680px 540px rgba(255,255,255,0.3),
            800px 400px rgba(255,255,255,0.5), 920px 480px rgba(255,255,255,0.6),
            1040px 360px rgba(255,255,255,0.4), 1160px 440px rgba(255,255,255,0.7),
            1280px 520px rgba(255,255,255,0.3), 100px 600px rgba(255,255,255,0.5),
            300px 680px rgba(255,255,255,0.6), 500px 720px rgba(255,255,255,0.4),
            700px 640px rgba(255,255,255,0.7), 900px 700px rgba(255,255,255,0.3),
            1100px 660px rgba(255,255,255,0.5), 1300px 740px rgba(255,255,255,0.6),
            150px 780px rgba(255,255,255,0.4), 450px 840px rgba(255,255,255,0.7),
            750px 800px rgba(255,255,255,0.3), 1050px 860px rgba(255,255,255,0.5),
            1350px 820px rgba(255,255,255,0.6), 1500px 180px rgba(255,255,255,0.4),
            50px 900px rgba(255,255,255,0.3), 250px 950px rgba(255,255,255,0.6);
          animation: twinkle 6s infinite alternate;
        }
        .sf::after {
          width: 1px; height: 1px;
          animation-delay: -3s;
          box-shadow:
            170px 130px rgba(255,255,255,0.5), 290px 210px rgba(255,255,255,0.3),
            410px 90px rgba(255,255,255,0.6), 530px 250px rgba(255,255,255,0.4),
            650px 170px rgba(255,255,255,0.7), 770px 340px rgba(255,255,255,0.3),
            890px 110px rgba(255,255,255,0.5), 1010px 270px rgba(255,255,255,0.6);
        }
      `}</style>
      <div className="sf" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}
