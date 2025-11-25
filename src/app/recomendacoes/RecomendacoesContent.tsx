'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/hearder';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Attraction {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

interface Preference {
  id: number;
  name: string;
}

export default function RecomendacoesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleItemId = searchParams.get('scheduleItemId');
  const [recommendations, setRecommendations] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const [preferencesOptions, setPreferencesOptions] = useState<Preference[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  // Localização do usuário
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // -------------------------------
  // 1) Obter geolocalização
  // -------------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.warn("Erro ao obter localização:", err)
      );
    }
  }, []);

  // -------------------------------
  // 2) Haversine - calcular distância
  // -------------------------------
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // -------------------------------
  // 3) Ordenar por distância
  // -------------------------------
  const ordenarPorDistancia = () => {
    if (!userLocation) {
      setMessage("Não foi possível acessar sua localização.");
      return;
    }

    const sorted = [...recommendations].sort((a, b) => {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
      return distA - distB;
    });

    setRecommendations(sorted);
  };

  // Buscar user_id
  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) setUserId(Number(id));
  }, []);

  // Buscar preferências
  useEffect(() => {
    if (!userId) return;

    const fetchPreferences = async () => {
      try {
        const all = await fetch('http://localhost:8000/preferences/get-preferences');
        const allData = await all.json();
        setPreferencesOptions(allData);

        const userRes = await fetch(
          `http://localhost:8000/preferences/get-user-preferences?user_id=${userId}`
        );
        if (userRes.ok) {
          const userPrefs = await userRes.json();
          const prefNames = userPrefs.map((pref: Preference) => pref.name);
          setSelectedPreferences(prefNames);
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    };

    fetchPreferences();
  }, [userId]);

  // Buscar recomendações
  useEffect(() => {
    if (!userId) return;
    fetchRecommendations();
  }, [userId, selectedPreferences]);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/recommendations/get-recommendations/${userId}`
      );
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      } else {
        setMessage('Não foi possível carregar as recomendações.');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const togglePreferencia = (name: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const salvarPreferencias = async () => {
    if (!userId) return;

    try {
      const response = await fetch('http://localhost:8000/preferences/save-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, preferences: selectedPreferences }),
      });

      if (response.ok) {
        setMessage('Preferências salvas com sucesso!');
        fetchRecommendations();
      } else {
        const error = await response.json();
        setMessage(`Erro: ${error.message || 'Falha ao salvar preferências'}`);
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
    }
  };

  const handleSelectPlace = (placeId: number) => {
    if (!scheduleItemId) return;

    const storedDraft = localStorage.getItem("draftSchedule");
    if (storedDraft) {
      const draft = JSON.parse(storedDraft);

      draft.items = draft.items.map((item: any) =>
        item.id === Number(scheduleItemId) ? { ...item, placeId } : item
      );

      localStorage.setItem("draftSchedule", JSON.stringify(draft));
    }

    router.push("/cadastra_roteiros");
  };

  const handleViewOnMap = (attraction: Attraction) => {
    localStorage.setItem('recommendedPlace', JSON.stringify(attraction));
    router.push('/mapa-recomendacoes');
  };

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl text-center">
          <p className="text-muted-foreground">Carregando usuário...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-primary">
          Recomendações
        </h1>

        {/* Botão de ordenar por distância */}
        <div className="flex justify-center mb-10">
          <Button onClick={ordenarPorDistancia} className="bg-blue-600 hover:bg-blue-700">
            📏 Ordenar por Distância
          </Button>
        </div>

        {/* Seção de Preferências */}
        <div className="mb-8 border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Alterar Preferências</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {preferencesOptions.map((pref) => (
              <label
                key={pref.id}
                className="flex items-center gap-2 p-3 border rounded-lg bg-card cursor-pointer"
              >
                <Checkbox
                  checked={selectedPreferences.includes(pref.name)}
                  onCheckedChange={() => togglePreferencia(pref.name)}
                />
                <span>{pref.name}</span>
              </label>
            ))}
          </div>
          <Button onClick={salvarPreferencias} disabled={loading}>
            Salvar Preferências
          </Button>
        </div>

        {loading && (
          <p className="text-center text-muted-foreground">
            Carregando recomendações...
          </p>
        )}

        {!loading && recommendations.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhuma recomendação encontrada para suas preferências.
          </p>
        )}

        {message && (
          <p className="text-center text-red-600 mb-6">{message}</p>
        )}

        {/* Lista de Recomendações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recommendations.map((attraction) => (
            <div
              key={attraction.id}
              className="bg-card p-6 rounded-lg border shadow-sm"
            >
              {attraction.image_url && (
                <img
                  src={attraction.image_url}
                  alt={attraction.name}
                  className="w-full h-52 object-cover rounded mb-4"
                />
              )}

              <h2 className="text-2xl font-bold leading-snug mb-3">
                {attraction.name}
              </h2>

              <p className="text-gray-700 text-base mb-3">
                {attraction.description}
              </p>

              <p className="text-sm text-primary font-medium mt-4 mb-2">
                Localização: {attraction.latitude}, {attraction.longitude}
              </p>

              {/* Distância */}
              {userLocation && (
                <p className="text-sm text-muted-foreground mb-4">
                  Distância:{" "}
                  {calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    attraction.latitude,
                    attraction.longitude
                  ).toFixed(2)}{" "}
                  km
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <Button
                  className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  onClick={() => handleViewOnMap(attraction)}
                >
                  🗺️ Visualizar no Mapa
                </Button>

                {scheduleItemId && (
                  <Button
                    className="flex-1"
                    onClick={() => handleSelectPlace(attraction.id)}
                  >
                    Selecionar este Local
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
