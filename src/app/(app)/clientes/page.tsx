"use client";

import React, { useState, useEffect } from "react";
import { ClientesTable } from "@/components/clientes/clientes-table";
import { CreateClienteDialog } from "@/components/clientes/cliente-dialogs";
import type { Cliente } from "@/types/cliente";
import type { ClienteFormData } from "@/schemas/cliente-schema";
import { useToast } from "@/hooks/use-toast";

const initialClientes: Cliente[] = [
  { id: "1", nombre: "Juan Pérez", direccion: "Calle Falsa 123", telefono: "555-1234", email: "juan.perez@example.com" },
  { id: "2", nombre: "Ana Gómez", direccion: "Avenida Siempre Viva 742", telefono: "555-5678", email: "ana.gomez@example.com" },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data and prevent hydration mismatch for initial data
    setClientes(initialClientes);
    setIsMounted(true);
  }, []);
  
  const handleCreateCliente = (data: ClienteFormData) => {
    const newCliente: Cliente = {
      id: crypto.randomUUID(),
      ...data,
    };
    setClientes((prevClientes) => [...prevClientes, newCliente]);
    toast({
      title: "Cliente Creado",
      description: `El cliente ${newCliente.nombre} ha sido creado exitosamente.`,
      variant: "default", // Use 'default' which will be styled by accent color in theme
      className: "bg-accent text-accent-foreground"
    });
  };

  const handleUpdateCliente = (id: string, data: ClienteFormData) => {
    setClientes((prevClientes) =>
      prevClientes.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
    toast({
      title: "Cliente Actualizado",
      description: `El cliente ${data.nombre} ha sido actualizado exitosamente.`,
      variant: "default",
      className: "bg-accent text-accent-foreground"
    });
  };

  const handleDeleteCliente = (id: string) => {
    const clienteAEliminar = clientes.find(c => c.id === id);
    setClientes((prevClientes) => prevClientes.filter((c) => c.id !== id));
    if (clienteAEliminar) {
        toast({
        title: "Cliente Eliminado",
        description: `El cliente ${clienteAEliminar.nombre} ha sido eliminado.`,
        variant: "destructive",
        });
    }
  };

  if (!isMounted) {
    // Optional: render a loading state or null
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h2>
        </div>
        <p>Cargando clientes...</p>
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
