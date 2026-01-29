import { useState } from 'react';
import './Pages.css';

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <section className="page-container">
      <h1>Contacto</h1>
      <p className="page-intro">¿Tienes alguna pregunta? Escríbenos.</p>

      <div className="contact-simple">
        {sent ? (
          <div className="success-message">
            <span className="success-icon">✓</span>
            <h3>¡Mensaje enviado!</h3>
            <p>Te responderemos pronto.</p>
            <button onClick={() => setSent(false)} className="btn-primary">
              Enviar otro
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <label>
              Nombre
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Tu nombre"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </label>
            <label>
              Mensaje
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
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
    </section>
  );
}

export default ContactPage;
