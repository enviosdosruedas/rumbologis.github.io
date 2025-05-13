"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ClientesRepartoTable } from "@/components/clientes-reparto/clientes-reparto-table";
import { CreateClienteRepartoDialog } from "@/components/clientes-reparto/cliente-reparto-dialogs";
import type { ClienteReparto } from "@/types/cliente-reparto";
import type { Cliente } from "@/types/cliente";
import type { ClienteRepartoFormData } from "@/schemas/cliente-reparto-schema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient"; // To fetch clients
import { LoadingScaffold } from "@/components/layout/loading-scaffold";

export default function ClientesRepartoPage() {
  const [clientesReparto, setClientesReparto] = useState<ClienteReparto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch existing clients for the dropdown
  const fetchClientes = useCallback(async () => {
    if (!supabase) {
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setClientes([]);
      return; // Important: return if supabase is not available
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
    } else {
      setClientes(data as Cliente[] || []);
    }
  }, [toast]);

  useEffect(() => {
    // Simulate fetching ClientesReparto data (will be empty initially)
    // In a real scenario, you'd fetch this from Supabase too.
    // For now, Clientes Reparto data is managed in local state.
    const loadInitialData = async () => {
        setIsLoading(true);
        await fetchClientes();
        // setClientesReparto([]); // Start with an empty list
        setIsLoading(false);
    }
    loadInitialData();
  }, [fetchClientes]);
  
  const handleCreateClienteReparto = async (formData: ClienteRepartoFormData) => {
    // For now, we add to local state. Supabase integration will come later.
    const newRecord: ClienteReparto = {
      id: crypto.randomUUID(), // Temporary ID
      ...formData,
    };
    setClientesReparto((prev) => [...prev, newRecord]);
    toast({
      title: "Registro de Reparto Creado",
      description: `El registro con código ${newRecord.codigo} ha sido creado.`,
      variant: "default",
      className: "bg-accent text-accent-foreground"
    });
  };

  const handleUpdateClienteReparto = async (id: string, formData: ClienteRepartoFormData) => {
    // For now, we update local state.
    setClientesReparto((prev) =>
      prev.map((cr) => (cr.id === id ? { ...cr, ...formData } : cr))
    );
    const updatedRecord = clientesReparto.find(cr => cr.id === id);
    toast({
      title: "Registro de Reparto Actualizado",
      description: `El registro con código ${updatedRecord?.codigo || formData.codigo} ha sido actualizado.`,
      variant: "default",
      className: "bg-accent text-accent-foreground"
    });
  };

  const handleDeleteClienteReparto = async (id: string) => {
    // For now, we delete from local state.
    const recordToDelete = clientesReparto.find(cr => cr.id === id);
    setClientesReparto((prev) => prev.filter((cr) => cr.id !== id));
    toast({
      title: "Registro de Reparto Eliminado",
      description: `El registro con código ${recordToDelete?.codigo} ha sido eliminado.`,
      variant: "destructive",
    });
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
