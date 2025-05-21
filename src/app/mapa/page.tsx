import dynamic from 'next/dynamic';
import { touristSpots } from '@/lib/mock-data';
import { Header } from '@/components/hearder';

const MapComponent = dynamic(() => import('@/components/map'), {
  ssr: false, // ← 🔥 impede o Next.js de renderizar no servidor
});

export default function MapPage() {
  const center: [number, number] = [-22.9068, -43.1729];
  const zoom = 12;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        <MapComponent spots={touristSpots} center={center} zoom={zoom} />
      </main>
    </div>
  );
}
