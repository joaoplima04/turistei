"use client";

import { useState } from "react";
import { Header } from "@/components/hearder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SolicitarAtracaoPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [message, setMessage] = useState("");

  const enviarSolicitacao = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Você precisa estar logado para solicitar uma atração.");
      router.push("/login");
      return;
    }

    if (!name || !city || !latitude || !longitude) {
      setMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/attractions/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          user_id: Number(userId),
        }),
      });

      if (res.ok) {
        setMessage("Solicitação enviada com sucesso! Aguarde aprovação.");
        setName("");
        setCity("");
        setDescription("");
        setLatitude("");
        setLongitude("");
      } else {
        const err = await res.json();
        setMessage(err.detail || "Erro ao enviar solicitação.");
      }
    } catch (e) {
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-20 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Solicitar Nova Atração
        </h1>

        <div className="space-y-4">
          <Input
            placeholder="Nome da atração"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Textarea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />

          <Button className="w-full" onClick={enviarSolicitacao}>
            Enviar Solicitação
          </Button>

          {message && (
            <p className="text-center text-primary font-semibold mt-4">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
