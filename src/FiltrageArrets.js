import './FiltrageArrets.css';

function FiltrageArrets({ valeur, onChange }) {
  return (
    <div className="filtrage-arrets">
      <label htmlFor="select-arrets">Nombre minimum d'arrêts :</label>
      <select
        id="select-arrets"
        className="select-arrets"
        value={valeur}
        onChange={e => onChange(e.target.value)}
      >
        <option value="0">Tous</option>
        <option value="10">10+</option>
        <option value="15">15+</option>
        <option value="18">18+</option>
      </select>
    </div>
  );
}

export default FiltrageArrets;