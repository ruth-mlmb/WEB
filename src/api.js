// src/api.js
// Toutes les fonctions qui parlent à votre backend.
// Adaptées à votre server.js (port 5000, route /api/cdp)

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log('API BASE URL:', BASE);

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

export const fetchSosEnAttente = (listeId) => {
  const query = listeId ? `?listeId=${encodeURIComponent(listeId)}` : '';
  return fetch(`${BASE}/cdp/sos-en-attente${query}`, { headers: authHeaders() }).then(handle);
};

export const fetchSosValides = (listeId) => {
  const query = listeId ? `?listeId=${encodeURIComponent(listeId)}` : '';
  return fetch(`${BASE}/cdp/sos-valides${query}`, { headers: authHeaders() }).then(handle);
};

export const fetchSosExpires = (listeId) => {
  const query = listeId ? `?listeId=${encodeURIComponent(listeId)}` : '';
  return fetch(`${BASE}/cdp/sos-expires${query}`, { headers: authHeaders() }).then(handle);
};

export const fetchScore = (listeId, listeName) => {
  const params = new URLSearchParams();
  if (listeId) params.set('listeId', listeId);
  if (listeName) params.set('listeName', listeName);
  const query = params.toString() ? `?${params.toString()}` : '';
  return fetch(`${BASE}/cdp/score${query}`, { headers: authHeaders() }).then(handle);
};

export const fetchSosById = (id) =>
  fetch(`${BASE}/cdp/sos/${id}`, { headers: authHeaders() }).then(handle);

// Envoie la photo de validation (multipart/form-data)
export async function validerSos(id, cdpNom, photoFile) {
  const form = new FormData();
  form.append('cdpNom', cdpNom);
  form.append('photo', photoFile);

  // N'ajoute PAS Content-Type, seulement Authorization
  const headers = {};
  const auth = authHeaders();
  if (auth && auth.Authorization) headers['Authorization'] = auth.Authorization;

  return fetch(`${BASE}/cdp/valider/${id}`, {
    method: 'POST',
    headers,
    body: form,
  }).then(handle);
}

export async function commanderSos(payload) {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value);
    }
  });

  return fetch(`${BASE}/cdp/sos`, {
    method: 'POST',
    body: form,
  }).then(handle);
}
