import './Datos.css';

interface EstadisticasProps {
  number: string;
  label: string;
  color?: string;
}

const Estadisticas = ({ number, label, color }: EstadisticasProps) => {
  return (
    <div style={{ color }}>
      <p>{number}</p>
      <p>{label}</p>
    </div>
  );
};

const Datos = () => {
  return (
    <section className="stats-container">
      <Estadisticas number="50k+" label="USUARIOS ACTIVOS" />
      <Estadisticas number="1.2M" label="SESIONES" />
      <Estadisticas number="99.9%" label="TIEMPO ACTIVO" color="#10b981" /> 
      <Estadisticas number="24/7" label="SOPORTE" color="#06b6d4" />
    </section>
  );
};

export default Datos;