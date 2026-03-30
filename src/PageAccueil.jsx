import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSosEnAttente, fetchScore } from "./api.js";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Righteous&family=DM+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { margin:0; padding:0; min-height:100%; width:100%; overflow-x:hidden; }
`;

const fadeUp     = keyframes`from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}`;
const StylePage  = styled.div`background-color:#fff8f8;min-height:100vh;width:100%;padding-bottom:60px;`;
const HomeTopbar = styled.div`display:flex;align-items:center;justify-content:flex-end;padding:16px 24px;background:#fff8f8;position:sticky;top:0;z-index:100;`;
const AvatarBtn  = styled.button`width:44px;height:44px;border-radius:50%;border:2px solid #e0d8d0;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s;&:hover{border-color:#333;}`;
const Dropdown   = styled.div`position:absolute;right:24px;top:64px;background:#fff;border:1px solid #e0d8d0;border-radius:16px;padding:8px 0;min-width:180px;box-shadow:0 8px 32px rgba(0,0,0,.12);z-index:200;`;
const DropItem   = styled.div`padding:11px 20px;cursor:${p=>p.$label?"default":"pointer"};font-size:${p=>p.$label?"12px":"14px"};font-weight:${p=>p.$label?"600":"400"};color:${p=>p.$danger?"#E53935":p.$label?"#888":"#1A1A2E"};border-bottom:${p=>p.$label?"1px solid #e0d8d0":"none"};font-family:'DM Sans',sans-serif;transition:background .15s;&:hover{background:${p=>p.$label||p.$danger?"transparent":"#fff8f8"};}`;
const Hero       = styled.div`text-align:center;padding:8px 24px 28px;animation:${fadeUp} .5s ease both;`;
const Titre      = styled.h1`font-family:'Righteous',cursive;font-size:clamp(48px,10vw,80px);color:#1A1A2E;letter-spacing:3px;line-height:1;margin-bottom:6px;transform:perspective(400px) rotateX(-8deg);text-shadow:0px 4px 0px rgba(0,0,0,.08),3px 8px 20px rgba(0,0,0,.12);`;
const ScoreBlock = styled.div`margin:0 24px 32px;background:#1A1A2E;border-radius:20px;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;animation:${fadeUp} .5s .1s ease both;box-shadow:0 8px 28px rgba(26,26,46,.18);`;
const ScoreLabel = styled.p`font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(255,255,255,.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;`;
const ScoreValue = styled.p`font-family:'Righteous',cursive;font-size:42px;color:#fff;line-height:1;`;
const ScoreUnit  = styled.span`font-size:18px;color:rgba(255,255,255,.5);margin-left:4px;`;
const ClassBadge = styled.div`background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:10px 18px;text-align:right;`;
const ClassNum   = styled.p`font-family:'Righteous',cursive;font-size:22px;color:#fff;line-height:1;`;
const ClassSub   = styled.p`font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(255,255,255,.45);margin-top:2px;`;
const SectionTitle= styled.p`font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#aaa;padding:0 16px;margin-bottom:10px;`;
const CardsList  = styled.div`padding:0 12px;display:flex;flex-wrap:wrap;gap:10px;`;
const SOSCard    = styled.div`background:${p=>p.$yellow?"#ffd374":"#d9d9d9"};border-radius:20px;padding:18px 20px 20px;width:calc(50% - 5px);display:flex;flex-direction:column;gap:6px;cursor:pointer;transition:box-shadow .2s,transform .15s;animation:${fadeUp} .4s ${p=>p.$delay}s ease both;&:hover{box-shadow:0 6px 20px rgba(0,0,0,.10);transform:translateY(-2px);}@media(max-width:400px){width:100%;}`;
const CardNom    = styled.p`font-family:'Righteous',cursive;font-size:14px;color:#1A1A2E;line-height:1.2;`;
const CardMeta   = styled.p`font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(0,0,0,.45);`;
const ValiderBtn = styled.button`margin-top:10px;align-self:flex-start;background:#fff;color:#1A1A2E;border:none;border-radius:20px;padding:7px 16px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:background .2s,transform .1s;&:hover{background:#f0f0f0;transform:scale(1.03);}`;
const Skeleton   = styled.div`background:#e5e0da;border-radius:20px;width:calc(50% - 5px);height:140px;animation:pulse 1.4s ease-in-out infinite;@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`;

/* ── Extrait le score depuis la réponse backend.
   Le modèle LISTE n'a que ptsListe, pas points. ── */
function extractScore(data) {
  if (!data) return 0;
  // ptsListe en priorité (champ réel du schema), points en fallback
  const val = data.ptsListe ?? data.points ?? 0;
  return Number(val) || 0;
}

/* ── Trouve le rang de la liste dans le classement.
   Essaie : 1) ID numérique, 2) _id MongoDB, 3) nom de liste ── */
function findRang(classement, listeId, listeName) {
  if (!classement?.length) return null;
  const sorted = [...classement].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const idx = sorted.findIndex(l =>
    String(l.id) === String(listeId) ||          // match ID numérique
    String(l.id) === String(listeName) ||         // match ObjectId éventuel
    (l.name && l.name === listeName)              // match par nom de liste
  );
  return idx >= 0 ? idx + 1 : null;
}

export default function PageAccueil() {
  const navigate = useNavigate();

  const storedListeId   = localStorage.getItem('cdp_listeId');
  const storedListeName = localStorage.getItem('cdp_listeName') || '';

  const [open,       setOpen]       = useState(false);
  const [sos,        setSos]        = useState([]);
  const [points,     setPoints]     = useState(0);
  const [rang,       setRang]       = useState(null);
  const [nbListes,   setNbListes]   = useState(0);
  const [loading,    setLoading]    = useState(true);

  /* ── déconnexion : navigate d'abord, nettoyer ensuite ── */
  const handleLogout = () => {
    navigate('/');                                // ← vers la page d'accueil globale
    setTimeout(() => {
      localStorage.removeItem('cdp_listeId');
      localStorage.removeItem('cdp_listeName');
      localStorage.removeItem('cdp_token');
    }, 50);
  };

  const fetchClassement = useCallback(async () => {
    const res  = await fetch('/api/cdp/candidates');
    if (!res.ok) return [];
    return res.json();
  }, []);

  useEffect(() => {
    if (!storedListeId) {
      navigate('/login_cdp');
      return;
    }

    Promise.all([
      fetchSosEnAttente(storedListeId),
      fetchScore(storedListeId, storedListeName),
      fetchClassement(),
    ])
      .then(([sosData, scoreData, classData]) => {
        setSos(Array.isArray(sosData) ? sosData : []);

        // ── score : lit ptsListe en priorité ──
        setPoints(extractScore(scoreData));

        // ── classement ──
        const sorted = [...classData].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        setNbListes(sorted.length);
        setRang(findRang(sorted, storedListeId, storedListeName));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [storedListeId, storedListeName, navigate, fetchClassement]);

  return (
    <>
      <GlobalStyle />
      <StylePage>

        <HomeTopbar>
          <div style={{ position: "relative" }}>
            <AvatarBtn onClick={() => setOpen(v => !v)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1A2E">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </AvatarBtn>
            {open && (
              <Dropdown onClick={() => setOpen(false)}>
                <DropItem $label>Liste : {storedListeName || '—'}</DropItem>
                <DropItem onClick={() => navigate("/valides")}>SOS validés</DropItem>
                <DropItem onClick={() => navigate("/expires")}>SOS expirés</DropItem>
                <DropItem onClick={() => navigate("/ajout")}>Nouveau SOS</DropItem>
                <DropItem $danger onClick={handleLogout}>Déconnexion</DropItem>
              </Dropdown>
            )}
          </div>
        </HomeTopbar>

        <Hero><Titre>MES SOS</Titre></Hero>

        <ScoreBlock>
          <div>
            <ScoreLabel>Score total</ScoreLabel>
            <ScoreValue>{points}<ScoreUnit>pts</ScoreUnit></ScoreValue>
          </div>
          <ClassBadge>
            <ClassNum>{rang != null ? `#${rang}` : '—'}</ClassNum>
            <ClassSub>sur {nbListes || '—'} listes</ClassSub>
          </ClassBadge>
        </ScoreBlock>

        <SectionTitle>SOS en attente · {loading ? "…" : sos.length}</SectionTitle>
        <CardsList>
          {loading
            ? [0,1,2,3].map(i => <Skeleton key={i} />)
            : sos.map((s, i) => (
              <SOSCard key={s._id} $yellow={i % 2 !== 0} $delay={0.15 + i * 0.05}>
                <CardNom>{s.nom_SOS || s.description || 'SOS sans titre'}</CardNom>
                <CardMeta>{[s.jour, s.horaire].filter(Boolean).join(' • ')}</CardMeta>
                <CardMeta>{s.nomPote || s.nom_pote || s.pnom_commande || ''}</CardMeta>
                {s.imageUrl && (
                  <img src={s.imageUrl} alt="SOS" style={{ width:'100%', borderRadius:'10px', marginTop:4 }} />
                )}
                <ValiderBtn onClick={() => navigate(`/valider/${s._id}`)}>
                  Valider le SOS
                </ValiderBtn>
              </SOSCard>
            ))
          }
        </CardsList>

      </StylePage>
    </>
  );
}
