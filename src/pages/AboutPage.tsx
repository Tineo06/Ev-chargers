import './Pages.css';

function AboutPage() {
  return (
    <section className="page-container">
      <h1>Sobre nosotros</h1>
      <p className="page-intro">
        Plataforma para facilitar la movilidad eléctrica en Valencia.
      </p>

      <div className="cards-grid">
        <div className="info-card">
          <div className="icon">🎯</div>
          <h3>Nuestra misión</h3>
          <p>Hacer accesible la carga de vehículos eléctricos para todos.</p>
        </div>

        <div className="info-card">
          <div className="icon">👁️</div>
          <h3>Nuestra visión</h3>
          <p>Un futuro donde cargar tu vehículo sea fácil y sostenible.</p>
        </div>

        <div className="info-card">
          <div className="icon">💚</div>
          <h3>Nuestros valores</h3>
          <p>Sostenibilidad, accesibilidad y transparencia.</p>
        </div>
      </div>

      <div className="stats-box">
        <div>
          <span className="stat-num">34+</span>
          <span className="stat-text">Puntos de carga</span>
        </div>
        <div>
          <span className="stat-num">Valencia</span>
          <span className="stat-text">Ciudad activa</span>
        </div>
        <div>
          <span className="stat-num">24/7</span>
          <span className="stat-text">Disponibilidad</span>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
