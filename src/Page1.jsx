import styled from 'styled-components';

const MyStyle = styled.h3`
  padding: 1% 0%;
  background-color: #d84800;
  color: white;
  border-radius: 25px;
  text-align: center;
  font-size: 100%;
  margin: 0% 35% 0%;
`;

const StyleSOSs = styled.h3`
  padding: 1% 0%;
  background-color: #d84800;
  color: white;
  border-radius: 25px;
  text-align: center;
  font-size: 100%;
  margin: 1% 2% 0%;
`;

const StyleSOS = styled.h3`
  padding: 0.5% 0%;
  background-color: #e4d1c7;
  color: black;
  border-radius: 25px;
  text-align: center;
  font-size: 100%;
  width: 45%;
  margin: 1% 2% 0%;
  position: relative;
  z-index: 2;
`;

const StyleSpeSOS = styled.h3`
  padding: 0.5% 0%;
  background-color: #f1e8e3;
  color: black;
  border-radius: 25px;
  text-align: left;
  font-size: 100%;
  width: 90%;
  margin: -1.5% 4% 0%;
  border: 7px solid #f1e8e3;
  position: relative;
  z-index: 1;
  }
`;

function SOS (props) {
    return (
        <>
        <StyleSOS>
            <h3>SOS {props.num}</h3>
        </StyleSOS>
        <StyleSpeSOS>
            <h4>Heure du SOS</h4>
            <h4>Destinataire du SOS</h4>
            <h4>Turne cible</h4>
        </StyleSpeSOS>
        </>
    );
}

function MenuSOS () {
    return (
        <>
        <h2>SOS reçus</h2>
        <SOS num = "1" />
        <SOS num = "2" />
        <SOS num = "3" />
        </>
    );
}

function Score () {
    return (
        <h1>Score</h1>
    );
}

function PageCDP () {
    return (
        <>
        <MyStyle>
            <Score />
        </MyStyle>
        <StyleSOSs>
            <MenuSOS />
        </StyleSOSs>
        </>
    );
}

export default PageCDP;