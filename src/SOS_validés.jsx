import Topbar from "./Topbar";
import "./index.css";

const MOCK_VALIDES = [
  { id: 1, nom: "Limbo Challenge",   turne: "T-099", cible: "Alex Blanc",   date: "18 Mar — 13h00", points: 150 },
  { id: 2, nom: "Pub Crawl Photo",   turne: "T-143", cible: "Nina Moreau",  date: "17 Mar — 21h00", points: 200 },
  { id: 3, nom: "Vélo Tour Campus",  turne: "T-255", cible: "Yann Gérard",  date: "15 Mar — 10h30", points: 100 },
];

export default function SosValides() {
  const total = MOCK_VALIDES.reduce((a, s) => a + s.points, 0);

  return (
    <div style={{ background: "#FDF6F0", minHeight: "100vh" }}>
      <Topbar title="SOS VALIDÉS" />
      <div className="page">
        <p className="page-subtitle">
          {MOCK_VALIDES.length} SOS validés — <strong>{total} pts</strong>
        </p>

        {MOCK_VALIDES.map(s => (
          <div key={s.id} className="sos-card">
            <div>
              <div className="card-title">{s.nom}</div>
              <div className="card-meta">{s.turne} • {s.cible} • {s.date}</div>
            </div>
            <span className="badge success">+{s.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
