import { useState } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import FiltrageArrets from './FiltrageArrets';
import Tri from './Tri';
import Footer from './Footer';

function App() {
  // ÉTAT 1 : le texte de recherche
  const [recherche, setRecherche] = useState('');
  
  // ÉTAT 2 : la ligne cliquée
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [compteur, setCompteur] = useState(0);
  const [minArrets, setMinArrets] = useState(0);
  const [tri, setTri] = useState('numero');  // ← NOUVEAU

  const lignes = [
    {
      id: 1,
      numero: '1',
      depart: 'Parcelles Assainies',
      arrivee: 'Plateau',
      arrets: 14,
      listeArrets: [
        'Parcelles U14',
        'Parcelles U10',
        'Cambérène',
        "Patte d'Oie",
        'Grand Dakar',
        'Colobane',
        'Ponty',
        'Plateau'
      ]
    },
    {
      id: 2,
      numero: '7',
      depart: 'Guediawaye',
      arrivee: 'Place Obe',
      arrets: 18,
      listeArrets: [
        'Guediawaye',
        'Pikine',
        'Thiaroye',
        'Keur Massar',
        'Grand Yoff',
        'Parcelles',
        'Liberté 6',
        'Place Obe'
      ]
    },
    {
      id: 3,
      numero: '15',
      depart: 'Pikine',
      arrivee: 'Medina',
      arrets: 12,
      listeArrets: [
        'Pikine Centre',
        'Thiaroye Gare',
        'Hann',
        'Colobane',
        'Fass',
        'Medina'
      ]
    },
    {
      id: 4,
      numero: '23',
      depart: 'Ouakam',
      arrivee: 'Grand Dakar',
      arrets: 10,
      listeArrets: [
        'Ouakam Village',
        'Mermoz',
        'Fann',
        'Point E',
        'Liberté 5',
        'Grand Dakar'
      ]
    },
    {
      id: 5,
      numero: '8',
      depart: 'Almadies',
      arrivee: 'Colobane',
      arrets: 16,
      listeArrets: [
        'Almadies',
        'Ngor',
        'Yoff',
        'Ouest Foire',
        'Liberté 6',
        'Colobane'
      ]
    },
    {
      id: 6,
      numero: '12',
      depart: 'Yoff',
      arrivee: 'Sandaga',
      arrets: 11,
      listeArrets: [
        'Yoff Village',
        'Aéroport LSS',
        'Parcelles U17',
        'Grand Yoff',
        'HLM',
        'Sandaga'
      ]
    }
  ];

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
      </main>
      <Footer />
    </div>
  );
}

export default App;