import './App.css';
import Header from './Header';
import Footer from './Footer';
import Stat1 from './Stat1';
import Stat2 from './Stat2';
import Stat3 from './Stat3';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p>Bienvenue ! Cette application vous aide a trouver
        votre ligne de bus a Dakar.</p>
        <div className="stats">
          <Stat1 />
          <Stat2 />
          <Stat3 />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
