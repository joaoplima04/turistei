'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/hearder';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Preference {
  id: number;
  name: string;
}

export default function PreferenciasPage() {
  const [preferencesOptions, setPreferencesOptions] = useState<Preference[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Garantir que localStorage só é acessado no cliente
    const id = localStorage.getItem('user_id');
    if (id) {
      setUserId(Number(id));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchAllPreferences = async () => {
      try {
        // 1. Buscar todas as opções disponíveis
        const all = await fetch('http://localhost:8000/preferences/get-preferences');
        const allData = await all.json();
        setPreferencesOptions(allData);

        // 2. Buscar as preferências do usuário
        const userRes = await fetch(
          `http://localhost:8000/preferences/get-user-preferences?user_id=${userId}`
        );
        if (userRes.ok) {
          const userPrefs = await userRes.json();
          const prefNames = userPrefs.map((pref: Preference) => pref.name);
          setSelectedPreferences(prefNames);
        } else {
          console.warn('Usuário ainda não tem preferências salvas');
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPreferences();
  }, [userId]);

  const togglePreferencia = (name: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
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
      } else {
        const error = await response.json();
        setMessage(`Erro: ${error.message || 'Falha ao salvar preferências'}`);
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
    }
  };

  if (!userId) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 max-w-3xl text-center">
          <p className="text-muted-foreground">Carregando usuário...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-primary">Preferências</h1>

        {loading ? (
          <p className="text-center text-muted-foreground">Carregando preferências...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
        )}

        <div className="text-center">
          <Button onClick={salvarPreferencias} disabled={loading}>
            Salvar Preferências
          </Button>
        </div>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.includes('sucesso') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
