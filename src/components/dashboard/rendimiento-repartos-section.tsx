
"use client";

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function RendimientoRepartosSection() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Rendimiento de Repartos</CardTitle>
        <CardDescription>Métricas clave sobre la eficiencia de las entregas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <TrendingUp className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Métricas de rendimiento y gráficos detallados estarán disponibles aquí próximamente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
