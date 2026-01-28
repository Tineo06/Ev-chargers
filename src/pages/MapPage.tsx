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
  chargerAddress: string;
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

const getReservations = (): Reservation[] => {
  try {
    return JSON.parse(localStorage.getItem('reservations') || '[]');
  } catch {
    return [];
  }
};

const saveReservation = (reservation: Reservation) => {
  const reservations = getReservations();
  reservations.unshift(reservation);
  localStorage.setItem('reservations', JSON.stringify(reservations));
};

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Charger | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);

  useEffect(() => {
    setReservations(getReservations());
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      const pending = sessionStorage.getItem('pendingReservation');
      if (pending) {
        const data = JSON.parse(pending);
        const newReservation: Reservation = {
          id: Date.now().toString(),
          date: new Date().toLocaleString('es-ES'),
          chargerName: data.chargerName,
          chargerAddress: data.chargerAddress,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          status: 'Confirmada',
        };
        saveReservation(newReservation);
        setReservations(getReservations());
        sessionStorage.removeItem('pendingReservation');
        window.history.replaceState({}, '', '/cargadores');
      }
    }
  }, []);

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        const items: Charger[] = [];
        for (const rec of data.records || []) {
          const f = rec.record?.fields || rec.fields || {};
          const gp = f.geo_point_2d;
          if (gp && typeof gp.lat === 'number' && typeof gp.lon === 'number') {
            items.push({
              id: rec.record?.id || rec.id || String(Math.random()),
              lat: gp.lat,
              lon: gp.lon,
              emplazamie: f.emplazamie || 'Sin dirección',
              distrito: f.distrito || 0,
              conector: f.conector || '',
              tipo_carga: f.tipo_carga || '',
              potenc_ia: f.potenc_ia || '',
              precio_iv: f.precio_iv || '',
            });
          }
        }
        setChargers(items);
      })
      .catch(err => {
        console.error('Error fetching chargers:', err);
        setChargers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapReady(true);
      return;
    }

    window.initGoogleMap = () => {
      setMapReady(true);
    };

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?callback=initGoogleMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      delete window.initGoogleMap;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 39.4699, lng: -0.3763 },
        zoom: 13,
      });
    }

    if (chargers.length === 0) return;

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const infoWindow = new window.google.maps.InfoWindow();

    chargers.forEach(c => {
      const marker = new window.google.maps.Marker({
        position: { lat: c.lat, lng: c.lon },
        map: mapInstance.current,
        title: c.emplazamie,
      });

      marker.addListener('click', () => {
        const content = `
          <div style="max-width:250px;font-family:sans-serif">
            <strong style="font-size:14px">${c.emplazamie}</strong>
            <p style="margin:6px 0 4px;font-size:12px;color:#666">Distrito: ${c.distrito}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Conector: ${c.conector}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Tipo: ${c.tipo_carga}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Potencia: ${c.potenc_ia}</p>
            <p style="margin:4px 0;font-size:12px;color:#666">Precio: ${c.precio_iv}</p>
            <button id="reserve-btn-${c.id}" style="margin-top:10px;padding:10px 20px;background:#111827;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px">Reservar</button>
          </div>
        `;
        infoWindow.setContent(content);
        infoWindow.open(mapInstance.current, marker);

        setTimeout(() => {
          const btn = document.getElementById(`reserve-btn-${c.id}`);
          if (btn) {
            btn.onclick = () => {
              infoWindow.close();
              setSelected(c);
            };
          }
        }, 100);
      });

      markersRef.current.push(marker);
    });

    if (chargers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      chargers.forEach(c => bounds.extend({ lat: c.lat, lng: c.lon }));
      mapInstance.current.fitBounds(bounds);
    }
  }, [chargers, mapReady]);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    sessionStorage.setItem('pendingReservation', JSON.stringify({
      chargerName: selected.emplazamie,
      chargerAddress: selected.emplazamie,
      customerName,
      customerEmail,
    }));

    try {
      const res = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charger: {
            id: selected.id,
            name: selected.emplazamie,
            address: selected.emplazamie,
            distrito: selected.distrito,
          },
          customerEmail,
          customerName,
        }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        alert('Error al crear la sesión de pago. Asegúrate de que el servidor está corriendo.');
      }
    } catch {
      alert('Error de conexión con el servidor de pagos. Ejecuta: npm run start:server');
    }
  };

  const closeModal = () => {
    setSelected(null);
    setCustomerEmail('');
    setCustomerName('');
  };

  const deleteReservation = (id: string) => {
    const updated = reservations.filter(r => r.id !== id);
    localStorage.setItem('reservations', JSON.stringify(updated));
    setReservations(updated);
  };

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
              {selected.conector} · {selected.tipo_carga} · {selected.precio_iv}
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
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-pay">
                  Pagar 5€ y reservar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MapPage;
