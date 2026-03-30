import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import "./index.css";
import { commanderSos } from "./api.js";

const MOCK_SOS = [
  { id: 1, nom: "Limbo Challenge",  heure: "18h00", destinataire: "Alex Blanc",  turne: "T-099" },
  { id: 2, nom: "Selfie Fontaine",  heure: "12h00", destinataire: "Nina Moreau", turne: "T-143" },
  { id: 3, nom: "Battle Dance",     heure: "20h00", destinataire: "Romain F.",   turne: "T-211" },
  { id: 4, nom: "Pub Crawl Photo",  heure: "21h30", destinataire: "Chloé A.",    turne: "T-077" },
  { id: 5, nom: "Vélo Tour",        heure: "10h30", destinataire: "Yann Gérard", turne: "T-255" },
  { id: 6, nom: "Karaoké Express",  heure: "22h00", destinataire: "Léa Martin",  turne: "T-302" },
  { id: 7, nom: "Yoga Surprise",    heure: "09h00", destinataire: "Tom Duval",   turne: "T-188" },
];

export default function AjoutSos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sos = MOCK_SOS.find(s => String(s.id) === String(id));

  const [sosNom, setSosNom]   = useState("");
  const [sosDesc, setSosDesc]   = useState("");
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
    if (!sosNom.trim() || !photo) return;

    try {
      setSubmitted(true);
      const listeId = Number(localStorage.getItem('cdp_listeId') || 1);
      const listeName = localStorage.getItem('cdp_listeName') || 'Liste inconnue';

      await commanderSos({
        listeId,
        listeName,
        nomPote: sosNom,
        nom_SOS: sosNom,
        description: sosDesc,
        image: photo,
        batiment: 'Inconnu',
        chambre: 'Inconnue',
        jour: 'Lundi',
        horaire: 'Matin',
        key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      });

      setTimeout(() => navigate("/valides"), 2000);
    } catch (error) {
      console.error('Erreur commande SOS:', error);
      setSubmitted(false);
      alert('Erreur lors de la commande du SOS');
    }
  };

  return (
    <div className="valider-page">
      <Topbar title="NOUVEAU SOS" />

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
              <h2 className="valider-sos-name">{sos?.nom ?? "Nom du SOS :"}</h2>
              {sos && (
                <p className="valider-sos-meta">
                  {sos.turne} • {sos.destinataire} • {sos.heure}
                </p>
              )}
              <input
                className="valider-input"
                placeholder="Ecris le nom..."
                value={sosNom}
                onChange={e => setSosNom(e.target.value)}
              />

              <label className="valider-label">Description du SOS :</label>
              <input
                className="valider-input"
                placeholder="Ecris la description..."
                value={sosDesc}
                onChange={e => setSosDesc(e.target.value)}
              />

              <label className="valider-label">Image du SOS :</label>
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
                  disabled={!sosNom.trim() || !photo}
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
