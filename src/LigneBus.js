import './LigneBus.css';

function LigneBus({ ligne, estSelectionnee, onClick, couleur }) {
  const { numero, depart, arrivee, arrets } = ligne;

  return (
    <div className={`ligne-bus ${estSelectionnee ? 'selectionnee' : ''}`} onClick={onClick}>
      <div className="ligne-numero" style={{ backgroundColor: couleur || '#2b7a78' }}>{numero}</div>
      <div className="ligne-info">
        <span className="ligne-trajet">
          {depart} &rarr; {arrivee}
        </span>
        <span className="ligne-arrets">{arrets} arrêts</span>
      </div>
    </div>
  );
}

export default LigneBus;