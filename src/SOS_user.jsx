import { useState } from 'react';
import './SOS_user.css';

const SOS_user = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    buildingNumber: '',
    roomNumber: '',
    timeSlot: 'Matin',
    day: 'Lundi',
  });

  const emergencyServices = [
    {
      id: 1,
      icon: '🏥',
      title: 'Urgences Médicales',
      color: '#FF6B6B',
      description: 'Pour toute urgence médicale ou blessure',
      number: '15',
    },
    {
      id: 2,
      icon: '🚨',
      title: 'Pompiers',
      color: '#FFA500',
      description: 'Incendie, accident, sauvetage',
      number: '18',
    },
    {
      id: 3,
      icon: '👮',
      title: 'Police',
      color: '#4169E1',
      description: 'Vol, agression, urgence sécurité',
      number: '17',
    },
    {
      id: 4,
      icon: '☠️',
      title: 'Intoxication',
      color: '#9B59B6',
      description: 'Empoisonnement, overdose, intoxication',
      number: '112',
    },
    {
      id: 5,
      icon: '🧠',
      title: 'Détresse Psychologique',
      color: '#E74C3C',
      description: 'Soutien psychologique et d\'écoute',
      number: '3114',
    },
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    // Reset form when changing service
    setFormData({
      name: '',
      buildingNumber: '',
      roomNumber: '',
      timeSlot: 'Matin',
      day: 'Lundi',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      timeSlot: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verify all fields are filled
    if (
      !formData.name.trim() ||
      !formData.buildingNumber.trim() ||
      !formData.roomNumber.trim()
    ) {
      alert('❌ Veuillez remplir tous les champs du formulaire !');
      return;
    }

    // Show success message with form data
    const message = `
📋 Commande SOS Confirmée !

Service: ${selectedService.title}
Numéro: ${selectedService.number}

👤 Informations du copain:
Nom: ${formData.name}
Bâtiment: ${formData.buildingNumber}
Chambre: ${formData.roomNumber}

⏰ Horaire: ${formData.timeSlot}
📅 Jour: ${formData.day}

L'équipe de ${selectedService.title} a été alertée !
    `;

    alert(message);

    // Reset form
    setFormData({
      name: '',
      buildingNumber: '',
      roomNumber: '',
      timeSlot: 'Matin',
      day: 'Lundi',
    });
  };

  const handleBackClick = () => {
    setSelectedService(null);
  };

  if (selectedService) {
    return (
      <div className="sos-detail-page">
        <button className="back-btn" onClick={handleBackClick}>
          ← Retour
        </button>

        <div className="service-hero">
          <div className="service-icon-large">{selectedService.icon}</div>
          <h1 className="service-title">{selectedService.title}</h1>
          <p className="service-description">{selectedService.description}</p>
        </div>

        <div className="emergency-number-box">
          <span className="emergency-label">Numéro SOS:</span>
          <span className="emergency-number">{selectedService.number}</span>
        </div>

        <form className="sos-form" onSubmit={handleSubmit}>
          <h2 className="form-title">📞 Commande SOS pour un ami</h2>

          <div className="form-group">
            <label htmlFor="name">Nom du copain:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Jean Dupont"
              className="input-field"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="buildingNumber">Numéro de bâtiment:</label>
              <input
                type="text"
                id="buildingNumber"
                name="buildingNumber"
                value={formData.buildingNumber}
                onChange={handleInputChange}
                placeholder="Ex: A"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomNumber">Numéro de chambre:</label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="Ex: 304"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Horaire:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeSlot"
                  value="Matin"
                  checked={formData.timeSlot === 'Matin'}
                  onChange={handleRadioChange}
                />
                🌅 Matin
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeSlot"
                  value="Après-midi"
                  checked={formData.timeSlot === 'Après-midi'}
                  onChange={handleRadioChange}
                />
                ☀️ Après-midi
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="timeSlot"
                  value="Soir"
                  checked={formData.timeSlot === 'Soir'}
                  onChange={handleRadioChange}
                />
                🌙 Soir
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="day">Jour:</label>
            <select
              id="day"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="select-field"
            >
              <option value="Lundi">Lundi</option>
              <option value="Mardi">Mardi</option>
              <option value="Mercredi">Mercredi</option>
              <option value="Jeudi">Jeudi</option>
              <option value="Vendredi">Vendredi</option>
              <option value="Samedi">Samedi</option>
              <option value="Dimanche">Dimanche</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            ☎️ Commande le SOS
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="sos-container">
      <h1 className="sos-title">🆘 SOS INSAMERICA 🆘</h1>
      <p className="sos-subtitle">
        Trouve l'aide dont tu as besoin en cas d'urgence
      </p>

      <div className="services-grid">
        {emergencyServices.map((service) => (
          <div
            key={service.id}
            className="service-bar"
            style={{ backgroundColor: service.color }}
            onClick={() => handleServiceClick(service)}
          >
            <span className="service-icon">{service.icon}</span>
            <div className="service-info">
              <h3 className="service-name">{service.title}</h3>
              <p className="service-quick-desc">{service.number}</p>
            </div>
            <span className="arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOS_user;
