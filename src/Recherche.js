import './Recherche.css';

function Recherche({ recherche, setRecherche }) {
  return (
    <div className="recherche">
      <input
        type="text"
        className="recherche-input"
        placeholder="Rechercher une ligne (depart, arrivee)..."
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
      />
    </div>
  );
}

export default Recherche;