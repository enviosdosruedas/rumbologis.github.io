
"use client"; // Card can be client or server, making it client for potential future interactivity

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react"; 

interface RepartosAsignadosCardProps {
  count: number;
}

export function RepartosAsignadosCard({ count }: RepartosAsignadosCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-primary">
          Repartos Asignados Hoy
        </CardTitle>
        <Truck className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold text-foreground">{count}</div>
        <p className="text-xs text-muted-foreground pt-1">
          Total de repartos programados como 'Asignado' para hoy.
        </p>
      </CardContent>
    </Card>
  );
}
