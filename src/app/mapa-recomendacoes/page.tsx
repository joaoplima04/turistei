// src/app/mapa_recomendacoes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/hearder';

// Corrige o ícone padrão do Leaflet
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
  description?: string; // Incluindo descrição para o Popup
}

export default function MapaRecomendacoesPage() {
  const router = useRouter();
  // Estado para armazenar o local que veio do localStorage
  const [place, setPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [message, setMessage] = useState('');

  const defaultCenter = { lat: -15.7975, lng: -47.8919 }; // Brasília

  // 1. Carregar o Local Selecionado do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recommendedPlace');
    if (stored) {
      setPlace(JSON.parse(stored));
      // Limpa o item para evitar que ele persista
      localStorage.removeItem('recommendedPlace'); 
    }
  }, []);

  // 2. Obter Localização do Usuário (para rota)
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
        setMessage('Permissão de localização negada.');
      }
    );
  }, []);

  // 3. Função para gerar o URL do Google Maps
  const generateGoogleMapsUrl = (dest: Place, userLoc: { lat: number; lng: number } | null) => {
    const destination = `${dest.latitude},${dest.longitude}`;
    if (userLoc) {
      const origin = `${userLoc.lat},${userLoc.lng}`;
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
  };

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum local para exibir no mapa.</p>
        </main>
      </div>
    );
  }
  
  const center = { lat: place.latitude, lng: place.longitude };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-primary">
          Localização: {place.name}
        </h1>
        
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
                <Popup>📍 Você está aqui! (Origem)</Popup>
              </Marker>
            )}

            {/* Marcador do Local Recomendado */}
            <Marker position={[place.latitude, place.longitude]}>
              <Popup>
                <div className="text-sm max-w-xs">
                  <h3 className="font-semibold text-lg mb-2">{place.name}</h3>
                  {place.image_url && (
                    <img
                      src={place.image_url}
                      alt={place.name}
                      className="my-3 w-full h-32 object-cover rounded"
                    />
                  )}
                  <p className="my-3 text-muted-foreground text-sm">
                    {place.description || "Descrição indisponível."}
                  </p>
                  
                  {/* Link para Rota */}
                  <a
                    href={generateGoogleMapsUrl(place, userLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors mt-3"
                  >
                    Ir ao local (Rota)
                  </a>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="flex justify-center mt-6">
          {/* Botão de voltar que retorna à página de onde veio (Recomendações) */}
          <Button onClick={() => router.back()}>
                ⬅️ Voltar às Recomendações
            </Button>
        </div>
      </main>
    </div>
  );
}