import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger les icones Leaflet (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Calculer la distance entre 2 points GPS (km)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Composant pour le bouton "Centrer sur ma position"
function CenterButton({ position }) {
  const map = useMap();
  
  if (!position) return null;
  
  return (
    <button 
      onClick={() => map.setView(position, 15)}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '8px 12px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      📍 Ma position
    </button>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretsProches, setArretsProches] = useState([]);
  const DAKAR = [14.6928, -17.4467];

  // Charger les arrets depuis Flask
  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrets:", err));
  }, []);

  // Geolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([
            pos.coords.latitude,
            pos.coords.longitude
          ]);
        },
        () => console.log("Geolocation refusee")
      );
    }
  }, []);

 // Trouver les 3 arrets les plus proches
useEffect(() => {
  if (positionUtilisateur && arrets.length > 0) {
    // Calculer la distance pour TOUS les arrêts
    const arrets_avec_distance = arrets.map(a => ({
      ...a,
      distance: calculerDistance(
        positionUtilisateur[0],
        positionUtilisateur[1],
        a.lat,
        a.lon
      )
    }));
    
    // Trier par distance (du plus proche au plus loin)
    arrets_avec_distance.sort((a, b) => a.distance - b.distance);
    
    // Prendre les 3 premiers
    const trois_proches = arrets_avec_distance.slice(0, 3);
    
    setArretsProches(trois_proches);
  }
}, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrets</h2>

      {arretsProches.length > 0 && (
  <div className="arrets-proches">
    <p><strong>🎯 Les 3 arrêts les plus proches :</strong></p>
    <ul>
      {arretsProches.map((a, i) => (
        <li key={a.id}>
          {i + 1}. <strong>{a.nom}</strong> - {a.distance.toFixed(2)} km
        </li>
      ))}
    </ul>
  </div>
)}
      <MapContainer center={DAKAR} zoom={13} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        <CenterButton position={positionUtilisateur} /> 
 {arrets.map(a => {
 const estLeProche = arretsProches.length > 0 && a.id === arretsProches[0].id;
  
  // Créer une icône colorée avec SVG
  const iconColor = estLeProche ? '#ff6b35' : '#3b82f6'; // orange vs bleu
  
  const customIcon = L.divIcon({
    html: `<div style="
      background-color: ${iconColor};
      border: 3px solid white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      font-size: 16px;
    ">${estLeProche ? '⭐' : '📍'}</div>`,
    iconSize: [30, 30],
    className: 'custom-marker'
  });
  
  return (
    <Marker 
      key={a.id} 
      position={[a.lat, a.lon]}
      icon={customIcon}
    >
      <Popup>
        <strong>{a.nom}</strong> <br />
        Lignes : {a.lignes.join(", ")}
        {estLeProche && <br />}
        {estLeProche && <strong style={{color: 'orange'}}>⭐ Plus proche</strong>}
      </Popup>
    </Marker>
  );
})}
        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous etes ici</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default Carte;