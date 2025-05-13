"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RepartidoresTable } from "@/components/repartidores/repartidores-table";
import { CreateRepartidorDialog } from "@/components/repartidores/repartidor-dialogs";
import type { Repartidor } from "@/types/repartidor";
import type { RepartidorFormData } from "@/schemas/repartidor-schema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RepartidoresPage() {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRepartidores = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setRepartidores([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("repartidores")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      toast({
        title: "Error al Cargar Repartidores",
        description: error.message,
        variant: "destructive",
      });
      setRepartidores([]);
    } else {
      setRepartidores(data as Repartidor[] || []);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchRepartidores();
  }, [fetchRepartidores]);

  const handleCreateRepartidor = async (formData: RepartidorFormData) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }
    
    const { data: newRepartidor, error } = await supabase
      .from("repartidores")
      .insert([formData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error al Crear Repartidor",
        description: error.message,
        variant: "destructive",
      });
    } else if (newRepartidor) {
      await fetchRepartidores();
      toast({
        title: "Repartidor Creado",
        description: `El repartidor ${newRepartidor.nombre} ha sido creado exitosamente.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
    }
  };

  const handleUpdateRepartidor = async (id: string, formData: RepartidorFormData) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }

    const { data: updatedRepartidor, error } = await supabase
      .from("repartidores")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error al Actualizar Repartidor",
        description: error.message,
        variant: "destructive",
      });
    } else if (updatedRepartidor) {
      await fetchRepartidores();
      toast({
        title: "Repartidor Actualizado",
        description: `El repartidor ${updatedRepartidor.nombre} ha sido actualizado exitosamente.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
    }
  };

  const handleDeleteRepartidor = async (id: string) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }
    
    const repartidorAEliminar = repartidores.find(r => r.id === id);
    
    const { error } = await supabase
      .from("repartidores")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error al Eliminar Repartidor",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await fetchRepartidores(); 
      if (repartidorAEliminar) {
          toast({
          title: "Repartidor Eliminado",
          description: `El repartidor ${repartidorAEliminar.nombre} ha sido eliminado.`,
          variant: "destructive",
          });
      } else {
         toast({
          title: "Repartidor Eliminado",
          description: `El repartidor con ID ${id} ha sido eliminado.`,
          variant: "destructive",
          });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Repartidores</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Repartidores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Cargando repartidores...</p>
          </CardContent>
        </Card>
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
