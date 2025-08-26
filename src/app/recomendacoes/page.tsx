'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/hearder';

interface Attraction {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
}

export default function RecomendacoesPage() {
  const [recommendations, setRecommendations] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) {
      setUserId(Number(id));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

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

    fetchRecommendations();
  }, [userId]);

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
        <h1 className="text-4xl font-bold mb-8 text-center text-primary">Recomendações</h1>

        {loading && <p className="text-center text-muted-foreground">Carregando recomendações...</p>}

        {!loading && recommendations.length === 0 && (
          <p className="text-center text-muted-foreground">
            Nenhuma recomendação encontrada para suas preferências.
          </p>
        )}

        {message && <p className="text-center text-red-600 mb-6">{message}</p>}

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
              <h2 className="text-xl font-semibold mb-2">{attraction.name}</h2>
              <p className="text-muted-foreground mb-2">{attraction.description}</p>
              <p className="text-sm text-primary font-medium">
                Localização: {attraction.latitude}, {attraction.longitude}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
