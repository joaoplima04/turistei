import Link from 'next/link';
import { Header } from '@/components/hearder';
import { Button } from '@/components/ui/button';
import {
  MapIcon,
  SlidersHorizontal,
  Wand2,
  NotebookPen,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Turistei - Monte sua Jornada Ideal
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Cadastre suas preferências, descubra atrações recomendadas e crie roteiros turísticos personalizados por todo o Brasil.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/preferencias">
                <Button size="lg" className="gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Minhas Preferências
                </Button>
              </Link>

              <Link href="/recomendacoes">
                <Button variant="outline" size="lg" className="gap-2">
                  <Wand2 className="w-5 h-5" />
                  Recomendações
                </Button>
              </Link>

              <Link href="/cadastra_roteiros">
                <Button variant="ghost" size="lg" className="gap-2">
                  <NotebookPen className="w-5 h-5" />
                  Criar roteiros
                </Button>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
              <Link href="/login">
                <Button variant="secondary" size="lg" className="gap-2">
                  <LogIn className="w-5 h-5" />
                  Entrar
                </Button>
              </Link>

            <Link href="/perfil/roteiros">
            <Button variant="outline" size="lg" className="gap-2">
              <NotebookPen className="w-5 h-5" />
              Meus Roteiros
            </Button>
            </Link>

            <Link href="/mapa">
            <Button variant="outline" size="lg" className="gap-2">
              <NotebookPen className="w-5 h-5" />
              Mapa
            </Button>
            </Link>

              <Link href="/cadastro">
                <Button variant="outline" size="lg" className="gap-2">
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </Button>
              </Link>

              <Link href="/solicitar-atracao">
              <Button variant="outline" size="lg" className="gap-2">
                <Wand2 className="w-5 h-5" />
                Sugerir Atração
              </Button>
            </Link>
            
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card p-6 rounded-lg border">
              <SlidersHorizontal className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Preferências Personalizadas</h3>
              <p className="text-muted-foreground">
                Escolha os tipos de atrações que mais gosta e personalize sua experiência de viagem.
              </p>
            </div>


            <div className="bg-card p-6 rounded-lg border">
              <Wand2 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Recomendações Inteligentes</h3>
              <p className="text-muted-foreground">
                Receba sugestões de destinos com base nas suas preferências cadastradas.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <NotebookPen className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Roteiros Personalizados</h3>
              <p className="text-muted-foreground">
                Organize suas atrações favoritas em roteiros salvos e editáveis.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Projeto MVP - UniCEUB</h2>
            <p className="text-muted-foreground">
              Este projeto é parte da disciplina de Desenvolvimento de Software e visa entregar uma solução funcional para turistas planejarem suas viagens de forma personalizada e interativa.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
