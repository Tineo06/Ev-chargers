import React, { useEffect, useState } from 'react';
import './Chargers.css';

type RecordItem = any;

const API_URL = 'https://valencia.opendatasoft.com/api/v2/catalog/datasets/carregadors-vehicles-electrics-cargadores-vehiculos-electricos/records?limit=50';

const Chargers = () => {
  const [chargers, setChargers] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        const items = (data.records || []).map((r: any) => r.fields || {});
        setChargers(items);
      })
      .catch(() => setChargers([]))
      .finally(() => setLoading(false));
  }, []);

  const openReserve = (item: RecordItem) => {
    setSelected(item);
  };

  const closeModal = () => {
    setSelected(null);
    setCustomerEmail('');
    setCustomerName('');
  };

  const reserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const body = { charger: selected, customerEmail, customerName };
    try {
      const res = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else if (json.sessionId) {
        window.location.href = `/checkout?sessionId=${json.sessionId}`;
      } else {
        alert('No se pudo crear la sesión de pago');
      }
    } catch (err) {
      alert('Error creando la sesión de pago');
    }
  };

  return (
    <section id="chargers" className="chargers-section">
      <h2>Puntos de carga</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="chargers-grid">
          {chargers.map((c, idx) => (
            <div key={idx} className="charger-card">
              <h3>{c.nom || c.name || c.id || 'Cargador'}</h3>
              <p className="small">{c.adreca || c.address || c.via || ''}</p>
              <p className="small">{c.municipi || c.municipio || ''}</p>
              <div className="card-actions">
                <button onClick={() => openReserve(c)} className="btn-card black-btn">Reservar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reservar: {selected.nom || selected.name || 'Cargador'}</h3>
            <form onSubmit={reserve} className="reserve-form">
              <label>
                Nombre
                <input value={customerName} onChange={e => setCustomerName(e.target.value)} required />
              </label>
              <label>
                Correo
                <input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} type="email" required />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-card transparent-btn">Cancelar</button>
                <button type="submit" className="btn-card black-btn">Pagar y reservar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Chargers;
