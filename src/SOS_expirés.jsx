import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { fetchSosExpires } from "./api.js";
import "./index.css";

export default function SosExpires() {
  const [sos,     setSos]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSosExpires()
      .then(setSos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
              <div className="card-title">{s.nom_SOS}</div>
              <div className="card-meta">{s.key} • {s.nom_pote} • {s.horaire_jour}</div>
            </div>
            <span className="badge danger">Expiré</span>
          </div>
        ))}
      </div>
    </div>
  );
}
