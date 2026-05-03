import { useState } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  // ÉTAT 1 : le texte de recherche
  const [recherche, setRecherche] = useState('');
  
  // ÉTAT 2 : la ligne cliquée
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

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
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  // FONCTION : gère le clic sur une ligne (toggle)
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null); // re-clic = désélectionner
    } else {
      setLigneSelectionnee(ligne); // premier clic = sélectionner
    }
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        {/* Champ de recherche */}
        <Recherche valeur={recherche} onChange={setRecherche} />

        {/* Affiche le nombre de lignes trouvées */}
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne
          {lignesFiltrees.length > 1 ? 's' : ''} trouvée
          {lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        {/* Liste des lignes filtrées */}
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={
              ligneSelectionnee && ligneSelectionnee.id === ligne.id
            }
            onClick={() => handleClickLigne(ligne)}
          />
        ))}

        {/* Affiche les détails si une ligne est sélectionnée */}
        {ligneSelectionnee && (
          <DetailLigne ligne={ligneSelectionnee} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;