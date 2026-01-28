import './Pages.css';

const SupportPage = () => {
  return (
    <section className="page-container">
      <h1>Soporte</h1>
      <p className="page-intro">
        ¿Tienes alguna duda o problema? Estamos aquí para ayudarte.
      </p>

      <div className="faq-section">
        <h2>Preguntas frecuentes</h2>
        
        <details className="faq-item">
          <summary>¿Cómo reservo un punto de carga?</summary>
          <p>Ve a la sección "Ver cargadores", haz clic en un marcador del mapa y pulsa "Reservar". Completa tus datos y realiza el pago.</p>
        </details>

        <details className="faq-item">
          <summary>¿Puedo cancelar una reserva?</summary>
          <p>Sí, puedes gestionar tus reservas desde la sección "Mis reservas" en la página de cargadores. Las cancelaciones deben hacerse con al menos 1 hora de antelación.</p>
        </details>

        <details className="faq-item">
          <summary>¿Qué tipos de conectores hay disponibles?</summary>
          <p>La mayoría de puntos de carga en Valencia disponen de conectores TIPO 2, compatibles con la mayoría de vehículos eléctricos del mercado.</p>
        </details>

        <details className="faq-item">
          <summary>¿Cuánto cuesta cargar?</summary>
          <p>El precio varía según el punto de carga, pero generalmente ronda los 0,19€/kWh. Puedes ver el precio exacto en los detalles de cada cargador.</p>
        </details>

        <details className="faq-item">
          <summary>¿Qué hago si el cargador no funciona?</summary>
          <p>Contacta con nosotros a través del formulario de contacto o llámanos. Te ayudaremos a resolver el problema o encontrar un cargador alternativo.</p>
        </details>
      </div>

      <div className="support-contact">
        <h2>¿No encuentras lo que buscas?</h2>
        <p>Nuestro equipo de soporte está disponible para ayudarte.</p>
        <div className="support-options">
          <div className="support-option">
            <span className="option-icon">📧</span>
            <span>soporte@evmanage.com</span>
          </div>
          <div className="support-option">
            <span className="option-icon">📞</span>
            <span>900 123 456</span>
          </div>
          <div className="support-option">
            <span className="option-icon">⏰</span>
            <span>Lun - Vie: 9:00 - 18:00</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportPage;
