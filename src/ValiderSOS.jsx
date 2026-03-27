import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import "./index.css";

import { validerSos } from "./api.js";

export default function ValiderSOS() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sos = MOCK_SOS.find(s => String(s.id) === String(id));

  const [cdpNom, setCdpNom]   = useState("");
  const [photo, setPhoto]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!cdpNom.trim() || !photo || !sos) return;
    try {
      setSubmitted(true);
      await validerSos(sos.key || sos.id, cdpNom, photo);
      setTimeout(() => navigate("/valides"), 2000);
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      setSubmitted(false);
      alert("Erreur lors de la validation du SOS");
    }
  };

  return (
    <div className="valider-page">
      <Topbar title="VALIDE TON SOS" />

      <div className="page">
        {submitted ? (
          <div className="valider-success-wrap">
            <div className="valider-success">
              <svg width="72" height="72" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="25" stroke="#2E7D32" strokeWidth="2" fill="#E8F5E9" />
                <path d="M14 27l8 8 16-16" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 className="success-title">SOS envoyé !</h2>
              <p className="success-sub">Ton SOS est en attente de validation par le BDE.</p>
            </div>
          </div>
        ) : (
          <div className="valider-card">
            <div className="valider-banner" />
            <div className="valider-body">
              <h2 className="valider-sos-name">{sos?.nom ?? "Nom du SOS"}</h2>
              {sos && (
                <p className="valider-sos-meta">
                  {sos.turne} • {sos.destinataire} • {sos.heure}
                </p>
              )}

              <label className="valider-label">Nom du CDP :</label>
              <input
                className="valider-input"
                placeholder="Ecris le nom..."
                value={cdpNom}
                onChange={e => setCdpNom(e.target.value)}
              />

              <div
                className={`valider-dropzone${dragging ? " dragging" : ""}${preview ? " has-preview" : ""}`}
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              >
                {preview ? (
                  <img src={preview} alt="preview" className="valider-preview-img" />
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                      <path d="M12 4v12M8 8l4-4 4 4" strokeLinejoin="round" />
                    </svg>
                    <span>Drag and drop / upload photo</span>
                  </>
                )}
                <input
                  ref={fileRef} type="file" accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>

              {preview && (
                <button className="valider-clear-btn" onClick={() => { setPhoto(null); setPreview(null); }}>
                  Supprimer la photo
                </button>
              )}

              <div className="valider-actions">
                <button
                  className="valider-btn-primary"
                  onClick={handleSubmit}
                  disabled={!cdpNom.trim() || !photo}
                >
                  VALIDER
                </button>
                <button className="valider-btn-secondary" onClick={() => navigate(-1)}>
                  Retour
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
