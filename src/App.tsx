import Header from './componets/Header';
import Principal from './componets/Principal';
import Datos from './componets/Datos';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<><Principal /><Datos /></>} />
          <Route path="/cargadores" element={<MapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;