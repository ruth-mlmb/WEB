import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { fetchSosValides } from "./api.js";
import "./index.css";

export default function SosValides() {
  const [sos,     setSos]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSosValides()
      .then(setSos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = sos.reduce((acc, s) => acc + (s.points ?? 0), 0);

  return (
    <div style={{ background: "#FDF6F0", minHeight: "100vh" }}>
      <Topbar title="SOS VALIDÉS" />
      <div className="page">
        <p className="page-subtitle">
          {loading ? "Chargement…" : `${sos.length} SOS validés — `}
          {!loading && <strong>{total} pts</strong>}
        </p>

        {sos.map(s => (
          <div key={s._id} className="sos-card">
            <div>
              <div className="card-title">{s.nom_SOS}</div>
              <div className="card-meta">{s.key} • {s.nom_pote} • {s.horaire_jour}</div>
            </div>
            <span className="badge success">+{s.points ?? 0} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
