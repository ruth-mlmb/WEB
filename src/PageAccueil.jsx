import styled, { createGlobalStyle, keyframes } from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Righteous&family=DM+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root {
    margin: 0; padding: 0;
    min-height: 100%; width: 100%;
    overflow-x: hidden;
  }
`;

/* ── animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── page shell ── */
const StylePage = styled.div`
  background-color: #fff8f8;
  min-height: 100vh;
  width: 100%;
  padding-bottom: 60px;
`;

/* ── topbar ── */
const HomeTopbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 24px;
  background: #fff8f8;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const AvatarBtn = styled.button`
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 2px solid #e0d8d0;
  background: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s;
  &:hover { border-color: #333; }
`;

const Dropdown = styled.div`
  position: absolute;
  right: 24px; top: 64px;
  background: #fff;
  border: 1px solid #e0d8d0;
  border-radius: 16px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  z-index: 200;
`;

const DropItem = styled.div`
  padding: 11px 20px;
  cursor: ${p => p.$label ? "default" : "pointer"};
  font-size: ${p => p.$label ? "12px" : "14px"};
  font-weight: ${p => p.$label ? "600" : "400"};
  color: ${p => p.$danger ? "#E53935" : p.$label ? "#888" : "#1A1A2E"};
  border-bottom: ${p => p.$label ? "1px solid #e0d8d0" : "none"};
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;
  &:hover { background: ${p => p.$label ? "transparent" : "#fff8f8"}; }
`;

/* ── hero header ── */
const Hero = styled.div`
  text-align: center;
  padding: 8px 24px 28px;
  animation: ${fadeUp} 0.5s ease both;
`;

const Titre = styled.h1`
  font-family: 'Righteous', cursive;
  font-size: clamp(48px, 10vw, 80px);
  color: #1A1A2E;
  letter-spacing: 3px;
  line-height: 1;
  margin-bottom: 6px;
  /* subtle 3d tilt kept from original, cleaned up */
  transform: perspective(400px) rotateX(-8deg);
  text-shadow: 0px 4px 0px rgba(0,0,0,0.08), 3px 8px 20px rgba(0,0,0,0.12);
`;

const TitreSub = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #aaa;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 10px;
`;

/* ── score block ── */
const ScoreBlock = styled.div`
  margin: 0 24px 32px;
  background: #1A1A2E;
  border-radius: 20px;
  padding: 20px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeUp} 0.5s 0.1s ease both;
  box-shadow: 0 8px 28px rgba(26,26,46,0.18);
`;

const ScoreLeft = styled.div``;

const ScoreLabel = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const ScoreValue = styled.p`
  font-family: 'Righteous', cursive;
  font-size: 42px;
  color: #fff;
  line-height: 1;
`;

const ScoreUnit = styled.span`
  font-size: 18px;
  color: rgba(255,255,255,0.5);
  margin-left: 4px;
`;

const ScoreRight = styled.div`
  text-align: right;
`;

const ClassementBadge = styled.div`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 10px 18px;
`;

const ClassementNum = styled.p`
  font-family: 'Righteous', cursive;
  font-size: 22px;
  color: #fff;
  line-height: 1;
`;

const ClassementSub = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  margin-top: 2px;
`;

/* ── section title ── */
const SectionTitle = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #aaa;
  padding: 0 16px;
  margin-bottom: 10px;
`;

/* ── SOS cards grid ── */
const CardsList = styled.div`
  padding: 0 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SOSCardWrap = styled.div`
  background: ${p => p.$yellow ? "#ffd374" : "#d9d9d9"};
  border-radius: 20px;
  padding: 18px 20px 20px;
  width: calc(50% - 5px);
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s;
  animation: ${fadeUp} 0.4s ${p => p.$delay}s ease both;

  &:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.10);
    transform: translateY(-2px);
  }

  @media (max-width: 400px) { width: 100%; }
`;

const CardNom = styled.p`
  font-family: 'Righteous', cursive;
  font-size: 14px;
  color: #1A1A2E;
  line-height: 1.2;
`;

const CardMeta = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(0,0,0,0.45);
`;

const ValiderBtn = styled.button`
  margin-top: 10px;
  align-self: flex-start;
  background: #fff;
  color: #1A1A2E;
  border: none;
  border-radius: 20px;
  padding: 7px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  &:hover { background: #f0f0f0; transform: scale(1.03); }
`;

/* ── data ── */
const MOCK_SOS = [
  { id: 1, nom: "Limbo Challenge",  heure: "18h00", destinataire: "Alex Blanc",  turne: "T-099", color: "grey"   },
  { id: 2, nom: "Selfie Fontaine",  heure: "12h00", destinataire: "Nina Moreau", turne: "T-143", color: "yellow" },
  { id: 3, nom: "Battle Dance",     heure: "20h00", destinataire: "Romain F.",   turne: "T-211", color: "grey"   },
  { id: 4, nom: "Pub Crawl Photo",  heure: "21h30", destinataire: "Chloé A.",    turne: "T-077", color: "yellow" },
  { id: 5, nom: "Vélo Tour",        heure: "10h30", destinataire: "Yann Gérard", turne: "T-255", color: "grey"   },
  { id: 6, nom: "Karaoké Express",  heure: "22h00", destinataire: "Léa Martin",  turne: "T-302", color: "yellow" },
  { id: 7, nom: "Yoga Surprise",    heure: "09h00", destinataire: "Tom Duval",   turne: "T-188", color: "grey"   },
];

export default function PageAccueil() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isYellow = sos => sos.color === "yellow";

  return (
    <>
      <GlobalStyle />
      <StylePage>

        {/* Topbar avatar */}
        <HomeTopbar>
          <div style={{ position: "relative" }}>
            <AvatarBtn onClick={() => setOpen(v => !v)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1A2E">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </AvatarBtn>
            {open && (
              <Dropdown onClick={() => setOpen(false)}>
                <DropItem onClick={() => navigate("/valides")}>SOS validés</DropItem>
                <DropItem onClick={() => navigate("/expires")}>SOS expirés</DropItem>
                <DropItem $danger>Déconnexion</DropItem>
              </Dropdown>
            )}
          </div>
        </HomeTopbar>

        {/* Hero */}
        <Hero>
          <Titre>MES SOS</Titre>
        </Hero>

        {/* Score block */}
        <ScoreBlock>
          <ScoreLeft>
            <ScoreLabel>Score total</ScoreLabel>
            <ScoreValue>240<ScoreUnit>pts</ScoreUnit></ScoreValue>
          </ScoreLeft>
          <ScoreRight>
            <ClassementBadge>
              <ClassementNum>4ème</ClassementNum>
              <ClassementSub>sur 8 listes</ClassementSub>
            </ClassementBadge>
          </ScoreRight>
        </ScoreBlock>

        {/* SOS list */}
        <SectionTitle>SOS en attente · {MOCK_SOS.length}</SectionTitle>
        <CardsList>
          {MOCK_SOS.map((sos, i) => (
            <SOSCardWrap
              key={sos.id}
              $yellow={isYellow(sos)}
              $delay={0.15 + i * 0.05}
            >
              <CardNom>{sos.nom}</CardNom>
              <CardMeta>{sos.heure}</CardMeta>
              <CardMeta>{sos.destinataire}</CardMeta>
              <CardMeta>{sos.turne}</CardMeta>
              <ValiderBtn onClick={() => navigate(`/valider/${sos.id}`)}>
                Valider le SOS
              </ValiderBtn>
            </SOSCardWrap>
          ))}
        </CardsList>

      </StylePage>
    </>
  );
}
