"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/hearder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminSolicitacoesPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Proteção básica (apenas admins)
  // useEffect(() => {
    //const isAdmin = localStorage.getItem("is_admin");

    //if (isAdmin !== "true") {
      //alert("Você não tem permissão para acessar esta página.");
      //router.push("/");
    //}
  //}, []);

  // Carregar solicitações pendentes
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:8000/attractions/admin/requests");

      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Erro ao carregar solicitações.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Aprovar
  const approve = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/attractions/admin/requests/${id}/approve`,
        { method: "POST" }
      );

      if (res.ok) {
        setMessage("Atração aprovada!");
        fetchRequests();
      } else {
        const err = await res.json();
        setMessage(err.detail || "Erro ao aprovar.");
      }
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  // Rejeitar
  const reject = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/attractions/admin/requests/${id}/reject`,
        { method: "POST" }
      );

      if (res.ok) {
        setMessage("Solicitação rejeitada.");
        fetchRequests();
      } else {
        const err = await res.json();
        setMessage(err.detail || "Erro ao rejeitar.");
      }
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-primary">Solicitações de Atrações</h1>

        {loading && <p className="text-muted-foreground">Carregando solicitações...</p>}

        {message && (
          <p className="text-center font-semibold text-primary my-4">{message}</p>
        )}

        {!loading && requests.length === 0 && (
          <p className="text-muted-foreground text-center">
            Nenhuma solicitação pendente.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6">
          {requests.map((req) => (
            <Card key={req.id} className="border rounded-lg shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">{req.name}</h2>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Cidade:</strong> {req.city}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Descrição:</strong> {req.description || "Não informada"}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Latitude:</strong> {req.latitude}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Longitude:</strong> {req.longitude}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  <strong>Solicitado por usuário ID:</strong> {req.user_id}
                </p>

                <div className="flex gap-4 mt-4">
                  <Button
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    onClick={() => approve(req.id)}
                  >
                    Aprovar
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => reject(req.id)}
                  >
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
