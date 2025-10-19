'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/hearder';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Place {
  id: number;
  name: string;
  image_url?: string;
  latitude: number;
  longitude: number;
}

interface ScheduleItem {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  place?: Place;
}

interface Schedule {
  id: number;
  title: string;
  date: string; // formato YYYY-MM-DD
  items: ScheduleItem[];
}

export default function RoteirosPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    if (id) setUserId(Number(id));
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchSchedules = async () => {
      try {
        const res = await fetch(`http://localhost:8000/schedules/user/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setSchedules(data);
        }
      } catch (err) {
        console.error('Erro ao buscar roteiros:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [userId]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const daysInMonth = getDaysInMonth(month);
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  };

  const getScheduleForDay = (day: number) => {
    const dateStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.find((s) => s.date === dateStr);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Meus Roteiros</h1>

        {loading && <p className="text-center text-muted-foreground">Carregando roteiros...</p>}

        {!loading && schedules.length === 0 && (
          <p className="text-center text-muted-foreground">Você ainda não possui roteiros cadastrados.</p>
        )}

        {!loading && schedules.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full max-w-lg mb-4">
              <Button variant="outline" onClick={handlePrevMonth}>◀</Button>
              <h2 className="text-xl font-semibold">
                {month.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="outline" onClick={handleNextMonth}>▶</Button>
            </div>

            {/* Grade do calendário */}
            <div className="grid grid-cols-7 gap-3 w-full max-w-3xl">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-center font-medium text-muted-foreground">
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const schedule = getScheduleForDay(day);
                return (
                  <Card
                    key={day}
                    className={`cursor-pointer h-24 flex flex-col justify-center items-center ${
                      schedule ? 'bg-primary/10 border-primary hover:bg-primary/20' : 'bg-card'
                    }`}
                    onClick={() => schedule && setSelectedSchedule(schedule)}
                  >
                    <CardContent className="text-center p-2">
                      <p className="font-bold">{day}</p>
                      {schedule && (
                        <p className="text-xs text-primary mt-1 truncate w-20">
                          {schedule.title}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal de detalhes do roteiro */}
        {selectedSchedule && (
          <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{selectedSchedule.title}</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedSchedule.date).toLocaleDateString('pt-BR')}
                </p>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {selectedSchedule.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.start_time} - {item.end_time}
                    </p>
                    {item.place && (
                      <div className="flex items-center gap-3">
                        {item.place.image_url && (
                          <img
                            src={item.place.image_url}
                            alt={item.place.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <p className="text-sm">{item.place.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}
