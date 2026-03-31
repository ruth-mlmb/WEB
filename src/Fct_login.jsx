import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Profil() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div>
            <h1>{location.state?.login || 'Profil'}</h1>
            <button onClick={() => navigate('/login_user/mes-sos')} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#f5e8eb', fontSize: '1rem', fontWeight: 'bold' }}>
                📦 Mes SOS
            </button>
        </div>
    );
}

function Liste() {
    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('cdp_listeId');
        if (id) {
            navigate('/home');
        } else {
            navigate('/login_cdp');
        }
    }, [navigate]);

    return <div>Redirection...</div>;
}

function BDE() {
    return <h1> Espace du Bureau des élèves </h1>;
}

function LoginUser() {
    const navigate = useNavigate();
    const [login, setLogin] = useState('pnom');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/cdp/login_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login }),
        })
            .then((res) => res.json())
            .then((data) => {
                // Stocker le userId pour les SOS
                localStorage.setItem('userId', login);
                navigate('/login_user/profil', { state: { login: data.pnom } });
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="login">
            <h1 className="titre-login"> Authentification </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom d'utilisateur :
                    <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
                </label>
                <button type="submit"> Se connecter </button>
            </form>
        </div>
    );
}

function LoginCDP() {
    const navigate = useNavigate();
    const [nom, setNom] = useState('NomListe');
    const [mdp, setMdp] = useState('mdp');
    const [erreur, setErreur] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/cdp/login_cdp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, mdp }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.id_liste === 'erreur') {
                    setErreur(true);
                    return;
                }
                const listeId = data.listeId ?? data.id_liste;
                localStorage.setItem('cdp_listeId', listeId);
                localStorage.setItem('cdp_listeName', data.listeName ?? nom);
                setErreur(false);
                navigate('/home');
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="login">
            <h1 className="titre-login"> Authentification des CDP </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom de liste :
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                </label>
                <label>
                    Mot de passe :
                    <input type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} />
                </label>
                <button type="submit"> Se connecter </button>
            </form>
            {erreur && <p>Login ou mot de passe incorrect</p>}
        </div>
    );
}

function LoginBDE() {
    const navigate = useNavigate();
    const [nom, setNom] = useState('Login');
    const [mdp, setMdp] = useState('mdp');
    const [erreur, setErreur] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/cdp/login_bde', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, mdp }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.id_bde === 'erreur') {
                    setErreur(true);
                    return;
                }
                navigate('/login_bde/bde');
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="login">
            <h1 className="titre-login"> Authentification du BDE </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Login :
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                </label>
                <label>
                    Mot de passe :
                    <input type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} />
                </label>
                <button type="submit"> Se connecter </button>
            </form>
            {erreur && <p>Login ou mot de passe incorrect</p>}
        </div>
    );
}

export { Profil, Liste, BDE, LoginUser, LoginCDP, LoginBDE };
