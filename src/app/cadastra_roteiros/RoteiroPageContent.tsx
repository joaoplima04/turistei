'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Header } from '@/components/hearder';

interface ScheduleItem {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  placeId?: number;
}

export default function RoteiroContent() {
  const router = useRouter();
  const [title, setTitle] = useState(() => {
    const storedDraft = localStorage.getItem("draftSchedule");
    if (storedDraft) {
      const draft = JSON.parse(storedDraft);
      return draft.title || "";
    }
    return "";
  });
  const [date, setDate] = useState(() => {
    const storedDraft = localStorage.getItem("draftSchedule");
    if (storedDraft) {
      const draft = JSON.parse(storedDraft);
      return draft.date || "";
    }
    return "";
  });
  const [items, setItems] = useState<ScheduleItem[]>(() => {
    const storedDraft = localStorage.getItem("draftSchedule");
    if (storedDraft) {
      const draft = JSON.parse(storedDraft);
      return draft.items || [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "draftSchedule",
      JSON.stringify({ title, date, items })
    );
  }, [title, date, items]);

  const addItem = () => {
    const newItem: ScheduleItem = {
      id: Date.now(),
      title: "",
      startTime: "",
      endTime: "",
      description: "",
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: number, field: keyof ScheduleItem, value: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  return (
    <div className="max-w-3xl mx-auto p-16">
      <Header />
      <h1 className="text-2xl font-bold mb-6">Criar Roteiro</h1>

      <Input
        placeholder="Título do Roteiro"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-6"
      />

      <Input
        type="date"
        placeholder="Data do Roteiro"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-6"
      />

      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 mb-4 shadow-sm bg-white"
        >
          <Input
            placeholder="Título da Atividade"
            value={item.title}
            onChange={(e) => updateItem(item.id, "title", e.target.value)}
            className="mb-2"
          />

          <Input
            type="time"
            placeholder="Horário de Início (ex: 08:00)"
            value={item.startTime}
            onChange={(e) => updateItem(item.id, "startTime", e.target.value)}
            className="mb-2"
          />

          <Input
            type="time"
            placeholder="Horário de Término (ex: 09:00)"
            value={item.endTime}
            onChange={(e) => updateItem(item.id, "endTime", e.target.value)}
            className="mb-2"
          />

          <Textarea
            placeholder="Descrição"
            value={item.description}
            onChange={(e) =>
              updateItem(item.id, "description", e.target.value)
            }
            className="mb-2"
          />

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              router.push(`/recomendacoes?scheduleItemId=${item.id}`)
            }
          >
            {item.placeId ? "Alterar Local Selecionado" : "Selecionar um Local"}
          </Button>
        </div>
      ))}

      <Button onClick={addItem} className="mb-6">
        + Adicionar Atividade
      </Button>

      <Button
  className="w-full"
  onClick={async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Usuário não encontrado, faça login novamente.");
      return;
    }

    const payload = {
      title,
      date,
      user_id: Number(userId),
      items: items.map((i) => ({
        title: i.title,
        description: i.description,
        start_time: i.startTime,
        end_time: i.endTime,
        place_id: i.placeId ?? null,
      })),
    };

    try {
      const res = await fetch("http://localhost:8000/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Roteiro salvo com sucesso:", data);

        // limpar cache
        localStorage.removeItem("draftSchedule");
        localStorage.removeItem("selectedPlaces");

        alert("Roteiro salvo com sucesso!");
        router.push("/meus_roteiros"); // redirecionar para listagem
      } else {
        const err = await res.json();
        alert(`Erro ao salvar roteiro: ${err.detail || "Falha desconhecida"}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }}
>
  Salvar Roteiro
</Button>
    </div>
  );
}