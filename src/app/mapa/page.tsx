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

  const center = { lat: -15.7975, lng: -47.8919 }; // Brasília

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
            center={center}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                position={[place.latitude, place.longitude]}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-semibold text-lg">{place.name}</h3>
                    {place.image_url && (
                      <img
                        src={place.image_url}
                        alt={place.name}
                        className="mt-2 w-full h-32 object-cover rounded"
                      />
                    )}
                    <p className="mt-2 text-muted-foreground text-sm">
                      {place.description}
                    </p>
                    {place.preferences && (
                      <p className="mt-2 text-xs text-primary">
                        {place.preferences.map((p) => p.name).join(', ')}
                      </p>
                    )}
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
