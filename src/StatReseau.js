import './StatReseau.css';

function StatReseau({ lignes }) {
  // 1. Nombre total de lignes
  const totalLignes = lignes.length;

  // 2. Nombre total d'arrêts (somme)
  const totalArrets = lignes.reduce((somme, ligne) => somme + ligne.arrets, 0);

  // 3. Ligne avec le plus d'arrêts
  const ligneMaxArrets = lignes.sort((a, b) => b.arrets - a.arrets)[0];

  return (
    <div className="stat-reseau">
      <div className="stat-card">
        <div className="stat-chiffre">{totalLignes}</div>
        <div className="stat-label">Lignes disponibles</div>
      </div>

      <div className="stat-card">
        <div className="stat-chiffre">{totalArrets}</div>
        <div className="stat-label">Arrêts au total</div>
      </div>

      <div className="stat-card">
        <div className="stat-chiffre">Ligne {ligneMaxArrets.numero}</div>
        <div className="stat-label">{ligneMaxArrets.arrets} arrêts (max)</div>
      </div>
    </div>
  );
}

export default StatReseau;