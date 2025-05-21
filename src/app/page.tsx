import Link from 'next/link';
import { Header } from '@/components/hearder';
import { Button } from '@/components/ui/button';
import { MapIcon, Navigation, Camera, Compass, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-6">
              Descubra o Brasil
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore os pontos turísticos mais incríveis das Cidades Maravilhosas com o Turistei,
              seu guia interativo para uma experiência inesquecível.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/mapa">
                <Button size="lg" className="gap-2">
                  <MapIcon className="w-5 h-5" />
                  Explorar o Mapa
                </Button>
              </Link>

              <Link href="/login">
                <Button variant="outline" size="lg" className="gap-2">
                  <LogIn className="w-5 h-5" />
                  Entrar
                </Button>
              </Link>

              <Link href="/cadastro">
                <Button variant="ghost" size="lg" className="gap-2">
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card p-6 rounded-lg border">
              <Navigation className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Navegação Intuitiva</h3>
              <p className="text-muted-foreground">
                Mapa interativo com interface amigável para localizar facilmente os pontos turísticos.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <Camera className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fotos e Informações</h3>
              <p className="text-muted-foreground">
                Visualize imagens e detalhes importantes sobre cada atração turística.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <Compass className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pontos Destacados</h3>
              <p className="text-muted-foreground">
                Descubra os lugares mais populares e imperdíveis do Brasil.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Projeto Universitário UniCEUB</h2>
            <p className="text-muted-foreground">
              O Turistei é um projeto desenvolvido por estudantes do UniCEUB,
              com o objetivo de facilitar a exploração turística do Brasil
              através de tecnologia e design moderno.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
