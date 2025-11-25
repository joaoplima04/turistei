'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Header } from '@/components/hearder';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

// 🧭 Corrige o ícone padrão do Leaflet que costuma quebrar no Next.js
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
  description?: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  preferences?: { name: string }[];
}

interface Preference {
  id: number;
  name: string;
}

export default function MapaPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const defaultCenter = { lat: -15.7975, lng: -47.8919 }; // Brasília

  // 🆕 Função para gerar o URL de rotas do Google Maps
  const generateGoogleMapsUrl = (place: Place, userLocation: { lat: number; lng: number } | null) => {
    const destination = `${place.latitude},${place.longitude}`;

    if (userLocation) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      // Rota do local do usuário até o destino (modo de carro)
      return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }

    // Rota apenas com o destino. O Google Maps irá usar a localização atual do usuário como origem.
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
  };


  // 🔹 Carregar lugares e preferências
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, prefsRes] = await Promise.all([
          fetch('http://localhost:8000/places'),
          fetch('http://localhost:8000/preferences/get-preferences'),
        ]);

        if (!placesRes.ok || !prefsRes.ok) {
          throw new Error('Erro ao buscar dados do servidor.');
        }

        const placesData = await placesRes.json();
        const prefsData = await prefsRes.json();

        setPlaces(placesData);
        setFilteredPlaces(placesData);
        setPreferences(prefsData);
      } catch (err) {
        setMessage('Erro ao carregar dados do mapa.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Obter localização atual do usuário
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

  // 🔹 Filtrar locais por preferências
  const applyFilters = () => {
    if (selectedPrefs.length === 0) {
      setFilteredPlaces(places);
      return;
    }

    const filtered = places.filter((p) =>
      p.preferences?.some((pref) => selectedPrefs.includes(pref.name))
    );

    setFilteredPlaces(filtered);
  };

  const togglePreference = (name: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">
          Mapa de Locais Turísticos
        </h1>

        {loading && (
          <p className="text-center text-muted-foreground">
            Carregando mapa...
          </p>
        )}

        {message && (
          <p className="text-center text-red-600 mb-4">{message}</p>
        )}

        {/* 🔍 Filtros */}
        <div className="mb-6 border rounded-lg p-4 bg-card shadow-sm">
          <h2 className="font-semibold mb-3 text-lg">Filtrar por Preferências</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {preferences.map((pref) => (
              <label
                key={pref.id}
                className="flex items-center gap-2 p-2 border rounded-md bg-background cursor-pointer hover:bg-accent transition"
              >
                <Checkbox
                  checked={selectedPrefs.includes(pref.name)}
                  onCheckedChange={() => togglePreference(pref.name)}
                />
                <span>{pref.name}</span>
              </label>
            ))}
          </div>
          <Button onClick={applyFilters}>Aplicar Filtros</Button>
        </div>

        {/* 🗺️ Mapa */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow">
          <MapContainer
            center={userLocation || defaultCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 📍 Marcador da localização do usuário */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>📍 Você está aqui!</Popup>
              </Marker>
            )}

            {/* 📍 Marcadores dos locais turísticos */}
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.latitude, place.longitude]}
              >
                // 🚀 Trecho Otimizado com Melhor Espaçamento:
              <Popup>
                <div className="text-sm max-w-xs"> {/* Adicionada max-w-xs para popups não muito largos */}
                  <h3 className="font-semibold text-lg mb-2">{place.name}</h3> {/* Adiciona margem inferior */}
                  
                  {place.image_url && (
                    <img
                      src={place.image_url}
                      alt={place.name}
                      className="my-3 w-full h-32 object-cover rounded" // Ajuste my-3
                    />
                  )}
                  
                  {/* Ajusta espaçamento superior e inferior da descrição */}
                  <p className="my-3 text-muted-foreground text-sm">
                    {place.description}
                  </p>
                  
                  {place.preferences && (
                    // Adiciona margem inferior para separar as preferências do botão
                    <p className="mt-2 mb-4 text-xs text-primary"> 
                      {place.preferences.map((p) => p.name).join(', ')}
                    </p>
                  )}
                  
                  {/* Remove o mt-3 do botão, pois o mb-4 das preferências já cria o espaço */}
                  <a
                    href={generateGoogleMapsUrl(place, userLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors" // Estilo similar ao da imagem
                  >
                    Ir ao local (Rota)
                  </a>
                </div>
              </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}