import './Recherche.css';

function Recherche({ valeur, onChange }) {
  return (
    <div className="recherche">
      <input
        type="text"
        className="recherche-input"
        placeholder="Rechercher une ligne (départ, arrivée)..."
        value={valeur}
        onChange={e => onChange(e.target.value)}
      />
      {valeur && (  // N'affiche le bouton que si valeur non vide
        <button
          className="recherche-bouton-effacer"
          onClick={() => onChange('')}
        >
          ✕ Effacer
        </button>
      )}
    </div>
  );
}

export default Recherche;
