import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export default function Topbar({ title }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <button className="topbar-btn" onClick={() => navigate("/")}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#1A1A2E">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>

      <h1>{title}</h1>

      <div style={{ position: "relative" }}>
        <button className="avatar-btn" onClick={() => setOpen(v => !v)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1A2E">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </button>

        {open && (
          <div className="dropdown" onClick={() => setOpen(false)}>
            <div className="dropdown-item" onClick={() => navigate("/valides")}>SOS validés</div>
            <div className="dropdown-item" onClick={() => navigate("/expires")}>SOS expirés</div>
            <div className="dropdown-item danger">Déconnexion</div>
          </div>
        )}
      </div>
    </div>
  );
}
