
"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClienteReparto } from '@/types/cliente-reparto';

const MAP_CONTAINER_STYLE = {
  height: '500px',
  width: '100%',
  borderRadius: '0.5rem',
};

const MAR_DEL_PLATA_CENTER = {
  lat: -38.005477,
  lng: -57.542611,
};

const MAR_DEL_PLATA_BOUNDS = { // Approximate bounds for Mar del Plata
  north: -37.90,
  south: -38.10,
  west: -57.70,
  east: -57.40,
};

interface MapaRutaOptimizadaProps {
  apiKey: string;
  startLocation: string;
  destinations: ClienteReparto[];
  onRouteOptimized: (route: google.maps.DirectionsResult | null) => void;
  onError: (error: string) => void;
}

// Memoize Marker for performance if there are many
const MemoizedMarker = memo(Marker);

export function MapaRutaOptimizada({ apiKey, startLocation, destinations, onRouteOptimized, onError }: MapaRutaOptimizadaProps) {
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null); // To show InfoWindow

  const directionsCallback = useCallback((
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirectionsResponse(response);
      onRouteOptimized(response);
    } else {
      console.error(`Error fetching directions ${status}`, response);
      onError(`No se pudo calcular la ruta. Estado: ${status}. Verifique las direcciones.`);
      onRouteOptimized(null);
      setDirectionsResponse(null);
    }
  }, [onRouteOptimized, onError]);

  useEffect(() => {
    // Reset directions if destinations change
    setDirectionsResponse(null);
    onRouteOptimized(null);
  }, [destinations, onRouteOptimized]);
  
  const waypoints = destinations
    .filter(d => d.direccion_reparto) // Ensure address exists
    .map(d => ({
        location: d.direccion_reparto!, // Assert non-null as filtered
        stopover: true,
    }));


  const handleMarkerClick = (markerId: string) => {
    setActiveMarker(markerId);
  };
  
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      loadingElement={<Skeleton className="h-[500px] w-full rounded-lg" />}
      onError={(error) => {
        console.error("Error loading Google Maps Script:", error);
        onError("Error al cargar Google Maps. Verifique su conexión o la configuración de la API.");
      }}
    >
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={MAR_DEL_PLATA_CENTER}
        zoom={12}
        onLoad={setMap}
        options={{
            restriction: {
                latLngBounds: MAR_DEL_PLATA_BOUNDS,
                strictBounds: false, 
            },
            mapTypeControl: false,
            streetViewControl: false,
        }}
      >
        {/* Origin Marker */}
        {/* <MemoizedMarker position={startLocation} label="Inicio" /> */}
        {/* This would require geocoding 'startLocation' string first if not already lat/lng */}


        {/* Destination Markers - will be shown by DirectionsRenderer, but can be added manually if needed */}
        {/* {destinations.map((dest, index) => (
          dest.direccion_reparto && (
            <MemoizedMarker
              key={`dest-${index}`}
              position={dest.direccion_reparto} // This also needs geocoding or lat/lng
              label={`${index + 1}`}
              title={dest.nombre_reparto}
              onClick={() => handleMarkerClick(`dest-${index}`)}
            >
              {activeMarker === `dest-${index}` && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div>
                    <strong>{dest.nombre_reparto}</strong><br/>
                    {dest.direccion_reparto}
                  </div>
                </InfoWindow>
              )}
            </MemoizedMarker>
          )
        ))} */}

        {/* Directions Service and Renderer */}
        {destinations.length > 0 && !directionsResponse && (
          <DirectionsService
            options={{
              origin: startLocation,
              destination: startLocation, // For optimizeWaypoints, destination can be the same as origin for a round trip
              waypoints: waypoints,
              optimizeWaypoints: true,
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={directionsCallback}
          />
        )}
        {directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse,
              polylineOptions: { strokeColor: '#1e90ff', strokeWeight: 5 },
              // suppressMarkers: true, // If using custom markers above
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
