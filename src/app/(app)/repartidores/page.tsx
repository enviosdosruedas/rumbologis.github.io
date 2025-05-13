"use client";

import React, { useState, useEffect } from "react";
import { RepartidoresTable } from "@/components/repartidores/repartidores-table";
import { CreateRepartidorDialog } from "@/components/repartidores/repartidor-dialogs";
import type { Repartidor } from "@/types/repartidor";
import type { RepartidorFormData } from "@/schemas/repartidor-schema";
import { useToast } from "@/hooks/use-toast";

const initialRepartidores: Repartidor[] = [
  { id: "1", nombre: "Carlos Ruiz", identificacion: "DNI 20123456", telefono: "555-8765", vehiculo: "Moto Honda Wave" },
  { id: "2", nombre: "Lucía Fernández", identificacion: "DNI 30789012", telefono: "555-4321", vehiculo: "Bicicleta Eléctrica" },
];

export default function RepartidoresPage() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate fetching data and prevent hydration mismatch for initial data
    setRepartidores(initialRepartidores);
    setIsMounted(true);
  }, []);

  const handleCreateRepartidor = (data: RepartidorFormData) => {
    const newRepartidor: Repartidor = {
      id: crypto.randomUUID(),
      ...data,
    };
    setRepartidores((prevRepartidores) => [...prevRepartidores, newRepartidor]);
    toast({
      title: "Repartidor Creado",
      description: `El repartidor ${newRepartidor.nombre} ha sido creado exitosamente.`,
      variant: "default",
      className: "bg-accent text-accent-foreground"
    });
  };

  const handleUpdateRepartidor = (id: string, data: RepartidorFormData) => {
    setRepartidores((prevRepartidores) =>
      prevRepartidores.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
    toast({
      title: "Repartidor Actualizado",
      description: `El repartidor ${data.nombre} ha sido actualizado exitosamente.`,
      variant: "default",
      className: "bg-accent text-accent-foreground"
    });
  };

  const handleDeleteRepartidor = (id: string) => {
    const repartidorAEliminar = repartidores.find(r => r.id === id);
    setRepartidores((prevRepartidores) => prevRepartidores.filter((r) => r.id !== id));
    if (repartidorAEliminar) {
        toast({
        title: "Repartidor Eliminado",
        description: `El repartidor ${repartidorAEliminar.nombre} ha sido eliminado.`,
        variant: "destructive",
        });
    }
  };

  if (!isMounted) {
    // Optional: render a loading state or null
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Repartidores</h2>
        </div>
        <p>Cargando repartidores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Repartidores</h2>
        <CreateRepartidorDialog onCreate={handleCreateRepartidor} />
      </div>
      <RepartidoresTable
        repartidores={repartidores}
        onUpdateRepartidor={handleUpdateRepartidor}
        onDeleteRepartidor={handleDeleteRepartidor}
      />
    </div>
  );
}
