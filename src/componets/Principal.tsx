import './Principal.css';
import evChargerImage from '../assets/ev-charger.webp';

const Principal = () => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <div className="hero-left">
                    <div className="image-overlay">
                        <img src={evChargerImage} alt="EV Charger" className="ev-charger-image" />
                        <div className="overlay-text">
                            <h2>Energía inteligente para <span className="text-gradient">flotas más ecológicas.</span></h2>
                            <p>
                                La plataforma unificada para gestionar la infraestructura de carga y optimizar las operaciones de vehículos eléctricos en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <h3>Seleciona tu usuario</h3>
                    <p className="portal-description">Elige tu nivel de acceso para ingresar al ecosistema.</p>

                    <div className="card">
                        <div className="card-icon">⚙️</div>
                        <div>
                            <h4>Portal de Administrador</h4>
                            <p className="card-subtitle">Administradores de instalaciones y operaciones</p>
                            <p className="card-text">
                                Control total sobre puntos de carga, paneles de análisis.
                            </p>
                            <button className="btn-card black-btn">Log In como Administrador</button>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-icon">🚗</div>
                        <div>
                            <h4>Acceso para conductores</h4>
                            <p className="card-subtitle">Propietarios y conductores de vehículos</p>
                            <p className="card-text">
                                Encuentra estaciones, realiza un seguimiento de las sesiones de carga.
                            </p>
                            <button className="btn-card transparent-btn">Log In como Usuario</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Principal;