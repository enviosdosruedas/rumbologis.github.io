
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ListOrdered, Route, CheckCircle, AlertCircle } from 'lucide-react';

interface InstruccionesNavegacionProps {
  optimizedRoute: google.maps.DirectionsResult | null;
}

export function InstruccionesNavegacion({ optimizedRoute }: InstruccionesNavegacionProps) {
  if (!optimizedRoute || optimizedRoute.routes.length === 0) {
    return (
      <Alert variant="default" className="bg-secondary/30 border-secondary">
        <Route className="h-4 w-4" />
        <AlertDescription>
          Seleccione un reparto y calcule la ruta para ver las instrucciones de navegación.
        </AlertDescription>
      </Alert>
    );
  }

  const route = optimizedRoute.routes[0]; // Assuming the first route is the one we want
  const legs = route.legs;

  // The waypoint_order array gives the optimized order of waypoints.
  // We need to map this back to the original destination names/addresses.
  // This part requires knowing the original list of destinations passed to DirectionsService
  // to correctly label the optimized stops. For simplicity, we'll list steps directly.

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        <ScrollArea className="h-[450px] w-full">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
                <ListOrdered className="mr-2 h-5 w-5 text-primary" />
                <span>Orden de Visita Optimizado:</span>
            </div>
            {legs.map((leg, legIndex) => (
              <div key={legIndex} className="p-3 border rounded-md bg-background shadow-sm">
                <div className="font-semibold text-primary mb-1">
                  Parada {legIndex + 1}: {leg.end_address}
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Desde: {leg.start_address}</p>
                  <p>Distancia: {leg.distance?.text}</p>
                  <p>Duración Estimada: {leg.duration?.text}</p>
                </div>
                {/* Optional: Detailed steps for each leg - can be very verbose */}
                {/* <details className="mt-2">
                  <summary className="text-xs cursor-pointer text-blue-600 hover:underline">Ver pasos detallados</summary>
                  <ol className="list-decimal list-inside pl-4 mt-1 space-y-1 text-xs">
                    {leg.steps.map((step, stepIndex) => (
                      <li key={stepIndex} dangerouslySetInnerHTML={{ __html: step.instructions }} />
                    ))}
                  </ol>
                </details> */}
              </div>
            ))}
            <div className="p-3 border-t border-dashed mt-3 text-center text-sm font-medium">
                <CheckCircle className="inline-block mr-2 h-5 w-5 text-green-500" />
                Fin de la ruta optimizada.
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
