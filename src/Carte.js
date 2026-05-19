import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger les icônes Leaflet (bug de build / webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Calculer la distance entre 2 points GPS (formule de Haversine en km)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretProche, setArretProche] = useState(null);
  const DAKAR = [14.6928, -17.4467];

  // 1. Charger les arrêts depuis l'API Flask
  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrêts:", err));
  }, []);

  // 2. Géolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([pos.coords.latitude, pos.coords.longitude]);
        },
        () => console.log("Géolocalisation refusée")
      );
    }
  }, []);

  // 3. Trouver l'arrêt le plus proche dynamiquement
  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {
      let proche = null;
      let dMin = Infinity;
      
      arrets.forEach(a => {
        const d = calculerDistance(positionUtilisateur[0], positionUtilisateur[1], a.lat, a.lon);
        if (d < dMin) {
          dMin = d;
          proche = { ...a, distance: d };
        }
      });
      setArretProche(proche);
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2>Carte des arrêts</h2>

      {/* Bannière d'information pour l'arrêt le plus proche */}
      {arretProche && (
        <div className="info-proximite">
          <p>
            📍 <strong>Arrêt le plus proche :</strong> {arretProche.nom} ({arretProche.distance.toFixed(1)} km)
          </p>
        </div>
      )}

      {/* Conteneur de la carte Leaflet */}
      <MapContainer center={DAKAR} zoom={13} style={{ height: "450px", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueurs pour tous les arrêts de bus de l'API */}
        {arrets.map(a => (
          <Marker key={a.id} position={[a.lat, a.lon]}>
            <Popup>
              <strong>{a.nom}</strong>
              <br />
              Lignes : {a.lignes.join(", ")}
            </Popup>
          </Marker>
        ))}

        {/* Marqueur distinct pour la position de l'utilisateur */}
        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>🎯 Vous êtes ici</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Carte;