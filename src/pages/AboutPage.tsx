import './Pages.css';

const AboutPage = () => {
  return (
    <section className="page-container">
      <h1>Sobre nosotros</h1>
      <p className="page-intro">
        Somos una plataforma dedicada a facilitar la transición hacia la movilidad eléctrica en Valencia.
      </p>

      <div className="cards-grid">
        <div className="info-card">
          <div className="card-icon">🎯</div>
          <h3>Nuestra misión</h3>
          <p>Hacer accesible la carga de vehículos eléctricos para todos los conductores, simplificando la búsqueda y reserva de puntos de carga.</p>
        </div>

        <div className="info-card">
          <div className="card-icon">👁️</div>
          <h3>Nuestra visión</h3>
          <p>Un futuro donde cargar tu vehículo eléctrico sea tan fácil como encontrar una gasolinera, pero mucho más sostenible.</p>
        </div>

        <div className="info-card">
          <div className="card-icon">💚</div>
          <h3>Nuestros valores</h3>
          <p>Sostenibilidad, accesibilidad y transparencia. Creemos en un transporte limpio para las generaciones futuras.</p>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat">
          <span className="stat-number">34+</span>
          <span className="stat-label">Puntos de carga</span>
        </div>
        <div className="stat">
          <span className="stat-number">Valencia</span>
          <span className="stat-label">Ciudad activa</span>
        </div>
        <div className="stat">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Disponibilidad</span>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
