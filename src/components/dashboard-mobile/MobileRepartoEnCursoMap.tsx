
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import type { EnrichedClienteRepartoTask } from '@/app/dashboardrepartomobile/page'; // Adjust path as necessary
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const MAP_CONTAINER_STYLE = {
  height: '300px', // Adjust as needed
  width: '100%',
  borderRadius: '0.5rem', // Match card rounding
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

const MAR_DEL_PLATA_CENTER = {
  lat: -38.005477, // Mar del Plata approx center
  lng: -57.542611,
};

// Define the bounds for Mar del Plata
// These are approximate and can be refined.
const MAR_DEL_PLATA_BOUNDS = {
  north: -37.9,
  south: -38.1,
  west: -57.7,
  east: -57.4,
};

interface MobileRepartoEnCursoMapProps {
  nextTask: EnrichedClienteRepartoTask | null;
  repartidorLocation: { lat: number; lng: number } | null; // Mocked for now
  apiKey: string | undefined;
}

export function MobileRepartoEnCursoMap({ nextTask, repartidorLocation, apiKey }: MobileRepartoEnCursoMapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const directionsCallback = useCallback((
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
      setMapError(null);
    } else {
      console.error(`Error fetching directions ${status}`, response);
      setMapError(`No se pudo calcular la ruta. Estado: ${status}. Intente nuevamente o verifique las direcciones.`);
      setDirections(null);
    }
  }, []);

  useEffect(() => {
    if (repartidorLocation && nextTask && nextTask.direccion_reparto) {
      // Clear previous directions if task changes
      setDirections(null);
    }
  }, [nextTask, repartidorLocation]);


  if (!apiKey) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error de Configuración</AlertTitle>
        <AlertDescription>La clave API de Google Maps no está configurada. El mapa no se puede mostrar.</AlertDescription>
      </Alert>
    );
  }

  if (!nextTask || !nextTask.direccion_reparto) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground bg-card rounded-lg shadow-md my-4">
        No hay reparto en curso seleccionado para mostrar en el mapa.
      </div>
    );
  }
  
  if (!repartidorLocation) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground bg-card rounded-lg shadow-md my-4">
        Ubicación del repartidor no disponible.
      </div>
    );
  }


  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      loadingElement={<Skeleton className="h-[300px] w-full rounded-lg" />}
      onError={(error) => {
        console.error("Error loading Google Maps Script:", error);
        setMapError("Error al cargar Google Maps. Verifique su conexión o la configuración de la API.");
      }}
    >
      <div className="my-4">
        {mapError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error del Mapa</AlertTitle>
            <AlertDescription>{mapError}</AlertDescription>
          </Alert>
        )}
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={MAR_DEL_PLATA_CENTER}
          zoom={13} // Adjust zoom level as needed
          options={{
            restriction: {
              latLngBounds: MAR_DEL_PLATA_BOUNDS,
              strictBounds: false, // Allows panning slightly outside, but keeps search within
            },
            mapTypeControl: false,
            streetViewControl: false,
          }}
          onLoad={() => console.log("Google Map Loaded")}
          onUnmount={() => console.log("Google Map Unmounted")}
        >
          {repartidorLocation && (
            <Marker 
              position={repartidorLocation} 
              title="Tu Ubicación" 
              // icon={{ url: "/icons/repartidor-marker.png", scaledSize: new window.google.maps.Size(30,30)}} // Example custom icon
            />
          )}
          
          {/* Marker for the next task - DirectionsRenderer will also place markers */}
          {/* {nextTask && nextTask.direccion_reparto && ( // Assuming address can be geocoded by Marker or using geocoded lat/lng
            <Marker position={nextTask.direccion_reparto} title={nextTask.nombre_reparto} />
          )} */}

          {repartidorLocation && nextTask && nextTask.direccion_reparto && !directions && (
            <DirectionsService
              options={{
                destination: nextTask.direccion_reparto,
                origin: repartidorLocation,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
          )}
          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                polylineOptions: {
                  strokeColor: '#1e90ff', // Example: Dodger Blue
                  strokeWeight: 5,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
