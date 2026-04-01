import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { fetchSosExpires } from "./api.js";
import "./index.css";

export default function SosExpires() {
  const [sos,     setSos]     = useState([]);
  const [loading, setLoading] = useState(true);

  const listeId = Number(localStorage.getItem('cdp_listeId') || 1);

  useEffect(() => {
    fetchSosExpires(listeId)
      .then(setSos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [listeId]);

  return (
    <div style={{ background: "#FDF6F0", minHeight: "100vh" }}>
      <Topbar title="SOS EXPIRÉS" />
      <div className="page">
        <p className="page-subtitle">
          {loading ? "Chargement…" : `${sos.length} SOS expirés`}
        </p>

        {sos.map(s => (
          <div key={s._id} className="sos-card expired">
            <div>
              <div className="card-title">{s.nom_SOS || s.description}</div>
              <div className="card-meta">{s.nomPote || s.nom_pote || s.pnom_commande} • {s.jour || ''} {s.horaire || ''}</div>
            </div>
            <span className="badge danger">Expiré</span>
          </div>
        ))}
      </div>
    </div>
  );
}
