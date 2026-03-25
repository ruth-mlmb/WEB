import styled from 'styled-components';
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
`;

const StylePage = styled.div`
  background-color: #fff8f8;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const StyleTitre = styled.h1`
  font-size: 400%;
  font-weight: 900;
  letter-spacing: 5%;
  text-align: center;
  color: #333;
  margin: 4% 0% 3%;

  text-shadow: 3px 3px 8px rgba(0,0,0,0.25);

  display: inline-block;
  transform: perspective(300px) rotateX(-35deg);
`;

const StyleScore = styled.button`
  padding: 0.5% 10%;
  background-color: #d9d9d9;
  color: black;
  border-radius: 25px;
  text-align: center;
  font-size: 100%;
  margin: 1% 35% 2%;
`;

const StyleSOS = styled.button`
  padding: 1% 3%;
  color: black;
  border-radius: 25px;
  text-align: center;
  font-size: 90%;
  margin: 1% 2% 0%;
`;

const SOS1 = styled(StyleSOS)`
  background-color: #d9d9d9;
`

const SOS2 = styled(StyleSOS)`
  background-color: #ffd374;
`
const StyleValid = styled.button`
  padding: 5% 14%;
  color: black;
  border-radius: 25px;
  text-align: center;
  font-size: 90%;
  margin: 4% 2% 0%;
  background-color: #ffffff;
`;

function Valid() {
  const clicked = () => {
    alert("Clicked!");
  }

  return (
    <p onClick={clicked}>Valider le SOS</p>
  );
}

function SOS () {
    return (
        <>
            <h3>SOS</h3>
            <p>Heure du SOS</p>
            <p>Destinataire du SOS</p>
            <p>Turne cible</p>
            <StyleValid>
                <Valid />
            </StyleValid>
        </>
    );
}

function Score () {
    return (
        <>
          <h1>Score</h1>
          <p>Classement actuel</p>
        </>
    );
}

function PageCDP () {
    return (
        <>
            <GlobalStyle />
            <StylePage>
                <StyleTitre>
                    <p>MES SOS</p>
                </StyleTitre>
                <StyleScore>
                    <Score />
                </StyleScore>
                <>
                <SOS1>
                    <SOS />
                </SOS1>
                <SOS2>
                    <SOS />
                </SOS2>
                <SOS1>
                    <SOS />
                </SOS1>
                <SOS2>
                    <SOS />
                </SOS2>
                <SOS1>
                    <SOS />
                </SOS1>
                <SOS2>
                    <SOS />
                </SOS2>
                <SOS1>
                    <SOS />
                </SOS1>
                <SOS2>
                    <SOS />
                </SOS2>
                <SOS1>
                    <SOS />
                </SOS1>
                <SOS2>
                    <SOS />
                </SOS2>
                <SOS1>
                    <SOS />
                </SOS1>
                <SOS2>
                    <SOS />
                </SOS2>
                <SOS1>
                    <SOS />
                </SOS1>
                <SOS2>
                    <SOS />
                </SOS2>
                </>
            </StylePage>
        </>
    );
}

export default PageCDP;