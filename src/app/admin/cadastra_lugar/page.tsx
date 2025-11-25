'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/hearder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

interface Preference {
  id: number;
  name: string;
}

export default function CadastraLugarPage() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Brasília');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar preferências disponíveis
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch('http://localhost:8000/preferences/get-preferences');
        const data = await res.json();
        setPreferences(data);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    };
    fetchPreferences();
  }, []);

  const togglePreference = (name: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // 🔹 Enviar dados para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !latitude || !longitude) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const placeData = {
      name,
      city,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      image_url: imageUrl || null,
      preferences: selectedPrefs,
    };

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/places/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData),
      });

      if (res.ok) {
        setMessage('✅ Lugar cadastrado com sucesso!');
        setName('');
        setCity('Brasília');
        setDescription('');
        setLatitude('');
        setLongitude('');
        setImageUrl('');
        setSelectedPrefs([]);
      } else {
        const err = await res.json();
        setMessage(`❌ Erro: ${err.detail || 'Falha ao cadastrar lugar'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Cadastrar Novo Lugar
        </h1>

        <Card className="shadow-md border">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-medium">Nome *</label>
                <Input
                  placeholder="Ex: Museu Nacional da República"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-medium">Cidade *</label>
                <Input
                  placeholder="Ex: Brasília"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium">Descrição</label>
                <Textarea
                  placeholder="Ex: Um dos principais museus de arte moderna do Brasil."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Latitude *</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="-15.7941"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="font-medium">Longitude *</label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="-47.8825"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium">Imagem (URL)</label>
                <Input
                  placeholder="Ex: https://exemplo.com/imagem.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium mb-2 block">Preferências</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {preferences.map((pref) => (
                    <label
                      key={pref.id}
                      className="flex items-center gap-2 p-2 border rounded-lg bg-card cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPrefs.includes(pref.name)}
                        onCheckedChange={() => togglePreference(pref.name)}
                      />
                      <span>{pref.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Cadastrar Lugar'}
              </Button>
            </form>

            {message && (
              <p
                className={`mt-4 text-center text-sm font-medium ${
                  message.includes('sucesso')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}