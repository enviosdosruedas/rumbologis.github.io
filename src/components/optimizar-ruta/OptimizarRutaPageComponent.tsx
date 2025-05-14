
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import type { Reparto } from '@/types/reparto';
import type { ClienteReparto } from '@/types/cliente-reparto';
import { RepartoSelector } from './RepartoSelector';
import { MapaRutaOptimizada } from './MapaRutaOptimizada';
import { InstruccionesNavegacion } from './InstruccionesNavegacion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPinned, Info, Loader2 } from "lucide-react";

const START_LOCATION = "Av. Colón 1234, B7600FXS Mar del Plata, Provincia de Buenos Aires, Argentina";

interface EnrichedClienteReparto extends ClienteReparto {
  cliente_principal_nombre?: string;
}

export default function OptimizarRutaPageComponent() {
  const [repartos, setRepartos] = useState<Reparto[]>([]);
  const [selectedRepartoId, setSelectedRepartoId] = useState<number | null>(null);
  const [clientesRepartoRuta, setClientesRepartoRuta] = useState<EnrichedClienteReparto[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<google.maps.DirectionsResult | null>(null);
  const [isLoadingRepartos, setIsLoadingRepartos] = useState(true);
  const [isLoadingRuta, setIsLoadingRuta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRepartos = useCallback(async () => {
    setIsLoadingRepartos(true);
    setError(null);
    const { data, error: repartosError } = await supabase
      .from('repartos')
      .select('id, fecha_reparto, cliente_id, clientes(nombre)')
      .order('fecha_reparto', { ascending: false });

    if (repartosError) {
      toast({ title: 'Error al cargar repartos', description: repartosError.message, variant: 'destructive' });
      setError('No se pudieron cargar los repartos.');
      setRepartos([]);
    } else {
      setRepartos(data as Reparto[] || []);
    }
    setIsLoadingRepartos(false);
  }, [toast]);

  useEffect(() => {
    fetchRepartos();
  }, [fetchRepartos]);

  const handleRepartoSelect = useCallback(async (repartoId: string) => {
    const id = parseInt(repartoId, 10);
    setSelectedRepartoId(id);
    setOptimizedRoute(null);
    setClientesRepartoRuta([]);
    setError(null);

    if (!id) return;

    setIsLoadingRuta(true);
    
    // Fetch cliente_reparto details for the selected reparto
    const { data: repartoClienteRepartoLinks, error: linkError } = await supabase
      .from('reparto_cliente_reparto')
      .select('cliente_reparto_id, clientes_reparto(*, clientes(nombre))') // Join with clientes_reparto and then with clientes for main client name
      .eq('reparto_id', id);

    if (linkError) {
      toast({ title: 'Error al cargar detalles del reparto', description: linkError.message, variant: 'destructive' });
      setError('No se pudieron cargar los puntos de entrega para este reparto.');
      setIsLoadingRuta(false);
      return;
    }
    
    if (repartoClienteRepartoLinks && repartoClienteRepartoLinks.length > 0) {
        const enrichedClientesReparto = repartoClienteRepartoLinks
        // @ts-ignore Supabase specific join structure
        .map(link => ({
          ...link.clientes_reparto,
           // @ts-ignore
          cliente_principal_nombre: link.clientes_reparto.clientes?.nombre || 'Principal no especificado'
        }))
        .filter(cr => cr.direccion_reparto); // Filter out items without an address
      
      setClientesRepartoRuta(enrichedClientesReparto as EnrichedClienteReparto[]);

      if (enrichedClientesReparto.length === 0) {
        setError("No hay puntos de entrega con dirección válida para optimizar en este reparto.");
      }
    } else {
      setError("Este reparto no tiene puntos de entrega asignados o con dirección válida.");
    }
    setIsLoadingRuta(false);
  }, [toast]);
  
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
     return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error de Configuración</AlertTitle>
        <AlertDescription>
          La clave API de Google Maps no está configurada. La optimización de rutas no está disponible.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center">
            <MapPinned className="mr-2 h-6 w-6" /> Optimización de Rutas de Reparto
          </CardTitle>
          <CardDescription>Seleccione un reparto para calcular y visualizar la ruta de entrega más eficiente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RepartoSelector
            repartos={repartos}
            selectedRepartoId={selectedRepartoId}
            onSelectReparto={handleRepartoSelect}
            isLoading={isLoadingRepartos}
          />
          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isLoadingRuta && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Calculando ruta optimizada...</p>
        </div>
      )}

      {!isLoadingRuta && selectedRepartoId && clientesRepartoRuta.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Mapa de Ruta Optimizada</CardTitle>
            </CardHeader>
            <CardContent>
              <MapaRutaOptimizada
                apiKey={googleMapsApiKey}
                startLocation={START_LOCATION}
                destinations={clientesRepartoRuta}
                onRouteOptimized={setOptimizedRoute}
                onError={(mapError) => {
                  setError(`Error del mapa: ${mapError}`);
                  toast({ title: 'Error del Mapa', description: mapError, variant: 'destructive' });
                }}
              />
            </CardContent>
          </Card>
          <Card className="lg:col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle>Instrucciones de Navegación</CardTitle>
            </CardHeader>
            <CardContent>
              <InstruccionesNavegacion optimizedRoute={optimizedRoute} />
            </CardContent>
          </Card>
        </div>
      )}
       {!isLoadingRuta && selectedRepartoId && clientesRepartoRuta.length === 0 && !error && (
         <Alert>
           <Info className="h-4 w-4" />
           <AlertTitle>Sin Puntos para Optimizar</AlertTitle>
           <AlertDescription>El reparto seleccionado no tiene puntos de entrega con direcciones válidas para mostrar en el mapa.</AlertDescription>
         </Alert>
       )}
    </div>
  );
}

