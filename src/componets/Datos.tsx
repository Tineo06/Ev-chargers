import './Datos.css';

function Datos() {
  return (
    <section className="stats">
      <div>
        <p className="number">50k+</p>
        <p className="label">USUARIOS</p>
      </div>
      <div>
        <p className="number">1.2M</p>
        <p className="label">SESIONES</p>
      </div>
      <div>
        <p className="number green">99.9%</p>
        <p className="label">ACTIVO</p>
      </div>
      <div>
        <p className="number blue">24/7</p>
        <p className="label">SOPORTE</p>
      </div>
    </section>
  );
}

export default Datos;