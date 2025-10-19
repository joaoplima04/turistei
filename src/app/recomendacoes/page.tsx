'use client';

import { Suspense } from 'react';
import RecomendacoesContent from './RecomendacoesContent';

export default function RecomendacoesPage() {
  return (
    <Suspense fallback={<div>Carregando recomendações...</div>}>
      <RecomendacoesContent />
    </Suspense>
  );
}