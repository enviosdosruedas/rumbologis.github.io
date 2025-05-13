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
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClientes = useCallback(async () => {
    // This part of isLoading will be handled by the combined loading logic
    // setIsLoading(true); 
    if (!supabase) {
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setClientes([]);
      return false; // Indicate failure
    }

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      toast({
        title: "Error al Cargar Clientes",
        description: error.message,
        variant: "destructive",
      });
      setClientes([]);
      return false; // Indicate failure
    } else {
      setClientes(data as Cliente[] || []);
      return true; // Indicate success
    }
    // setIsLoading(false); // Handled by combined logic
  }, [toast]);

  const fetchClientesReparto = useCallback(async () => {
    // This part of isLoading will be handled by the combined loading logic
    // setIsLoading(true);
     if (!supabase) {
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setClientesReparto([]);
      return false; // Indicate failure
    }
    const { data, error } = await supabase
      .from("clientes_reparto")
      .select("*")
      .order("id", { ascending: true }); // Changed from "codigo" to "id"

    if (error) {
      toast({
        title: "Error al Cargar Registros de Reparto",
        description: error.message,
        variant: "destructive",
      });
      setClientesReparto([]);
      return false; // Indicate failure
    } else {
      setClientesReparto(data as ClienteReparto[] || []);
      return true; // Indicate success
    }
    // setIsLoading(false); // Handled by combined logic
  }, [toast]);


  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        // Fetch clients first, then clientesReparto
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
    
    const { data: newRecord, error } = await supabase
      .from("clientes_reparto")
      .insert([formData]) 
      .select()
      .single();

    if (error) {
      toast({
        title: "Error al Crear Registro de Reparto",
        description: error.message,
        variant: "destructive",
      });
    } else if (newRecord) {
      await fetchClientesReparto(); 
      toast({
        title: "Registro de Reparto Creado",
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

    const { data: updatedRecord, error } = await supabase
      .from("clientes_reparto")
      .update(formData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error al Actualizar Registro de Reparto",
        description: error.message,
        variant: "destructive",
      });
    } else if (updatedRecord) {
      await fetchClientesReparto(); 
      toast({
        title: "Registro de Reparto Actualizado",
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
        title: "Error al Eliminar Registro de Reparto",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await fetchClientesReparto(); 
      if (recordToDelete) {
        toast({
          title: "Registro de Reparto Eliminado",
          description: `El registro ${recordToDelete.nombre_reparto} ha sido eliminado.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registro de Reparto Eliminado",
          description: `El registro con ID ${id} ha sido eliminado.`,
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <LoadingScaffold
        pageTitle="Clientes Reparto"
        cardTitle="Configuraciones de Reparto"
        loadingText="Cargando datos..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Clientes Reparto</h2>
        <CreateClienteRepartoDialog onCreate={handleCreateClienteReparto} clientes={clientes} />
      </div>
      <ClientesRepartoTable 
        clientesReparto={clientesReparto} 
        clientes={clientes}
        onUpdateClienteReparto={handleUpdateClienteReparto} 
        onDeleteClienteReparto={handleDeleteClienteReparto} 
      />
    </div>
  );
}
