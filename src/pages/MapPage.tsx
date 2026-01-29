import { useEffect, useRef, useState } from 'react';
import './MapPage.css';

const API_URL = 'https://valencia.opendatasoft.com/api/v2/catalog/datasets/carregadors-vehicles-electrics-cargadores-vehiculos-electricos/records?limit=100';

interface Charger {
  id: string;
  lat: number;
  lon: number;
  emplazamie: string;
  distrito: number;
  conector: string;
  tipo_carga: string;
  potenc_ia: string;
  precio_iv: string;
}

interface Reservation {
  id: string;
  date: string;
  chargerName: string;
  horaInicio: string;
  horaFin: string;
  precioTotal: number;
  customerName: string;
  customerEmail: string;
  status: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMap?: () => void;
  }
}

function getReservations(): Reservation[] {
  const data = localStorage.getItem('reservations');
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

function saveReservation(reservation: Reservation) {
  const reservations = getReservations();
  reservations.unshift(reservation);
  localStorage.setItem('reservations', JSON.stringify(reservations));
}

function getPotenciaNumero(potencia: string): number {
  const match = potencia.match(/[\d.,]+/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
  return 7.4;
}

function calcularPrecio(horaInicio: string, horaFin: string, potenciaKw: number): number {
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);
  
  const minutos1 = h1 * 60 + m1;
  const minutos2 = h2 * 60 + m2;
  
  let diferencia = minutos2 - minutos1;
  if (diferencia <= 0) {
    diferencia = 60;
  }
  
  const horas = diferencia / 60;
  const precioPorKwh = 0.25;
  const precio = horas * potenciaKw * precioPorKwh;
  
  return Math.round(precio * 100) / 100;
}

function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [selected, setSelected] = useState<Charger | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [horaInicio, setHoraInicio] = useState('10:00');
  const [horaFin, setHoraFin] = useState('11:00');

  const potenciaKw = selected ? getPotenciaNumero(selected.potenc_ia) : 7.4;
  const precioTotal = calcularPrecio(horaInicio, horaFin, potenciaKw);

  useEffect(() => {
    setReservations(getReservations());

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const pending = sessionStorage.getItem('pendingReservation');
      if (pending) {
        try {
          const data = JSON.parse(pending);
          const newReservation: Reservation = {
            id: Date.now().toString(),
            date: new Date().toLocaleString('es-ES'),
            chargerName: data.chargerName || 'Cargador',
            horaInicio: data.horaInicio || '10:00',
            horaFin: data.horaFin || '11:00',
            precioTotal: data.precioTotal || 5,
            customerName: data.customerName || '',
            customerEmail: data.customerEmail || '',
            status: 'Confirmada'
          };
          saveReservation(newReservation);
          setReservations(getReservations());
        } catch (e) {
          console.error('Error al procesar reserva:', e);
        }
        sessionStorage.removeItem('pendingReservation');
      }
      window.history.replaceState({}, '', '/cargadores');
    }
  }, []);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        const items: Charger[] = [];
        const records = data.records || [];
        
        for (let i = 0; i < records.length; i++) {
          const rec = records[i];
          const fields = rec.record?.fields || rec.fields || {};
          const geo = fields.geo_point_2d;
          
          if (geo && typeof geo.lat === 'number' && typeof geo.lon === 'number') {
            items.push({
              id: rec.record?.id || rec.id || String(i),
              lat: geo.lat,
              lon: geo.lon,
              emplazamie: fields.emplazamie || 'Sin dirección',
              distrito: fields.distrito || 0,
              conector: fields.conector || 'Tipo 2',
              tipo_carga: fields.tipo_carga || 'Normal',
              potenc_ia: fields.potenc_ia || '7.4 kW',
              precio_iv: fields.precio_iv || '0.25 €/kWh'
            });
          }
        }
        setChargers(items);
      })
      .catch(error => {
        console.error('Error:', error);
        setChargers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapReady(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      if (window.google && window.google.maps) {
        setMapReady(true);
      } else {
        existingScript.addEventListener('load', () => setMapReady(true));
      }
      return;
    }

    window.initGoogleMap = () => setMapReady(true);

    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?callback=initGoogleMap';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.google || !window.google.maps) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 39.4699, lng: -0.3763 },
        zoom: 13
      });
    }

    if (chargers.length === 0) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const infoWindow = new window.google.maps.InfoWindow();

    for (let i = 0; i < chargers.length; i++) {
      const charger = chargers[i];
      
      const marker = new window.google.maps.Marker({
        position: { lat: charger.lat, lng: charger.lon },
        map: mapInstance.current,
        title: charger.emplazamie
      });

      marker.addListener('click', () => {
        const html = `
          <div style="max-width:250px;font-family:sans-serif">
            <strong>${charger.emplazamie}</strong>
            <p style="margin:6px 0;font-size:12px;color:#666">Distrito: ${charger.distrito}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Conector: ${charger.conector}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Tipo: ${charger.tipo_carga}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Potencia: ${charger.potenc_ia}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Precio: 0.25 €/kWh</p>
            <button id="btn-${charger.id}" style="margin-top:10px;padding:10px 20px;background:#111827;color:#fff;border:none;border-radius:6px;cursor:pointer">Reservar</button>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(mapInstance.current, marker);

        setTimeout(() => {
          const btn = document.getElementById(`btn-${charger.id}`);
          if (btn) {
            btn.onclick = () => {
              infoWindow.close();
              setSelected(charger);
            };
          }
        }, 100);
      });

      markersRef.current.push(marker);
    }

    if (chargers.length > 0 && mapInstance.current) {
      const bounds = new window.google.maps.LatLngBounds();
      for (let i = 0; i < chargers.length; i++) {
        bounds.extend({ lat: chargers[i].lat, lng: chargers[i].lon });
      }
      mapInstance.current.fitBounds(bounds);
    }
  }, [chargers, mapReady]);

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    sessionStorage.setItem('pendingReservation', JSON.stringify({
      chargerName: selected.emplazamie,
      horaInicio: horaInicio,
      horaFin: horaFin,
      precioTotal: precioTotal,
      customerName: customerName,
      customerEmail: customerEmail
    }));

    const apiUrl = import.meta.env.PROD 
      ? '/api/checkout' 
      : 'http://localhost:4242/create-checkout-session';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chargerName: selected.emplazamie,
          potencia: potenciaKw,
          horaInicio: horaInicio,
          horaFin: horaFin,
          precioTotal: precioTotal,
          customerEmail: customerEmail,
          customerName: customerName
        })
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al crear el pago');
      }
    } catch (error) {
      alert('Error de conexión. Ejecuta: npm run start:server');
    }
  }

  function closeModal() {
    setSelected(null);
    setCustomerName('');
    setCustomerEmail('');
    setHoraInicio('10:00');
    setHoraFin('11:00');
  }

  function deleteReservation(id: string) {
    const updated = reservations.filter(r => r.id !== id);
    localStorage.setItem('reservations', JSON.stringify(updated));
    setReservations(updated);
  }

  return (
    <section className="map-page">
      <div className="page-header">
        <div>
          <h2>Puntos de carga en Valencia</h2>
          <p className="map-subtitle">Haz clic en un marcador para ver detalles y reservar</p>
        </div>
        <button
          className={`btn-reservations ${showReservations ? 'active' : ''}`}
          onClick={() => setShowReservations(!showReservations)}
        >
          📋 Mis reservas {reservations.length > 0 && `(${reservations.length})`}
        </button>
      </div>

      {showReservations && (
        <div className="reservations-panel">
          <h3>Mis reservas</h3>
          {reservations.length === 0 ? (
            <p className="no-reservations">No tienes reservas todavía</p>
          ) : (
            <div className="reservations-list">
              {reservations.map(r => (
                <div key={r.id} className="reservation-card">
                  <div className="reservation-info">
                    <strong>{r.chargerName}</strong>
                    <span className="reservation-date">{r.date}</span>
                    <span className="reservation-time">🕐 {r.horaInicio || '10:00'} - {r.horaFin || '11:00'}</span>
                    <span className="reservation-price">💰 {(r.precioTotal || 5).toFixed(2)} €</span>
                    <span className="reservation-customer">{r.customerName} · {r.customerEmail}</span>
                    <span className={`reservation-status ${r.status.toLowerCase()}`}>{r.status}</span>
                  </div>
                  <button onClick={() => deleteReservation(r.id)} className="btn-delete">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && <p className="loading-text">Cargando datos de cargadores...</p>}

      <div className="map-wrapper">
        <div ref={mapRef} className="google-map" />
      </div>

      {!loading && chargers.length === 0 && (
        <p className="error-msg">No se pudieron cargar los puntos de carga.</p>
      )}

      {!loading && chargers.length > 0 && (
        <p className="charger-count">{chargers.length} cargadores encontrados</p>
      )}

      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Reservar cargador</h3>
            <p className="modal-address">{selected.emplazamie}</p>
            <p className="modal-details">
              {selected.conector} · {selected.tipo_carga} · Potencia: {potenciaKw} kW
            </p>

            <form onSubmit={handleReserve} className="reserve-form">
              <label>
                Nombre
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  placeholder="Tu nombre"
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </label>

              <div className="time-row">
                <label>
                  Hora inicio
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={e => setHoraInicio(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Hora fin
                  <input
                    type="time"
                    value={horaFin}
                    onChange={e => setHoraFin(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="price-box">
                <p>Potencia: <strong>{potenciaKw} kW</strong></p>
                <p>Precio por kWh: <strong>0.25 €</strong></p>
                <p className="total">Total a pagar: <strong>{precioTotal.toFixed(2)} €</strong></p>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-pay">
                  Pagar {precioTotal.toFixed(2)} € con Stripe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default MapPage;
