"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ClientesTable } from "@/components/clientes/clientes-table";
import { CreateClienteDialog } from "@/components/clientes/cliente-dialogs";
import type { Cliente } from "@/types/cliente";
import type { ClienteFormData } from "@/schemas/cliente-schema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";


export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClientes = useCallback(async () => {
    setIsLoading(true);
    if (!supabase) {
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setClientes([]);
      setIsLoading(false);
      return;
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
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);
  
  const handleCreateCliente = async (formData: ClienteFormData) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }
    
    const { data: newCliente, error } = await supabase
      .from("clientes")
      .insert([formData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error al Crear Cliente",
        description: error.message,
        variant: "destructive",
      });
    } else if (newCliente) {
      await fetchClientes();
      toast({
        title: "Cliente Creado",
        description: `El cliente ${newCliente.nombre} ha sido creado exitosamente.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
    }
  };

  const handleUpdateCliente = async (id: string, formData: ClienteFormData) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }

    const { data: updatedCliente, error } = await supabase
      .from("clientes")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error al Actualizar Cliente",
        description: error.message,
        variant: "destructive",
      });
    } else if (updatedCliente) {
      await fetchClientes();
      toast({
        title: "Cliente Actualizado",
        description: `El cliente ${updatedCliente.nombre} ha sido actualizado exitosamente.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
    }
  };

  const handleDeleteCliente = async (id: string) => {
    if (!supabase) {
      toast({ title: "Error de Configuración", description: "Supabase client no disponible.", variant: "destructive" });
      return;
    }
    
    // Find client name for toast message before potential deletion from local state
    const clienteAEliminar = clientes.find(c => c.id === id);
    
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error al Eliminar Cliente",
        description: error.message,
        variant: "destructive",
      });
    } else {
      await fetchClientes(); 
      if (clienteAEliminar) {
          toast({
          title: "Cliente Eliminado",
          description: `El cliente ${clienteAEliminar.nombre} ha sido eliminado.`,
          variant: "destructive",
          });
      } else {
         // Fallback if client was not found in state before deletion (e.g. rapid operations)
         toast({
          title: "Cliente Eliminado",
          description: `El cliente con ID ${id} ha sido eliminado.`,
          variant: "destructive",
          });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
           {/* Create button could be disabled or not rendered here */}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Cargando clientes...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
        <CreateClienteDialog onCreate={handleCreateCliente} />
      </div>
      <ClientesTable 
        clientes={clientes} 
        onUpdateCliente={handleUpdateCliente} 
        onDeleteCliente={handleDeleteCliente} 
      />
    </div>
  );
}
