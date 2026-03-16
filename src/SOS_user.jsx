import { useState } from 'react';
import './SOS_user.css';
import popBallonImg from './assets/pop_ballon.jpg';


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
  const [selectedService, setSelectedService] = useState(null);
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

  const handleCommande = () => {
    if (!formData.nomPote || !formData.numeroBat || !formData.numeroChambre || !formData.horaire) {
      alert('Veuillez remplir tous les champs!');
      return;
    }

    alert(
      `SOS commandé pour ${formData.nomPote} en Bat ${formData.numeroBat} Ch ${formData.numeroChambre}\n${formData.jour} - ${formData.horaire}`
    );
    setFormData({
      nomPote: '',
      numeroBat: '',
      numeroChambre: '',
      horaire: '',
      jour: daysOfWeek[0],
    });
  };

  if (selectedService) {
    return (
      <div className="sos-detail-page">
        <button className="back-btn" onClick={() => setSelectedService(null)}>
          ← Retour
        </button>
        <div className="detail-card" style={{ borderTop: `8px solid ${selectedService.color}` }}>
          <div className="detail-icon">{selectedService.icon}</div>
          {selectedService.image && <img src={selectedService.image} className="detail-image" alt={selectedService.title} />}
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
            <button className="command-btn" style={{ backgroundColor: selectedService.color }} onClick={handleCommande}>
              ☎️ Commande le SOS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sos-container">
      <div className="sos-header">
        <h1 className="sos-title">🆘 SOS INSAMERICA 🆘</h1>
        <p className="sos-subtitle">Clique sur un SOS pour + d'infos!</p>
      </div>
      <div className="sos-bars">
        {emergencyServices.map((service) => (
          <div
            key={service.id}
            className="sos-bar"
            style={{ backgroundColor: service.color }}
            onClick={() => setSelectedService(service)}
          >
            <div className="bar-content">
              <span className="bar-icon">{service.icon}</span>
              <span className="bar-title">{service.title}</span>
              <span className="bar-dots">•••</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SOS_user;
