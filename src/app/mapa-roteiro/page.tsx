'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/hearder';

// Corrige o ícone padrão do Leaflet que costuma quebrar no Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

interface ScheduleItem {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  place?: Place;
}

interface Schedule {
  id: number;
  title: string;
  date: string;
  items: ScheduleItem[];
}

export default function MapaRoteiroPage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [message, setMessage] = useState('');

  // 1. Carregar Roteiro
  useEffect(() => {
    const stored = localStorage.getItem('selectedSchedule');
    if (stored) setSchedule(JSON.parse(stored));
  }, []);

  // 2. Obter Localização do Usuário
  useEffect(() => {
    if (!navigator.geolocation) {
      setMessage('Geolocalização não suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      () => {
        setMessage('Permissão de localização negada. Exibindo mapa padrão.');
      }
    );
  }, []);

  // 3. Função para gerar o URL do Google Maps
  const generateGoogleMapsUrl = (place: Place, userLocation: { lat: number; lng: number } | null) => {
    const destination = `${place.latitude},${place.longitude}`;

    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      // Rota do local do usuário até o destino
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }

    // Rota apenas com o destino
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
  };


  if (!schedule) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum roteiro selecionado.</p>
        </main>
      </div>
    );
  }

  const center = {
    lat: schedule.items[0]?.place?.latitude || -15.7975,
    lng: schedule.items[0]?.place?.longitude || -47.8919,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">{schedule.title}</h1>
        <p className="text-center text-muted-foreground mb-4">
          {new Date(schedule.date).toLocaleDateString('pt-BR')}
        </p>
        
        {message && (
          <p className="text-center text-red-600 mb-4">{message}</p>
        )}

        <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Marcador da localização do usuário */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>📍 Você está aqui! (Ponto de Partida)</Popup>
              </Marker>
            )}

            {schedule.items.map(
              (item) =>
                item.place && (
                  <Marker
                    key={item.id}
                    position={[item.place.latitude, item.place.longitude]}
                  >
                    <Popup>
                      <div className="text-sm max-w-xs">
                        <h3 className="font-semibold text-lg mb-2">{item.place.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Horário: {item.start_time} - {item.end_time}
                        </p>
                        {item.place.image_url && (
                          <img
                            src={item.place.image_url}
                            alt={item.place.name}
                            className="w-full h-32 rounded object-cover mb-4"
                          />
                        )}
                        
                        {/* NOVO LINK PARA O GOOGLE MAPS */}
                        <a
                            href={generateGoogleMapsUrl(item.place, userLocation)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full text-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                            Ir ao local (Rota)
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>
        </div>

        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push('perfil/roteiros')}>⬅️ Voltar aos Roteiros</Button>
        </div>
      </main>
    </div>
  );
}