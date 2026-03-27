// src/api.js
// Toutes les fonctions qui parlent à votre backend.
// Adaptées à votre server.js (port 5000, route /api/cdp)

const BASE = "http://localhost:5000/api";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("cdp_token")}`,
});

const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Erreur serveur");
  return data;
};

/* ── Auth ─────────────────────────────────────────────── */

export async function login(nom, mdp) {
  const res = await fetch(`${BASE}/cdp/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, mdp }),
  });
  const data = await handle(res);
  // On stocke le token reçu du backend pour les prochaines requêtes
  localStorage.setItem("cdp_token", data.token);
  localStorage.setItem("cdp_nom",   data.nom);
  return data;
}

export function logout() {
  localStorage.removeItem("cdp_token");
  localStorage.removeItem("cdp_nom");
}

/* ── SOS ──────────────────────────────────────────────── */

export const fetchSosEnAttente = () =>
  fetch(`${BASE}/cdp/sos-en-attente`, { headers: authHeaders() }).then(handle);

export const fetchSosValides = () =>
  fetch(`${BASE}/cdp/sos-valides`, { headers: authHeaders() }).then(handle);

export const fetchSosExpires = () =>
  fetch(`${BASE}/cdp/sos-expires`, { headers: authHeaders() }).then(handle);

export const fetchScore = () =>
  fetch(`${BASE}/cdp/score`, { headers: authHeaders() }).then(handle);

// Envoie la photo de validation (multipart/form-data)
export async function validerSos(key, cdpNom, photoFile) {
  const form = new FormData();
  form.append("cdpNom", cdpNom);
  form.append("photo",  photoFile);

  return fetch(`${BASE}/cdp/valider/${key}`, {
    method: "POST",
    headers: authHeaders(), // pas de Content-Type manuel, le browser pose le boundary
    body: form,
  }).then(handle);
}