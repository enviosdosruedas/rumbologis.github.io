
"use client";

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

interface ClientesPrincipalesSectionProps {
  totalClientes: number;
}

export function ClientesPrincipalesSection({ totalClientes }: ClientesPrincipalesSectionProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Clientes Principales</CardTitle>
        <CardDescription>Visión general de la cartera de clientes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-md">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <span className="text-sm text-primary">Total de Clientes</span>
          </div>
          <span className="text-2xl font-bold text-primary">{totalClientes}</span>
        </div>
        {/* Placeholder for future enhancements like top clients or chart */}
        <p className="text-xs text-muted-foreground pt-2 text-center">
          Análisis detallado y clientes destacados próximamente.
        </p>
      </CardContent>
    </Card>
  );
}
