import Header from './componets/Header';
import Principal from './componets/principal';
import './App.css';
import Datos from './componets/Datos';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Principal /> 
        <Datos />
        <section className="section">
          {/* Contenido futuro */}
        </section>
      </main>
    </div>
  );
}

export default App;