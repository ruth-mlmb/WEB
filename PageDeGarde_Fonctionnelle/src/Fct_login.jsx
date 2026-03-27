import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Profil() {
    const location = useLocation();
    console.log("Location state");
    console.log(location.state);
    return (
        <div>
            <h1> {location.state.login} </h1>
        </div>
    );
}

function Liste() {
  const location = useLocation();
    console.log("Location state");
    console.log(location.state);
    return (
        <div>
            <h1> {location.state.id} </h1>
        </div>
    );
}

function BDE() {
  return(
    <h1> Espace du Bureau des élèves </h1>
  );
}

function LoginUser() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("pnom");
    
    const handleSubmit = (e) => {
      e.preventDefault()
      console.log("Login envoyé:", login);
      fetch("http://localhost:5000/login_user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: login })
      })
      .then(response => response.json())
      .then(data => {
      console.log("Réponse du serveur:", data);
        navigate('/login_user/profil', { state: { login: data.pnom } });
      console.log("Recuperer",data.pnom);
      })
      
    }
    
    return (
      <div className="login">
        <h1 className='titre-login'> Authentification </h1>
        <form onSubmit={handleSubmit}>
          <label> Nom d'utilisateur :  
              <input
              type="text" 
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              />
          </label>
          <button type="submit"> Se connecter </button>
        </form>
      </div>
    );
}

function LoginCDP() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("NomListe");
  const [mdp, setMdp] = useState("mdp");
  const [erreur, setErreur] = useState(false);

  const handleSubmit = (e) => {
      e.preventDefault()
      console.log("Nom de liste :", nom);
      console.log("Mot de passe :", mdp);  

      fetch("http://localhost:5000/login_cdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: nom, mdp: mdp })
      })  
      .then(response => response.json())
      .then(data => {
      console.log("Réponse du serveur:", data);
        if (data.id_liste === "erreur") {
          setErreur(true);
          console.log("Erreur de connexion pour la liste:", nom);
          return;
        } else {
          navigate('/login_cdp/liste', { state: { id: data.id_liste } });
        }
      console.log("Recuperer",data.id_liste);
      })  
    }

  return (
      <div className="login">
        <h1 className='titre-login'> Authentification des CDP </h1>
        <form onSubmit={handleSubmit}>
          <label> Nom de liste :  
              <input
              type="text" 
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              />
          </label>
          <label> Mot de passe :  
              <input
              type="password" 
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              />
          </label>
          <button type="submit"> Se connecter </button>
        </form>
        {erreur && <p>Login ou mot de passe incorrect</p>}
      </div>
    );


}

function LoginBDE() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("Login");
  const [mdp, setMdp] = useState("mdp");
  const [erreur, setErreur] = useState(false);

  const handleSubmit = (e) => {
      e.preventDefault()
      console.log("Nom du BDE :", nom);
      console.log("Mot de passe :", mdp);  

      fetch("http://localhost:5000/login_bde", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom: nom, mdp: mdp })
      })  
      .then(response => response.json())
      .then(data => {
      console.log("Réponse du serveur:", data);
        if (data.id_bde === "erreur") {
          setErreur(true);
          console.log("Erreur de connexion pour le BDE:", nom);
          return;
        } else {
          navigate('/login_bde/bde',);
        }
      }
      )  
    }

  return (
      <div className="login">
        <h1 className='titre-login'> Authentification du BDE </h1>
        <form onSubmit={handleSubmit}>
          <label> Login :  
              <input
              type="text" 
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              />
          </label>
          <label> Mot de passe :  
              <input
              type="password" 
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              />
          </label>
          <button type="submit"> Se connecter </button>
        </form>
        {erreur && <p>Login ou mot de passe incorrect</p>}
      </div>
    );


}

export { Profil, Liste, BDE, LoginUser, LoginCDP, LoginBDE };