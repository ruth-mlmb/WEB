import { useState, useEffect } from "react";

const MEDALS = [
  { label: "1er",  color: "#FFD700", shadow: "#b8960080", height: 180 },
  { label: "2ème", color: "#C0C0C0", shadow: "#80808060", height: 140 },
  { label: "3ème", color: "#CD7F32", shadow: "#7a4a1e60", height: 110 },
];

function PodiumStage({ candidate, medal, animDelay }) {
  if (!candidate) return null;
  return (
    <div className="podium-slot" style={{ "--delay": `${animDelay}s`, "--medal-color": medal.color, "--shadow": medal.shadow }}>
      <div className="candidate-card">
        <div className="avatar">{candidate.name.charAt(0)}</div>
        <p className="cand-name">{candidate.name}</p>
        <p className="cand-score">{candidate.score} SOS</p>
      </div>
      <div className="stage" style={{ height: `${medal.height}px` }}>
        <span className="rank-label">{medal.label}</span>
      </div>
    </div>
  );
}

export default function Accueil() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/candidates")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => { setCandidates(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  // Déjà trié par le back, mais on sécurise
  const sorted       = [...candidates].sort((a, b) => b.score - a.score);
  const top3         = sorted.slice(0, 3);
  const rest         = sorted.slice(3);
  const podiumOrder  = [top3[1], top3[0], top3[2]];
  const podiumMedals = [MEDALS[1], MEDALS[0], MEDALS[2]];
  const maxScore     = sorted[0]?.score || 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d0f; color: #e8e0d4; font-family: 'DM Sans', sans-serif; min-height: 100vh; }

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: linear-gradient(to bottom, #0d0d0fdd, transparent); backdrop-filter: blur(4px); }
        .nav-btn { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 0.15em; padding: 0.55rem 1.6rem; border-radius: 4px; border: none; cursor: pointer; transition: transform 0.15s, opacity 0.15s; text-decoration: none; display: inline-block; }
        .nav-btn:hover { transform: translateY(-2px); opacity: 0.9; }
        .btn-cdp { background: #1e1e24; color: #c9a84c; box-shadow: 0 0 0 1px #c9a84c55, 0 4px 16px #c9a84c22; }
        .btn-sos { background: #c0392b; color: #fff; box-shadow: 0 4px 20px #c0392b66; }

        main { display: flex; flex-direction: column; align-items: center; padding: 120px 1rem 60px; min-height: 100vh; }
        h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.2rem, 6vw, 4rem); letter-spacing: 0.18em; color: #c9a84c; text-shadow: 0 0 40px #c9a84c44; margin-bottom: 0.3rem; }
        .subtitle { font-size: 0.85rem; color: #6b6560; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 3.5rem; }

        .state-msg { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 0.12em; color: #4a4540; margin-top: 4rem; }
        .state-error { color: #c0392b; }

        .podium-wrap { display: flex; align-items: flex-end; gap: 1rem; margin-bottom: 3rem; }
        .podium-slot { display: flex; flex-direction: column; align-items: center; animation: riseUp 0.7s ease both; animation-delay: var(--delay); }
        @keyframes riseUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        .candidate-card { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; margin-bottom: 0.75rem; animation: fadeIn 0.5s ease both; animation-delay: calc(var(--delay) + 0.3s); opacity: 0; }
        @keyframes fadeIn { to { opacity: 1; } }

        .avatar { width: 52px; height: 52px; border-radius: 50%; background: var(--medal-color); color: #0d0d0f; font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px var(--shadow); }
        .cand-name { font-size: 0.78rem; font-weight: 500; color: #e8e0d4; text-align: center; max-width: 110px; }
        .cand-score { font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; color: var(--medal-color); }

        .stage { width: 120px; background: linear-gradient(to top, #1a1a20, #24242d); border-top: 3px solid var(--medal-color); box-shadow: 0 -4px 24px var(--shadow), inset 0 1px 0 var(--medal-color); display: flex; align-items: flex-start; justify-content: center; padding-top: 0.6rem; border-radius: 4px 4px 0 0; }
        .rank-label { font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem; letter-spacing: 0.08em; color: var(--medal-color); }

        .rest-list { width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 0.55rem; }
        .rest-list h2 { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 0.15em; color: #4a4540; margin-bottom: 0.5rem; text-align: center; }
        .rest-row { display: flex; align-items: center; gap: 1rem; padding: 0.6rem 1rem; background: #13131a; border: 1px solid #ffffff0a; border-radius: 6px; transition: border-color 0.2s, background 0.2s; animation: fadeIn 0.4s ease both; animation-delay: var(--row-delay, 0s); }
        .rest-row:hover { background: #1a1a24; border-color: #c9a84c33; }
        .row-rank { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: #4a4540; width: 24px; text-align: center; }
        .row-name { flex: 1; font-size: 0.88rem; color: #c8c0b8; }
        .row-score { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; color: #7a7068; white-space: nowrap; }
        .row-bar-wrap { width: 80px; height: 4px; background: #1e1e26; border-radius: 2px; overflow: hidden; }
        .row-bar { height: 100%; border-radius: 2px; background: linear-gradient(to right, #c9a84c44, #c9a84c); }
      `}</style>

      <nav>
        <a className="nav-btn btn-sos" href="/login_user"> Se connecter </a>
        <a className="nav-btn btn-cdp" href="/login_cdp"> CDP </a>
        <a className='bouton_bde' href="/login_bde"> BDE </a>
      </nav>

      <main>
        <h1>Classement</h1>
        <p className="subtitle">SOS terminés · Session en cours</p>

        {loading && <p className="state-msg">Chargement…</p>}
        {error   && <p className="state-msg state-error">⚠ {error}</p>}

        {!loading && !error && (
          <>
            <div className="podium-wrap">
              {podiumOrder.map((cand, i) => (
                <PodiumStage
                  key={cand?.id ?? i}
                  candidate={cand}
                  medal={podiumMedals[i]}
                  animDelay={0.1 + i * 0.15}
                />
              ))}
            </div>

            {rest.length > 0 && (
              <div className="rest-list">
                <h2>Suite du classement</h2>
                {rest.map((cand, i) => (
                  <div
                    key={cand.id}
                    className="rest-row"
                    style={{ "--row-delay": `${0.6 + i * 0.08}s` }}
                  >
                    <span className="row-rank">{i + 4}</span>
                    <span className="row-name">{cand.name}</span>
                    <div className="row-bar-wrap">
                      {/* Barre proportionnelle au score max */}
                      <div className="row-bar" style={{ width: `${(cand.score / maxScore) * 100}%` }} />
                    </div>
                    <span className="row-score">{cand.score} SOS</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}