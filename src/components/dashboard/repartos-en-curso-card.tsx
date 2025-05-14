
"use client"; // Card can be client or server, making it client for potential future interactivity

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";

interface RepartosEnCursoCardProps {
  count: number;
}

export function RepartosEnCursoCard({ count }: RepartosEnCursoCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-accent">
          Repartos En Curso Hoy
        </CardTitle>
        <Hourglass className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold text-foreground">{count}</div>
         <p className="text-xs text-muted-foreground pt-1">
          Total de repartos marcados como 'En Curso' para hoy.
        </p>
      </CardContent>
    </Card>
  );
}
