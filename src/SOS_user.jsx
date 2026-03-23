import { useState, useEffect } from 'react';
import './SOS_user.css';
import popBallonImg from './assets/pop_ballon.jpg';
import waitImg from './assets/wait.jpg';
import cdp1 from './assets/cdp1.jpeg';
import cdp2 from './assets/cdp.2.jpeg';
import cdp3 from './assets/cdp3.jpeg';
import cdp4 from './assets/cdp4.jpeg';
import cdp5 from './assets/cdp5.jpeg';

// Catégories de listes
const listCategories = [
  { id: 1, name: 'INSApocalypse', image: cdp1 },
  { id: 2, name: 'INSAmerica', image: cdp2 },
  { id: 3, name: 'INSAlorsLaZone', image: cdp3 },
  { id: 4, name:'INSAladdin', image: cdp4 },
  { id: 5, name: 'CDPunch', image: cdp5 },
];

const emergencyServices = [
  {
    id: 1,
    title: 'Pop the ballon',
    color: '#FF6B6B',
    description: 'On te trouve l amour de ta vie... sauf si ça éclate avant ',
    number: '15',
    image: popBallonImg,
  },
  {
    id: 2,
    icon: '🚒',
    title: 'Pompiers',
    color: '#FF4444',
    description: "Intervention d'urgence",
    number: '18',
  },
  {
    id: 3,
    icon: '🚓',
    title: 'Police',
    color: '#4169E1',
    description: "Forces de l'ordre",
    number: '17',
  },
  {
    id: 4,
    icon: '🚨',
    title: 'Gendarmerie',
    color: '#1E90FF',
    description: 'Police nationale',
    number: '17',
  },
  {
    id: 5,
    icon: '🦷',
    title: 'Dentiste SOS',
    color: '#9B59B6',
    description: 'Urgences dentaires',
    number: '112',
  },
  {
    id: 6,
    icon: '🐾',
    title: 'Vétérinaire',
    color: '#E74C3C',
    description: 'Urgences animales',
    number: '112',
  },
  {
    id: 7,
    icon: '🚗',
    title: 'Assistance Auto',
    color: '#F39C12',
    description: 'Dépannage routier',
    number: '112',
  },
  {
    id: 8,
    icon: '⚡',
    title: 'Électricien',
    color: '#F1C40F',
    description: 'Urgences électriques',
    number: '112',
  },
  {
    id: 9,
    icon: '⚖️',
    title: 'Aide Juridique',
    color: '#34495E',
    description: "Conseil légal d'urgence",
    number: '112',
  },
  {
    id: 10,
    icon: '🧠',
    title: 'Soutien Mental',
    color: '#16A085',
    description: 'Écoute et soutien',
    number: '3114',
  },
  {
    id: 11,
    icon: '💨',
    title: "Gaz d'Urgence",
    color: '#7F8C8D',
    description: 'Fuite de gaz',
    number: '0800555555',
  },
  {
    id: 12,
    icon: '👨‍🦽',
    title: 'Aide à la Personne',
    color: '#C0392B',
    description: 'Assistance sociale',
    number: '112',
  },
  {
    id: 13,
    icon: '☠️',
    title: 'Anti-Poison',
    color: '#2C3E50',
    description: 'Centre toxicologique',
    number: '0140054040',
  },
];

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const times = ['Matin', 'Après-midi', 'Soir'];

function SOS_user() {
  const [activePage, setActivePage] = useState('categories');
  const [selectedList, setSelectedList] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [mySOS, setMySOS] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSOS, setAvailableSOS] = useState(5); // Quota initial
  const [formData, setFormData] = useState({
    nomPote: '',
    numeroBat: '',
    numeroChambre: '',
    horaire: '',
    jour: daysOfWeek[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, horaire: time }));
  };

  useEffect(() => {
    const fetchMySOS = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/sos/tous');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur serveur');
        }
        setMySOS(data);

        // Calculer le nombre de SOS disponibles (quota de 13 par jour)
        const today = new Date().toDateString();
        const todaysSOS = data.filter(sos => {
          const sosDate = new Date(sos.dateCommande).toDateString();
          return sosDate === today;
        });
        const usedSOS = todaysSOS.length;
        setAvailableSOS(13 - usedSOS);

      } catch (err) {
        console.error('Erreur fetchMySOS:', err);
        setError('Impossible de charger vos SOS pour le moment.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMySOS();

    const onGlobalClick = (event) => {
      const target = event.target;
      if (target && target.textContent === 'Mes SOS') {
        setActivePage('mySOS');
        setShowProfileMenu(false);
      }
    };

    window.addEventListener('click', onGlobalClick);
    return () => {
      window.removeEventListener('click', onGlobalClick);
    };
  }, []);

  const handleCommande = async () => {
    console.log('handleCommande called');
    console.log('selectedList:', selectedList, typeof selectedList);
    console.log('selectedService:', selectedService);

    if (!formData.nomPote || !formData.numeroBat || !formData.numeroChambre || !formData.horaire) {
      alert('Veuillez remplir tous les champs!');
      return;
    }

    if (!selectedList) {
      alert('Veuillez sélectionner une liste CDP d\'abord.');
      return;
    }

    try {
      // Préparer les données pour l'API
      console.log('selectedList:', selectedList, 'type:', typeof selectedList);
      console.log('listCategories ids:', listCategories.map(cat => ({id: cat.id, type: typeof cat.id})));
      const selectedListData = listCategories.find(list => {
        console.log('Comparing', list.id, '(', typeof list.id, ') with', selectedList, '(', typeof selectedList, ')');
        return list.id == selectedList;
      });
      console.log('selectedListData:', selectedListData);
      const dataToSend = {
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        listeId: selectedList,
        listeName: selectedListData?.name || 'Liste inconnue',
        nomPote: formData.nomPote,
        numeroBat: formData.numeroBat,
        numeroChambre: formData.numeroChambre,
        jour: formData.jour,
        horaire: formData.horaire,
      };

      // Appel API au backend
      const response = await fetch('http://localhost:5000/api/sos/commande', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la commande');
      }

      // Succès ! Afficher un message et revenir au menu
      alert(`✅ SOS commandé avec succès!\n${formData.nomPote} - ${selectedService.title}`);

      // L'API renvoie { message, data: sos } ; on cible data
      const sosSaved = data.data || data;

      const newSOS = {
        ...sosSaved,
        status: sosSaved.status || 'en attente', // Garder pour compatibilité frontend
        etat: sosSaved.etat ?? 0,
        image: selectedService.image || null,
      };
      setMySOS((prev) => [newSOS, ...prev]);
      setAvailableSOS((prev) => prev - 1); // Décrémenter le quota

      // Réinitialiser le formulaire et revenir à la liste
      setFormData({
        nomPote: '',
        numeroBat: '',
        numeroChambre: '',
        horaire: '',
        jour: daysOfWeek[0],
      });
      setSelectedService(null);
      setSelectedList(null);
      setActivePage('mySOS');
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(`❌ Erreur: ${error.message}`);
    }
  };

  const canCancelSOS = (sos) => {
    if (!sos) return false;
    if (sos.etat === 1) return false; // Ne peut pas annuler si déjà confirmé
    const createdAt = sos.dateCommande ? new Date(sos.dateCommande) : new Date(sos.createdAt);
    const elapsedMin = (Date.now() - createdAt.getTime()) / (1000 * 60);
    return elapsedMin <= 30;
  };

  const cancelSOS = async (sosId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sos/${sosId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur annulation SOS');
      }
      alert('✅ SOS annulé avec succès');
      setMySOS((prev) => prev.filter((sos) => sos._id !== sosId && sos.id !== sosId));
      setAvailableSOS((prev) => prev + 1); // Incrémenter le compteur de SOS disponibles
    } catch (error) {
      console.error('❌ Erreur annulation SOS:', error);
      alert(`❌ ${error.message}`);
    }
  };

  // ===== PAGE 0: Mes SOS =====
  if (activePage === 'mySOS') {
    return (
      <div className="sos-main-container">
        <div className="sos-header-nav">
          <div className="navbar">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="" />
            </div>
            <h1 className="navbar-title">MES SOS</h1>
            <div className="profile-container">
              <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>👤</button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="menu-arrow"></div>
                  <div className="menu-item">Nom complet</div>
                  <hr />
                  <div className="menu-item"># SOS disponibles: {availableSOS}</div>
                  <hr />
                  <div className="menu-item" onClick={() => { setActivePage('categories'); setShowProfileMenu(false); }}>Nouveau SOS</div>
                  <hr />
                  <div className="menu-item logout">Déconnexion</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button className="back-btn-top" onClick={() => setActivePage('categories')}>← Retour</button>

        {isLoading && <p className="center-text">Chargement des SOS...</p>}
        {error && <p className="center-text error-text">{error}</p>}

        <div className="my-sos-grid">
          {mySOS.length === 0 && !isLoading && <div className="center-text">Aucun SOS enregistré pour le moment.</div>}
          {mySOS
            .sort((a, b) => (a.listeName || '').localeCompare(b.listeName || ''))
            .map((sos) => {
            const isConfirmed = sos.etat === 1; // 1 = confirmée
            const serviceData = emergencyServices.find(s => s.id === sos.serviceId);
            const hasImage = serviceData?.image;
            const imageSrc = isConfirmed && hasImage ? serviceData.image : (isConfirmed && !hasImage ? null : waitImg);
            return (
              <div key={sos._id || sos.id} className="my-sos-card" onClick={() => { setSelectedSOS(sos); setActivePage('recap'); }}>
                <div className="my-sos-image-wrapper">
                  {imageSrc ? (
                    <img src={imageSrc} alt={sos.serviceName} className="my-sos-image" />
                  ) : isConfirmed && !hasImage ? (
                    <div className="image-upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">Ajouter photo</div>
                    </div>
                  ) : (
                    <div className="empty_photo">Aucune photo</div>
                  )}
                </div>
                <div className="my-sos-content">
                  <div className="sos-list-name">{sos.listeName || 'Liste inconnue'}</div>
                  <h3>{sos.serviceName}</h3>
                  <p>{sos.nomPote} ({sos.jour} {sos.horaire})</p>
                </div>
                <span className={`status-badge ${isConfirmed ? 'confirmed' : 'pending'}`}>{isConfirmed ? 'Validé' : 'En cours'}</span>
                {canCancelSOS(sos) && (
                  <button
                    className="cancel-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (window.confirm('Voulez-vous annuler ce SOS ?')) cancelSOS(sos._id || sos.id);
                    }}
                  >
                    Annuler le sos
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activePage === 'recap' && selectedSOS) {
    const isConfirmed = selectedSOS.etat === 1; // 1 = confirmée
    const imageSrc = isConfirmed ? (selectedSOS.image || '') : waitImg;
    return (
      <div className="sos-main-container">
        <div className="sos-header-nav">
          <div className="navbar">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="" />
            </div>
            <h1 className="navbar-title">Récapitulatif</h1>
            <div className="profile-container">
              <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>👤</button>
            </div>
          </div>
        </div>
        <button className="back-btn-top" onClick={() => setActivePage('mySOS')}>← Retour</button>
        <div className="recap-card">
          <div className="recap-topbar" style={{ backgroundColor: isConfirmed ? '#28a745' : '#dc3545' }} />
          <div className="recap-image-container">
            {imageSrc ? <img src={imageSrc} alt="Photo du SOS" className="recap-image" /> : <div className="empty-photo-big">Aucune photo disponible</div>}
          </div>
          <h1 className="recap-title">{selectedSOS.serviceName}</h1>
          <p className="recap-state">{isConfirmed ? 'Votre SOS a été validé avec succès!' : 'SOS en attente - intervention en cours'}</p>
          <div className="recap-info">
            <p>Nom du pote: {selectedSOS.nomPote}</p>
            <p>Bâtiment: {selectedSOS.numeroBat}</p>
            <p>Chambre: {selectedSOS.numeroChambre}</p>
            <p>Jour: {selectedSOS.jour}</p>
            <p>Horaire: {selectedSOS.horaire}</p>
            <p>Statut: <strong>{isConfirmed ? 'Confirmée' : 'En cours'}</strong></p>
          </div>
          {!isConfirmed && <p className="waiting-text">En attente de traitement...</p>}
        </div>
      </div>
    );
  }

  // ===== PAGE 1: Grille de catégories =====
  if (activePage === 'categories') {
    return (
      <div className="sos-main-container">
        {/* Header avec navigation */}
        <div className="sos-header-nav">
          {/* Barre de navigation */}
          <div className="navbar">
            {/* Espace vide à gauche pour centrer le titre */}
            <div className="navbar-spacer"></div>

            {/* Titre au centre */}
            <h1 className="navbar-title">TROUVES UNE LISTE</h1>

            {/* Profil à droite */}
            <div className="profile-container">
              <button
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                👤
              </button>

              {/* Menu déroulant profil */}
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="menu-arrow"></div>
                  <div className="menu-item">Nom complet</div>
                  <hr />
                  <div className="menu-item"># SOS disponibles: {availableSOS}</div>
                  <hr />
                  <div className="menu-item" onClick={() => { setActivePage('mySOS'); setShowProfileMenu(false); }}>Mes SOS</div>
                  <hr />
                  <div className="menu-item logout">Déconnexion</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grille de catégories */}
        <div className="lists-grid">
          {listCategories.map((category, index) => (
            <div
              key={category.id}
              className={`category-card ${index % 2 === 0 ? 'gray' : 'pink'}`}
              onClick={() => { setSelectedList(category.id); setActivePage('services'); }}
            >
              <img src={category.image} alt={category.name} className="card-image-large" />
              <div className="card-title">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== PAGE 2: Grille des services pour une catégorie =====
  if (activePage === 'services') {
    return (
      <div className="sos-main-container">
        {/* Header avec navigation */}
        <div className="sos-header-nav">
          {/* Barre de navigation */}
          <div className="navbar">
            {/* Recherche à gauche */}
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="" />
            </div>

            {/* Titre au centre */}
            <h1 className="navbar-title">TROUVES TON SOS</h1>

            {/* Profil à droite */}
            <div className="profile-container">
              <button
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                👤
              </button>

              {/* Menu déroulant profil */}
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="menu-arrow"></div>
                  <div className="menu-item">Nom complet</div>
                  <hr />
                  <div className="menu-item"># SOS disponibles: {availableSOS}</div>
                  <hr />
                  <div className="menu-item" onClick={() => { setActivePage('mySOS'); setShowProfileMenu(false); }}>Mes SOS</div>
                  <hr />
                  <div className="menu-item logout">Déconnexion</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <button className="back-btn-top" onClick={() => { setSelectedList(null); setActivePage('categories'); }}>
          ← Retour
        </button>

        {/* Grille des services */}
        <div className="services-grid">
          {emergencyServices.map((service, index) => (
            <div
              key={service.id}
              className={`service-card ${index % 2 === 0 ? 'gray' : 'pink'}`}
              onClick={() => { setSelectedService(service); setActivePage('detail'); }}
            >
              {service.image ? (
                <img src={service.image} className="card-image" alt={service.title} />
              ) : (
                <div className="card-icon">{service.icon}</div>
              )}
              <div className="card-name">{service.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== PAGE 3: Détail du service et formulaire =====
  if (activePage === 'detail' && selectedService) {
    return (
      <div className="sos-main-container">
        {/* Header avec navigation */}
        <div className="sos-header-nav">
          {/* Barre de navigation */}
          <div className="navbar">
            {/* Espace vide à gauche pour centrer le titre */}
            <div className="navbar-spacer"></div>

            {/* Titre au centre */}
            <h1 className="navbar-title">TROUVES TON SOS</h1>

            {/* Profil à droite */}
            <div className="profile-container">
              <button
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                👤
              </button>

              {/* Menu déroulant profil */}
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="menu-arrow"></div>
                  <div className="menu-item">Nom complet</div>
                  <hr />
                  <div className="menu-item"># SOS disponibles: {availableSOS}</div>
                  <hr />
                  <div className="menu-item" onClick={() => { setActivePage('mySOS'); setShowProfileMenu(false); }}>Mes SOS</div>
                  <hr />
                  <div className="menu-item logout">Déconnexion</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <button className="back-btn-top" onClick={() => { setSelectedService(null); setActivePage('services'); }}>
          ← Retour
        </button>

        {/* Détail du service */}
        <div className="detail-card" style={{ borderTop: `8px solid ${selectedService.color}` }}>
          <div className="detail-icon">{selectedService.icon}</div>
          {selectedService.image && (
            <img
              src={selectedService.image}
              className="detail-image"
              alt={selectedService.title}
            />
          )}
          <h1>{selectedService.title}</h1>
          <p className="detail-description">{selectedService.description}</p>
          <div className="contact-section">
            <p className="contact-label">Numéro du SOS:</p>
            <p className="contact-number">{selectedService.number}</p>
          </div>
          <div className="form-section">
            <div className="form-group">
              <label>Nom du pote:</label>
              <input
                type="text"
                name="nomPote"
                placeholder="Écris le nom..."
                value={formData.nomPote}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Numéro de bat:</label>
              <input
                type="text"
                name="numeroBat"
                placeholder="Écris le numéro..."
                value={formData.numeroBat}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Numéro de chambre:</label>
              <input
                type="text"
                name="numeroChambre"
                placeholder="Écris le numéro..."
                value={formData.numeroChambre}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Horaire:</label>
              <div className="radio-group">
                {times.map((time) => (
                  <label key={time} className="radio-label">
                    <input
                      type="radio"
                      name="horaire"
                      value={time}
                      checked={formData.horaire === time}
                      onChange={() => handleTimeChange(time)}
                    />
                    <span className="radio-text">{time}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Jour:</label>
              <select name="jour" value={formData.jour} onChange={handleInputChange}>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="command-btn"
              style={{ backgroundColor: selectedService.color }}
              onClick={handleCommande}
            >
              ☎️ Commande le SOS
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SOS_user;
