
import type React from 'react';

interface DashboardHeaderProps {
  currentDate: string;
}

export function DashboardHeader({ currentDate }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard de Repartos</h1>
      <p className="text-muted-foreground">Resumen para el día: {currentDate}</p>
    </div>
  );
}
