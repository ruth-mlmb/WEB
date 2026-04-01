import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { fetchSosValides } from "./api.js";
import "./index.css";

export default function SosValides() {
  const [sos,     setSos]     = useState([]);
  const [loading, setLoading] = useState(true);

  const listeId = Number(localStorage.getItem('cdp_listeId') || 1);

  useEffect(() => {
    fetchSosValides(listeId)
      .then(setSos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [listeId]);

  // Chaque SOS validé rapporte 10 points (logique backend)
  const total = sos.length * 10;

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
              <div className="card-title">{s.nom_SOS || s.description}</div>
              <div className="card-meta">{s.nomPote || s.nom_pote || s.pnom_commande} • {s.jour || ''} {s.horaire || ''}</div>
            </div>
            <span className="badge success">+10 pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
