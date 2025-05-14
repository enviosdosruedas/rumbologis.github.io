
"use client";

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { RepartosStatusChart } from "./charts/repartos-status-chart"; // Assuming this will be created

interface ResumenDeRepartosDelDiaSectionProps {
  asignados: number;
  enCurso: number;
  completados: number;
}

export function ResumenDeRepartosDelDiaSection({ asignados, enCurso, completados }: ResumenDeRepartosDelDiaSectionProps) {
  const chartData = [
    { name: "Asignados", count: asignados, fill: "hsl(var(--primary))" },
    { name: "En Curso", count: enCurso, fill: "hsl(var(--accent))" },
    { name: "Completados", count: completados, fill: "hsl(var(--secondary))" }, // Or another color
  ];

  const totalRepartos = asignados + enCurso + completados;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl col-span-1 lg:col-span-1"> {/* Ensure it takes one column */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Resumen de Repartos del Día</CardTitle>
        <CardDescription>Estado actual de los repartos programados para hoy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Asignados</p>
            <p className="text-2xl font-bold text-primary">{asignados}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">En Curso</p>
            <p className="text-2xl font-bold text-accent">{enCurso}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completados</p>
            <p className="text-2xl font-bold text-secondary-foreground">{completados}</p>
          </div>
        </div>
        
        {totalRepartos > 0 ? (
          <div className="h-[150px] w-full"> {/* Ensure chart has a defined height */}
            <RepartosStatusChart data={chartData} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No hay repartos para mostrar en el gráfico.</p>
        )}

        <Button asChild variant="outline" size="sm" className="w-full mt-2">
          <Link href="/repartos">Ver Detalles de Repartos</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
