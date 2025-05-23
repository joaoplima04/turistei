'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Link from 'next/link';

const preferencesOptions = ['Bares', 'Restaurantes', 'Shows', 'Pontos turísticos'];

export default function Cadastro() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setPreferences(prev =>
      checked ? [...prev, value] : prev.filter(pref => pref !== value)
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const payload = { ...form, preferences };

    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage('Cadastro realizado com sucesso!');
        setForm({ name: '', email: '', password: '' });
        setPreferences([]);
      } else {
        const errorData = await response.json();
        setMessage(`Erro: ${errorData.message || 'Falha no cadastro.'}`);
      }
    } catch (err) {
      setMessage('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Cadastro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <fieldset className="border rounded p-4">
          <legend className="text-sm font-semibold mb-2">Preferências</legend>
          {preferencesOptions.map(option => (
            <label key={option} className="block text-sm mb-1">
              <input
                type="checkbox"
                value={option}
                checked={preferences.includes(option)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes('sucesso') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-4 text-center text-sm">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
