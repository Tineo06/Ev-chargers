import './Principal.css';
import evChargerImage from '../assets/ev-charger.webp';
import { Link } from 'react-router-dom';

const Principal = () => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <div className="hero-left">
                    <div className="image-overlay">
                        <img src={evChargerImage} alt="EV Charger" className="ev-charger-image" />
                        <div className="overlay-text">
                            <h2>Energía inteligente para flotas más ecológicas.</h2>
                            <p>
                                La plataforma unificada para gestionar la infraestructura de carga y optimizar las operaciones de vehículos eléctricos en tiempo real.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <h3>Selecciona tu usuario</h3>
                    <p className="portal-description">Elige tu nivel de acceso para ingresar al ecosistema.</p>

                    <div className="card">
                        <div className="card-icon">🚗</div>
                        <div>
                            <h4>Acceso para conductores</h4>
                            <p className="card-subtitle">Propietarios y conductores de vehículos</p>
                            <p className="card-text">
                                Encuentra estaciones, realiza un seguimiento de las sesiones de carga.
                            </p>
                            <Link to="/cargadores" className="btn-card transparent-btn">Ver cargadores</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Principal;