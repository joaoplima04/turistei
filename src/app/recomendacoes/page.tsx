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

export default function RecomendacoesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleItemId = searchParams.get('scheduleItemId'); // veio do cadastro de roteiro
  const [recommendations, setRecommendations] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const [preferencesOptions, setPreferencesOptions] = useState<Preference[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) setUserId(Number(id));
  }, []);

  // Buscar todas as preferências + as do usuário
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

  // Buscar recomendações baseado nas preferências atuais
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

  // Selecionar local para um item do roteiro
  const handleSelectPlace = async (placeId: number) => {
    if (!scheduleItemId) return;

    try {
      const res = await fetch(
        `http://localhost:8000/schedule-items/${scheduleItemId}/set-place`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ place_id: placeId }),
        }
      );

      if (res.ok) {
        router.push('/roteiros');
      } else {
        const err = await res.json();
        setMessage(`Erro: ${err.message || 'Falha ao selecionar local'}`);
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
    }
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
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">
          Recomendações
        </h1>

        {/* Preferências do usuário */}
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
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">
                {attraction.name}
              </h2>
              <p className="text-muted-foreground mb-2">
                {attraction.description}
              </p>
              <p className="text-sm text-primary font-medium mb-4">
                Localização: {attraction.latitude}, {attraction.longitude}
              </p>

              {/* Só mostra botão se veio de um scheduleItem */}
              {scheduleItemId && (
                <Button
                  className="w-full"
                  onClick={() => handleSelectPlace(attraction.id)}
                >
                  Selecionar este Local
                </Button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
