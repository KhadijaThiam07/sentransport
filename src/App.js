import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import FiltrageArrets from './FiltrageArrets';
import Tri from './Tri';
import Footer from './Footer';
import Carte from './Carte';


function App() {
 
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  const [minArrets, setMinArrets] = useState(0);
  const [tri, setTri] = useState("numero");
  const [compteur, setCompteur] = useState(0);
  
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

  // FILTRAGE : garde seulement les lignes qui contiennent le texte
 const lignesFiltrees = lignes.filter(l =>
  (l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
   l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
   l.numero.includes(recherche))
  &&
  l.arrets >= parseInt(minArrets)  // ← NOUVEAU FILTRE
);
let lignesAffichees = [...lignesFiltrees]; 
if (tri === 'numero') {
  lignesAffichees.sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
} else if (tri === 'arrets-asc') {
  lignesAffichees.sort((a, b) => a.arrets - b.arrets);
} else if (tri === 'arrets-desc') {
  lignesAffichees.sort((a, b) => b.arrets - a.arrets);
}
  // FONCTION : gère le clic sur une ligne (toggle)
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null); // re-clic = désélectionner
    } else {
      setLigneSelectionnee(ligne); // premier clic = sélectionner
    }
  }

  function handleRecherche(texte) {
  setRecherche(texte);
  if (texte !== recherche) {  // Compte seulement si ça change
    setCompteur(compteur + 1);
  }
}
if (chargement) {
    return (
        <div className="App">
            <Header />

            <main className="contenu">
                <p className="message-chargement">
                    Chargement des lignes...
                </p>
            </main>

        </div>
    );
}
if (erreur) {
    return (
        <div className="App">

            <Header />

            <main className="contenu">

                <div className="message-erreur">

                    <p>Impossible de charger les lignes.</p>

                    <p className="erreur-detail">
                        {erreur}
                    </p>

                    <p>
                        Vérifiez que le serveur Flask est lancé
                    </p>

                </div>

            </main>

        </div>
    );
}
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        {/* Champ de recherche */}
        <Recherche valeur={recherche} onChange={handleRecherche} />
        <Recherche valeur={recherche} onChange={handleRecherche} />
        <FiltrageArrets valeur={minArrets} onChange={setMinArrets} />
        <Tri valeur={tri} onChange={setTri} />

        {/* Affiche le compteur */}
        <p className="compteur-recherches">
          📊 Vous avez effectué {compteur} recherche{compteur > 1 ? 's' : ''}
        </p>


        <p className="resultat-recherche">
          {lignesAffichees.length} ligne...
        </p>
        {/* Affiche le nombre de lignes trouvées */}
      <p className="resultat-recherche">
  {lignesFiltrees.length} ligne
  {lignesFiltrees.length > 1 ? 's' : ''} trouvée
  {lignesFiltrees.length > 1 ? 's' : ''}
      </p>

{/* Message si aucune ligne trouvée */}
{lignesAffichees.length === 0 && (
  <div className="aucune-ligne">
    <p>❌ Aucune ligne trouvée</p>
    <p>Essaie une autre recherche (ex: "Pikine", "Plateau")</p>
  </div>
)}

{/* Affiche les lignes seulement s'il y en a */}
{lignesAffichees.length > 0 && (
  <>
    {lignesFiltrees.map(ligne => (
      <LigneBus
        key={ligne.id}
        numero={ligne.numero}
        depart={ligne.depart}
        arrivee={ligne.arrivee}
        arrets={ligne.arrets}
        couleur={ligne.couleur}
        estSelectionnee={
          ligneSelectionnee && ligneSelectionnee.id === ligne.id
        }
        onClick={() => handleClickLigne(ligne)}
      />
    ))}
  </>
)}

{/* Affiche le détail si sélectionné */}
{ligneSelectionnee && (
  <DetailLigne 
    ligne={ligneSelectionnee}
    onClose={() => setLigneSelectionnee(null)}
  />
)}
        <Carte />
      </main>
      <Footer />
    </div>
  );
}

export default App;