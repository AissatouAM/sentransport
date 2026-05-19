import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';
import Carte from './Carte'
import 'leaflet/dist/leaflet.css'

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // Fonction réutilisable (Exercice 1)
  const chargerDonnees = () => {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const lignesFiltrees = lignes.filter(l => {
    const num = l.numero || l.Numero || "";
    const dep = l.depart || l.Depart || "";
    const arr = l.arrivee || l.Arrivee || "";
    return (
      dep.toLowerCase().includes(recherche.toLowerCase()) ||
      arr.toLowerCase().includes(recherche.toLowerCase()) ||
      num.toString().includes(recherche)
    );
  });

  // Requête à la demande au clic (Exercice 3)
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
      return;
    }

    fetch(`http://localhost:5000/lignes/${ligne.id}`)
      .then(response => {
        if (!response.ok) throw new Error("Erreur lors de la récupération des détails");
        return response.json();
      })
      .then(data => {
        setLigneSelectionnee(data);
      })
      .catch(err => alert(err.message));
  }

  if (chargement) {
    return (
      <div className="message-chargement">
        <p>Chargement des lignes...</p>
        <button onClick={chargerDonnees}>Réessayer</button>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="message-erreur">
        <h3>Impossible de charger les lignes.</h3>
        <p className="erreur-detail">{erreur}</p>
        <button onClick={chargerDonnees} className="btn-recharger">🔄 Réessayer</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      
      <main className="content">
        <Recherche recherche={recherche} setRecherche={setRecherche} />

        <button onClick={chargerDonnees} className="btn-recharger">
          🔄 Recharger les données
        </button>

        <p className="result-count">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        <div className="lignes-liste">
          {lignesFiltrees.map(ligne => (
            <LigneBus 
              key={ligne.id} 
              ligne={ligne} 
              onClick={() => handleClickLigne(ligne)} 
            />
          ))}
        </div>

        {ligneSelectionnee && (
          <DetailLigne ligne={ligneSelectionnee} />
        )}
        <Carte />
      </main>

      <Footer />
    </div>
  );
}

export default App;