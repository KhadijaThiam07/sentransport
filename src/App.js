import './App.css';
import Header from './Header';
import ListeLignes from './ListeLignes';
import Footer from './Footer';
import StatReseau from './StatReseau';


function App() {
 const lignes = [
  {
    id: 1,
    numero: '1',
    depart: 'Parcelles Assainies',
    arrivee: 'Plateau',
    arrets: 14,
    couleur: '#0a6e31'  // Vert
  },
  {
    id: 2,
    numero: '7',
    depart: 'Guediawaye',
    arrivee: 'Place Obe',
    arrets: 18,
    couleur: '#e74c3c'  // Rouge
  },
  {
    id: 3,
    numero: '15',
    depart: 'Pikine',
    arrivee: 'Medina',
    arrets: 12,
    couleur: '#3498db'  // Bleu
  },
  {
    id: 4,
    numero: '23',
    depart: 'Ouakam',
    arrivee: 'Grand Dakar',
    arrets: 10,
    couleur: '#f39c12'  // Orange
  },
  {
    id: 5,
    numero: '8',
    depart: 'Almadies',
    arrivee: 'Colobane',
    arrets: 16,
    couleur: '#9b59b6'  // Violet
  },
  {
    id: 6,
    numero: '12',
    depart: 'Yoff',
    arrivee: 'Sandaga',
    arrets: 11,
    couleur: '#1abc9c'  // Turquoise
  },
 {
  id: 7,
  numero: '2',
  depart: 'Fann',
  arrivee: 'Grand-Yoff',
  arrets: 15,
  couleur: '#2ecc71'  // Vert clair
},
{
  id: 8,
  numero: '5',
  depart: 'Mermoz',
  arrivee: 'Dieuppeul',
  arrets: 12,
  couleur: '#34495e'  // Gris foncé
},
{
  id: 9,
  numero: '11',
  depart: 'Sicap',
  arrivee: 'Liberté 5',
  arrets: 16,
  couleur: '#c0392b'  // Rouge foncé
},
{
  id: 10,
  numero: '14',
  depart: 'Tally',
  arrivee: 'Castor',
  arrets: 13,
  couleur: '#8e44ad'  // Violet foncé
}
 ];

return (
  <div className="App">
    <Header />
    <main className="contenu">
      <StatReseau lignes={lignes} />
      <ListeLignes lignes={lignes} />
    </main>
    <Footer />
  </div>
);
}

export default App;