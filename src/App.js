import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  // 1. Déclaration des différents états (States)
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  // 2. Chargement asynchrone des données depuis l'API Flask au démarrage
  useEffect(() => {
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
  }, []);

  // 3. Filtrage dynamique des lignes en fonction du mot-clé
  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.toString().includes(recherche)
  );

  // 4. Gestion de la sélection et désélection au clic sur une ligne
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      setLigneSelectionnee(ligne);
    }
  }

  // 5. Rendu conditionnel : Écran de chargement
  if (chargement) {
    return (
      <div className="message-chargement">
        <p>Chargement des lignes...</p>
      </div>
    );
  }

  // 6. Rendu conditionnel : Écran d'erreur (si l'API Flask ne répond pas)
  if (erreur) {
    return (
      <div className="message-erreur">
        <h3>Impossible de charger les lignes.</h3>
        <p className="erreur-detail">{erreur}</p>
        <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
      </div>
    );
  }

  // 7. Rendu de l'interface principale (quand les données sont chargées)
  return (
    <div className="app-container">
      <Header />
      
      <main className="content">
        <Recherche recherche={recherche} setRecherche={setRecherche} />

        <p className="result-count">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        <div className="lignes-liste">
          {lignesFiltrees.map(ligne => (
            <LigneBus 
              key={ligne.id} 
              ligne={ligne} 
              onClick={() => handleClickLigne(ligne)} 
              estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            />
          ))}
        </div>

        {ligneSelectionnee && (
          <DetailLigne ligne={ligneSelectionnee} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;