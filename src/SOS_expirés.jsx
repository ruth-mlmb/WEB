const MOCK_EXPIRES = [
  { id: 1, nom: "Tournoi Ping Pong", turne: "T-077", cible: "Chloé André",   date: "10 Mar — 14h00", raison: "Délai dépassé" },
  { id: 2, nom: "Battle Dance",      turne: "T-211", cible: "Romain Fleury", date: "08 Mar — 19h00", raison: "Non réalisé"   },
];

export default function SosExpires() {
  return (
    <div className="page">
      <p className="page-subtitle">{MOCK_EXPIRES.length} SOS expirés</p>

      {MOCK_EXPIRES.map(s => (
        <div key={s.id} className="sos-card expired">
          <div>
            <div className="card-title">{s.nom}</div>
            <div className="card-meta">{s.turne} • {s.cible} • {s.date}</div>
          </div>
          <span className="badge danger">{s.raison}</span>
        </div>
      ))}
    </div>
  );
}
