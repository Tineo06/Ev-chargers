import { useState } from 'react';
import './Pages.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="page-container">
      <h1>Contacto</h1>
      <p className="page-intro">
        ¿Tienes alguna pregunta o sugerencia? Nos encantaría saber de ti.
      </p>

      <div className="contact-layout">
        <div className="contact-form-wrapper">
          {sent ? (
            <div className="success-message">
              <span className="success-icon">✓</span>
              <h3>¡Mensaje enviado!</h3>
              <p>Te responderemos lo antes posible.</p>
              <button onClick={() => setSent(false)} className="btn-primary">
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <label>
                Nombre
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Tu nombre"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="tu@email.com"
                />
              </label>
              <label>
                Mensaje
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                />
              </label>
              <button type="submit" className="btn-primary">
                Enviar mensaje
              </button>
            </form>
          )}
        </div>

        <div className="contact-info">
          <h3>Información de contacto</h3>
          
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <div>
              <strong>Dirección</strong>
              <p>Calle de la Innovación, 42<br />46001 Valencia, España</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div>
              <strong>Email</strong>
              <p>info@evmanage.com</p>
            </div>
          </div>

          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <strong>Teléfono</strong>
              <p>900 123 456</p>
            </div>
          </div>

          <div className="contact-social">
            <span>Síguenos:</span>
            <div className="social-links">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
