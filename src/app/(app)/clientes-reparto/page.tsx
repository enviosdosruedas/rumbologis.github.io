
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ClientesRepartoTable } from "@/components/clientes-reparto/clientes-reparto-table";
import { CreateClienteRepartoDialog } from "@/components/clientes-reparto/cliente-reparto-dialogs";
import type { ClienteReparto } from "@/types/cliente-reparto";
import type { Cliente } from "@/types/cliente";
import type { ClienteRepartoFormData } from "@/schemas/cliente-reparto-schema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { LoadingScaffold } from "@/components/layout/loading-scaffold";

export default function ClientesRepartoPage() {
  const [clientesReparto, setClientesReparto] = useState<ClienteReparto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); // Main clients list for dropdowns
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClientes = useCallback(async () => {
    if (!supabase) {
      console.error("Supabase client no disponible en fetchClientes.");
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setClientes([]);
      return false;
    }

    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre") // Only fetch id and nombre, or "*" if other fields needed elsewhere
      .order("nombre", { ascending: true });

    if (error) {
      toast({
        title: "Error al Cargar Clientes Principales",
        description: error.message,
        variant: "destructive",
      });
      setClientes([]);
      return false;
    } else {
      setClientes(data as Cliente[] || []);
      return true;
    }
  }, [toast]);

  const fetchClientesReparto = useCallback(async () => {
    if (!supabase) {
      console.error("Supabase client no disponible en fetchClientesReparto.");
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setClientesReparto([]);
      return false;
    }
    
    const { data, error } = await supabase
      .from("clientes_reparto")
      .select("*, clientes(id, nombre)") // Fetch related client data
      .order("id", { ascending: true }); 

    if (error) {
      toast({
        title: "Error al Cargar Registros de Clientes Reparto",
        description: error.message,
        variant: "destructive",
      });
      setClientesReparto([]);
      return false;
    } else {
      // Supabase response for related data is nested, e.g. item.clientes.nombre
      setClientesReparto(data as ClienteReparto[] || []);
      return true;
    }
  }, [toast]);


  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        await fetchClientes(); 
        await fetchClientesReparto(); 
        setIsLoading(false);
    }
    loadInitialData();
  }, [fetchClientes, fetchClientesReparto]);
  
  const handleCreateClienteReparto = async (formData: ClienteRepartoFormData) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }
    
    // formData is of type ClienteRepartoFormData, which doesn't include 'id'.
    // Supabase will auto-generate 'id' as it's a SERIAL PRIMARY KEY.
    // Ensure formData includes: cliente_id, nombre_reparto, direccion_reparto, telefono_reparto, tarifa, rango_horario.
    const { data: newRecord, error } = await supabase
      .from("clientes_reparto")
      .insert([formData]) 
      .select("*, clientes(id, nombre)") // Fetch with related client data after insert
      .single();

    if (error) {
      toast({
        title: "Error al Crear Registro de Cliente Reparto",
        description: error.message,
        variant: "destructive",
      });
    } else if (newRecord) {
      // Instead of full refetch, prepend or append to existing state for better UX
      // For simplicity, full refetch is kept here. Consider optimistic updates or smarter state updates later.
      await fetchClientesReparto(); 
      toast({
        title: "Registro de Cliente Reparto Creado",
        description: `El registro para ${newRecord.nombre_reparto} ha sido creado exitosamente.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
    }
  };

  const handleUpdateClienteReparto = async (id: number, formData: ClienteRepartoFormData) => {
     if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }

    // formData includes all updatable fields including 'telefono_reparto'
    const { data: updatedRecord, error } = await supabase
      .from("clientes_reparto")
      .update(formData) 
      .eq("id", id)
      .select("*, clientes(id, nombre)") // Fetch with related client data after update
      .single();
    
    if (error) {
      toast({
        title: "Error al Actualizar Registro de Cliente Reparto",
        description: error.message,
        variant: "destructive",
      });
    } else if (updatedRecord) {
      await fetchClientesReparto(); 
      toast({
        title: "Registro de Cliente Reparto Actualizado",
        description: `El registro para ${updatedRecord.nombre_reparto} ha sido actualizado exitosamente.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
    }
  };

  const handleDeleteClienteReparto = async (id: number) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }

    const recordToDelete = clientesReparto.find(cr => cr.id === id);

    const { error } = await supabase
      .from("clientes_reparto")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error al Eliminar Registro de Cliente Reparto",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await fetchClientesReparto(); 
      if (recordToDelete) {
        toast({
          title: "Registro de Cliente Reparto Eliminado",
          description: `El registro ${recordToDelete.nombre_reparto} ha sido eliminado.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registro de Cliente Reparto Eliminado",
          description: `El registro con ID ${id} ha sido eliminado.`,
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <LoadingScaffold
        pageTitle="Gestión de Clientes de Reparto"
        cardTitle="Configuraciones de Clientes para Reparto"
        loadingText="Cargando datos..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes de Reparto</h2>
        {/* CreateClienteRepartoDialog needs the list of main 'clientes' for its dropdown */}
        <CreateClienteRepartoDialog onCreate={handleCreateClienteReparto} clientes={clientes} />
      </div>
      <ClientesRepartoTable 
        clientesReparto={clientesReparto} 
        // Pass main 'clientes' list for EditClienteRepartoDialog's dropdown
        clientes={clientes} 
        onUpdateClienteReparto={handleUpdateClienteReparto} 
        onDeleteClienteReparto={handleDeleteClienteReparto} 
      />
    </div>
  );
}
