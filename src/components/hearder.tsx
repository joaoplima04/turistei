'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/80 backdrop-blur-sm border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold text-primary">Turistei</span>
                </Link>
                <div className="flex items-center">
                    <span className="text-lg font-semibold text-muted-foreground">UniCEUB</span>
                </div>
            </div>
        </header>
    );
}