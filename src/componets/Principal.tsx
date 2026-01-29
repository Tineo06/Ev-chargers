import './Principal.css';
import { Link } from 'react-router-dom';

function Principal() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>EV Manage</h1>
        <p className="hero-subtitle">Gestiona la carga de tu vehículo eléctrico en Valencia</p>
        
        <div className="hero-features">
          <div className="feature">
            <span>📍</span>
            <p>Encuentra puntos de carga</p>
          </div>
          <div className="feature">
            <span>⚡</span>
            <p>Reserva tu cargador</p>
          </div>
          <div className="feature">
            <span>💳</span>
            <p>Paga online</p>
          </div>
        </div>

        <Link to="/cargadores" className="btn-main">Ver cargadores disponibles</Link>
      </div>
    </section>
  );
}

export default Principal;