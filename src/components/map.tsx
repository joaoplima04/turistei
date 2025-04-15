'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TouristSpot } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Mountain, Landmark, PartyPopper } from 'lucide-react';

// Fix for default marker icons
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const categoryIcons = {
    historical: <Landmark className="h-4 w-4" />,
    natural: <Mountain className="h-4 w-4" />,
    cultural: <Compass className="h-4 w-4" />,
    entertainment: <PartyPopper className="h-4 w-4" />
};

const categoryColors = {
    historical: 'bg-blue-500',
    natural: 'bg-green-500',
    cultural: 'bg-purple-500',
    entertainment: 'bg-yellow-500'
};

interface MapComponentProps {
    spots: TouristSpot[];
    center: [number, number];
    zoom: number;
}

export function MapComponent({ spots, center, zoom }: MapComponentProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {spots.map((spot) => (
                <Marker
                    key={spot.id}
                    position={[spot.latitude, spot.longitude]}
                >
                    <Popup className="tourist-popup" minWidth={300}>
                        <Card>
                            <CardHeader className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold">{spot.name}</CardTitle>
                                    <Badge variant="outline" className={`${categoryColors[spot.category]} text-white`}>
                                        <span className="mr-1">{categoryIcons[spot.category]}</span>
                                        {spot.category}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <img src={spot.image} alt={spot.name} className="w-full h-48 object-cover rounded-md mb-4" />
                                <p className="text-sm text-muted-foreground">{spot.description}</p>
                            </CardContent>
                        </Card>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}