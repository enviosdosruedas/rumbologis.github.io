
"use client";

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Users, UsersRound } from "lucide-react";

interface RepartidoresActivosSectionProps {
  totalRepartidores: number;
  repartidoresActivos: number;
}

export function RepartidoresActivosSection({ totalRepartidores, repartidoresActivos }: RepartidoresActivosSectionProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Repartidores</CardTitle>
        <CardDescription>Estado de los repartidores de la flota.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total de Repartidores</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{totalRepartidores}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-accent/10 rounded-md">
           <div className="flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-accent" />
            <span className="text-sm text-accent">Repartidores en Ruta Hoy</span>
          </div>
          <span className="text-2xl font-bold text-accent">{repartidoresActivos}</span>
        </div>
         {/* Placeholder for future enhancements like a list or map */}
        <p className="text-xs text-muted-foreground pt-2 text-center">
          Más detalles y mapa de repartidores próximamente.
        </p>
      </CardContent>
    </Card>
  );
}
