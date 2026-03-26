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

// Listes de SOS pour chaque catégorie
const sosPerCategory = {
  1: [ // INSApocalypse
    { id: 1, icon: '🎪', title: 'Minute de silence', color: '#FF6B6B', description: 'Spectacle chaotique', number: '15' },
    { id: 2, icon: '🚀', title: 'Ration de survie', color: '#FF4444', description: 'Évacuation urgente', number: '18' },
    { id: 3, icon: '🛡️', title: 'Arrestation du patient 0', color: '#4169E1', description: 'Refuge protégé', number: '17' },
    { id: 4, icon: '💣', title: 'Réveil en beauté', color: '#1E90FF', description: 'Enlèvement dangers', number: '17' },
    { id: 5, icon: '🔥', title: 'Discours fin du monde', color: '#9B59B6', description: 'Cas critiques', number: '112' },
    { id: 6, icon: '❄️', title: 'Quarantaine', color: '#E74C3C', description: 'Zone cool', number: '112' },
    { id: 7, icon: '⚡', title: 'Alerte fin du monde', color: '#F39C12', description: 'Réparation rapide', number: '112' },
    { id: 8, icon: '🌪️', title: 'Tempête Contrôle', color: '#F1C40F', description: 'Stabilisation', number: '112' },
    { id: 9, icon: '🧬', title: 'Opération zone toxique', color: '#34495E', description: 'Aide technologique', number: '112' },
    { id: 10, icon: '🤖', title: 'Réveil musclé', color: '#16A085', description: 'Assistance mécanique', number: '3114' },
    { id: 11, icon: '💥', title: 'Leçon de tir', color: '#7F8C8D', description: 'Gestion crises', number: '0800555555' },
    { id: 12, icon: '🎬', title: 'Réalisateur SOS', color: '#C0392B', description: 'Production urgente', number: '112' },
  ],
  2: [ // INSAmerica
    { id: 1, icon: '🤠', title: 'Cowboy Rescue', color: '#FF6B6B', description: 'Western urgence', number: '15' },
    { id: 2, icon: '🦅', title: 'Eagle Air Force', color: '#FF4444', description: 'Intervention aérienne', number: '18' },
    { id: 3, icon: '🏈', title: 'Super Bowl SOS', color: '#4169E1', description: 'Match urgence', number: '17' },
    { id: 4, icon: '🗽', title: 'Statue Liberté', color: '#1E90FF', description: 'Assistance NYC', number: '17' },
    { id: 5, icon: '🍔', title: 'Fast Food Doctor', color: '#9B59B6', description: 'Nutrition rush', number: '112' },
    { id: 6, icon: '🚙', title: 'Pickup Truck', color: '#E74C3C', description: 'Transport rapide', number: '112' },
    { id: 7, icon: '🎸', title: 'Rock Band SOS', color: '#F39C12', description: 'Orchestre urgence', number: '112' },
    { id: 8, icon: '⛺', title: 'Camping Shelter', color: '#F1C40F', description: 'Bivouac secours', number: '112' },
    { id: 9, icon: '🌭', title: 'BBQ Master', color: '#34495E', description: 'Cuisine urgence', number: '112' },
    { id: 10, icon: '🎡', title: 'Parc Aventure', color: '#16A085', description: 'Attraction SOS', number: '3114' },
    { id: 11, icon: '💰', title: 'Money Maker', color: '#7F8C8D', description: 'Conseil financier', number: '0800555555' },
  ],
  3: [ // INSAlorsLaZone
    { id: 1, icon: '🏜️', title: 'Désert SOS', color: '#FF6B6B', description: 'Survie zone aride', number: '15' },
    { id: 2, icon: '🐪', title: 'Caravane Express', color: '#FF4444', description: 'Transport dunes', number: '18' },
    { id: 3, icon: '⛵', title: 'Bateau Zone', color: '#4169E1', description: 'Navigation urgence', number: '17' },
    { id: 4, icon: '🏝️', title: 'Île Refuge', color: '#1E90FF', description: 'Abri paradis', number: '17' },
    { id: 5, icon: '🔦', title: 'Lampe Torche SOS', color: '#9B59B6', description: 'Lumière urgence', number: '112' },
    { id: 6, icon: '🧭', title: 'Navigateur Zone', color: '#E74C3C', description: 'Orientation GPS', number: '112' },
    { id: 7, icon: '⛺', title: 'Tente Camping', color: '#F39C12', description: 'Abri mobile', number: '112' },
    { id: 8, icon: '🌍', title: 'Explorateur SOS', color: '#F1C40F', description: 'Expédition urgence', number: '112' },
    { id: 9, icon: '📡', title: 'Signal Relay', color: '#34495E', description: 'Communication zone', number: '112' },
    { id: 10, icon: '🥾', title: 'Trek Randonnée', color: '#16A085', description: 'Marche urgence', number: '3114' },
    { id: 11, icon: '🪨', title: 'Escalade Rescue', color: '#7F8C8D', description: 'Descente urgence', number: '0800555555' },
  ],
  4: [ // INSAladdin
    { id: 1, icon: '🧞', title: 'Génie Magique', color: '#FF6B6B', description: '3 vœux urgents', number: '15' },
    { id: 2, icon: '🐪', title: 'Tapis Volant SOS', color: '#FF4444', description: 'Transport aérien', number: '18' },
    { id: 3, icon: '⚔️', title: 'Sabre Protecteur', color: '#4169E1', description: 'Protection royale', number: '17' },
    { id: 4, icon: '🏰', title: 'Palais d\'Urgence', color: '#1E90FF', description: 'Refuge princier', number: '17' },
    { id: 5, icon: '💎', title: 'Bijoux de Chance', color: '#9B59B6', description: 'Trésor sauveur', number: '112' },
    { id: 6, icon: '🎭', title: 'Spectacle Magie', color: '#E74C3C', description: 'Illusion salvatrice', number: '112' },
    { id: 7, icon: '🌹', title: 'Rose Éternelle', color: '#F39C12', description: 'Beauté curieuse', number: '112' },
    { id: 8, icon: '👑', title: 'Couronne Royale', color: '#F1C40F', description: 'Pouvoir urgent', number: '112' },
    { id: 9, icon: '🕌', title: 'Temple Caché', color: '#34495E', description: 'Sanctuaire secret', number: '112' },
    { id: 10, icon: '🌙', title: 'Nuit Mystique', color: '#16A085', description: 'Magie nocturne', number: '3114' },
    { id: 11, icon: '✨', title: 'Étincelles SOS', color: '#7F8C8D', description: 'Lumière magique', number: '0800555555' },
  ],
  5: [ // CDPunch
    { id: 1, icon: '👊', title: 'Punch Ultime', color: '#FF6B6B', description: 'Combat SOS', number: '15' },
    { id: 2, icon: '🥋', title: 'Maître Karaté', color: '#FF4444', description: 'Arts martiaux', number: '18' },
    { id: 3, icon: '💪', title: 'Musclé Super', color: '#4169E1', description: 'Renfort physique', number: '17' },
    { id: 4, icon: '🏆', title: 'Champion SOS', color: '#1E90FF', description: 'Victoire urgente', number: '17' },
    { id: 5, icon: '⚽', title: 'Football Action', color: '#9B59B6', description: 'Match urgence', number: '112' },
    { id: 6, icon: '🎖️', title: 'Médaille Honneur', color: '#E74C3C', description: 'Reconnaissance SOS', number: '112' },
    { id: 7, icon: '🥊', title: 'Boxeur Pro', color: '#F39C12', description: 'Combat pro urgence', number: '112' },
    { id: 8, icon: '🏅', title: 'Premier Podium', color: '#F1C40F', description: 'Victoire urgente', number: '112' },
    { id: 9, icon: '⛹️', title: 'Basketteur SOS', color: '#34495E', description: 'Slam dunk urgence', number: '112' },
    { id: 10, icon: '🎯', title: 'Tir Précis', color: '#16A085', description: 'Cible urgence', number: '3114' },
    { id: 11, icon: '🚴', title: 'Cycliste Express', color: '#7F8C8D', description: 'Vitesse urgence', number: '0800555555' },
  ],
};

// Fonction pour obtenir les services de la catégorie sélectionnée
const getServicesForCategory = (categoryId) => {
  return sosPerCategory[categoryId] || [];
};

// Fonction pour obtenir un service par son ID (cherche dans toutes les catégories)
const getServiceById = (serviceId) => {
  for (const categoryServices of Object.values(sosPerCategory)) {
    const service = categoryServices.find(s => s.id === serviceId);
    if (service) return service;
  }
  return null;
};

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
  const [availableSOS, setAvailableSOS] = useState(6); // Quota initial
  const [formData, setFormData] = useState({
    nomPote: '',
    numeroBat: '',
    numeroChambre: '',
    horaire: '',
    jour: daysOfWeek[0],
  });
  const [searchTerm, setSearchTerm] = useState('');

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
        setAvailableSOS(6 - usedSOS);

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
      const dataToSend = {
        serviceId: selectedService.id,
        listeId: selectedList,
        nomPote: formData.nomPote,
        numeroBat: formData.numeroBat,
        numeroChambre: formData.numeroChambre,
        jour: formData.jour,
        horaire: formData.horaire,
      };

      console.log('📨 Données à envoyer:', dataToSend);

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
            .sort((a, b) => (a.listeId?.name || '').localeCompare(b.listeId?.name || ''))
            .map((sos) => {
            const isConfirmed = sos.etat === 1; // 1 = confirmée
            const serviceTitle = sos.sosId?.title || 'Service inconnu';
            const serviceImage = sos.sosId?.image;
            const imageSrc = isConfirmed && serviceImage ? serviceImage : (isConfirmed && !serviceImage ? null : waitImg);
            return (
              <div key={sos._id || sos.id} className="my-sos-card" onClick={() => { setSelectedSOS(sos); setActivePage('recap'); }}>
                <div className="my-sos-image-wrapper">
                  {imageSrc ? (
                    <img src={imageSrc} alt={serviceTitle} className="my-sos-image" />
                  ) : isConfirmed && !serviceImage ? (
                    <div className="image-upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">Ajouter photo</div>
                    </div>
                  ) : (
                    <div className="empty_photo">Aucune photo</div>
                  )}
                </div>
                <div className="my-sos-content">
                  <div className="sos-list-name">{sos.listeId?.name || 'Liste inconnue'}</div>
                  <h3>{serviceTitle}</h3>
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
          <h1 className="recap-title">{selectedSOS.sosId?.title || 'Service inconnu'}</h1>
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
    // 🔍 LOGIQUE DE RECHERCHE
    const searchLower = searchTerm.toLowerCase().trim();
    
    const calculateScore = (service) => {
      if (!searchLower) return 999; // Score neutre si recherche vide
      
      const titleLower = service.title.toLowerCase();
      const descriptionLower = service.description.toLowerCase();
      
      // Score 3: titre commence par la recherche
      if (titleLower.startsWith(searchLower)) return 3;
      
      // Score 2: titre contient la recherche
      if (titleLower.includes(searchLower)) return 2;
      
      // Score 1: description contient la recherche
      if (descriptionLower.includes(searchLower)) return 1;
      
      // Score 0: pas de match
      return 0;
    };
    
    // Obtenir les services de la catégorie et filtrer/trier
    const allServices = getServicesForCategory(selectedList);
    const filteredServices = searchLower 
      ? allServices
          .map(service => ({ ...service, score: calculateScore(service) }))
          .filter(service => service.score > 0)
          .sort((a, b) => {
            // Trier par score décroissant, puis alphabétique
            if (b.score !== a.score) return b.score - a.score;
            return a.title.localeCompare(b.title);
          })
      : allServices; // Si recherche vide, afficher tous normalement
    
    return (
      <div className="sos-main-container">
        {/* Header avec navigation */}
        <div className="sos-header-nav">
          {/* Barre de navigation */}
          <div className="navbar">
            {/* Recherche à gauche */}
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
          {filteredServices.length === 0 ? (
            <div className="center-text">Aucun SOS trouvé</div>
          ) : (
            filteredServices.map((service, index) => (
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
            ))
          )}
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
              <select
                name="numeroBat"
                value={formData.numeroBat}
                onChange={handleInputChange}
              >
                <option value="">Choisis un bâtiment...</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="form-group">
              <label>Numéro de chambre:</label>
              <input
                type="number"
                name="numeroChambre"
                placeholder="Écris le numéro..."
                value={formData.numeroChambre}
                onChange={handleInputChange}
                min="1"
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
