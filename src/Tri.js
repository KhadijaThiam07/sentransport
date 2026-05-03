import './Tri.css';

function Tri({ valeur, onChange }) {
  return (
    <div className="tri">
      <label htmlFor="select-tri">Trier par :</label>
      <select
        id="select-tri"
        className="select-tri"
        value={valeur}
        onChange={e => onChange(e.target.value)}
      >
        <option value="numero">Numéro</option>
        <option value="arrets-asc">Arrêts (moins d'abord)</option>
        <option value="arrets-desc">Arrêts (plus d'abord)</option>
      </select>
    </div>
  );
}

export default Tri;