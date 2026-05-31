import { useState, useEffect } from 'react';
import './Meteo.css';

function Meteo() {
  const [meteo, setMeteo] = useState(null);
  const [previsions, setPrevisions] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_OWM_KEY;
    
    if (!API_KEY) {
      setErreur("Clé API manquante (.env)");
      return;
    }

    // Météo actuelle
    const currentUrl = 
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=Dakar&appid=${API_KEY}` +
      `&units=metric&lang=fr`;

    fetch(currentUrl)
      .then(r => {
        if (!r.ok) throw new Error("Erreur : " + r.status);
        return r.json();
      })
      .then(data => {
        setMeteo({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          condition: data.weather[0].main,
          humidite: data.main.humidity,
          icone: data.weather[0].icon,
        });
      })
      .catch(err => setErreur(err.message));

    // Prévisions 5 jours
    const forecastUrl = 
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?q=Dakar&appid=${API_KEY}` +
      `&units=metric&lang=fr&cnt=9`; // 9 = 3 jours (8h, 16h, 00h)

    fetch(forecastUrl)
      .then(r => {
        if (!r.ok) throw new Error("Erreur prévisions");
        return r.json();
      })
      .then(data => {
        // On prend un point par jour (indice 0, 8, 16)
        const prev = [
          data.list[0],
          data.list[4],
          data.list[8]
        ].map(item => ({
          date: new Date(item.dt * 1000).toLocaleDateString('fr-FR'),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description,
          icone: item.weather[0].icon,
        }));
        setPrevisions(prev);
      })
      .catch(err => console.error("Erreur forecast:", err));
  }, []);

  function getAlerte(condition) {
    if (condition === "Rain" || condition === "Drizzle") {
      return {
        message: "Pluie détectée - risque de retards",
        classe: "alerte-pluie"
      };
    }
    if (condition === "Thunderstorm") {
      return {
        message: "Orage en cours - soyez prudents",
        classe: "alerte-orage"
      };
    }
    return null;
  }

  if (erreur) {
    return (
      <div className="meteo meteo-erreur">
        <p>Météo indisponible</p>
        <p className="meteo-detail">{erreur}</p>
      </div>
    );
  }

  if (!meteo) {
    return <div className="meteo">Chargement météo ...</div>;
  }

  const alerte = getAlerte(meteo.condition);

  return (
    <div className="meteo">
      <div className="meteo-info">
        <img
          src={`https://openweathermap.org/img/wn/${meteo.icone}@2x.png`}
          alt={meteo.description}
          className="meteo-icone"
        />
        <div>
          <span className="meteo-temp">
            {meteo.temperature}&deg; C
          </span>
          <span className="meteo-desc">
            {meteo.description}
          </span>
        </div>
        <span className="meteo-humidite">
          Humidité : {meteo.humidite}%
        </span>
      </div>
      {alerte && (
        <div className={`meteo-alerte ${alerte.classe}`}>
          {alerte.message}
        </div>
      )}

      {previsions.length > 0 && (
        <div className="meteo-previsions">
          <h3 className="previsions-titre">Prévisions (3 prochains jours)</h3>
          <div className="previsions-grid">
            {previsions.map((prev, idx) => (
              <div key={idx} className="prevision-card">
                <p className="prevision-date">{prev.date}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${prev.icone}@2x.png`}
                  alt={prev.description}
                  className="prevision-icone"
                />
                <p className="prevision-temp">{prev.temp}&deg; C</p>
                <p className="prevision-desc">{prev.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Meteo;