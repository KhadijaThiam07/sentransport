import { useState, useEffect } from 'react';

function ListeIncidents() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/incidents")
      .then(r => r.json())
      .then(data => setIncidents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Incidents signalés</h3>
      {incidents.length === 0 ? (
        <p>Aucun incident pour le moment</p>
      ) : (
        <ul>
          {incidents.map(inc => (
            <li key={inc.id}>
              Ligne {inc.ligne} - {inc.description} ({inc.lieu})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListeIncidents;