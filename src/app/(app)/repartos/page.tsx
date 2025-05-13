
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient"; // Assuming supabase client is configured
import { LoadingScaffold } from "@/components/layout/loading-scaffold";
import { CrudPageHeader } from "@/components/common/crud-page-header";

import type { Reparto, RepartoBase } from "@/types/reparto";
import type { RepartoFormData } from "@/schemas/reparto-schema";
import type { Repartidor } from "@/types/repartidor";
import type { Cliente } from "@/types/cliente";
import type { ClienteReparto } from "@/types/cliente-reparto";

import { RepartoTable } from "@/components/repartos/reparto-table";
import { CreateRepartoDialog, EditRepartoDialog, DeleteRepartoDialog } from "@/components/repartos/reparto-dialogs";
import { RepartoDetails } from "@/components/repartos/reparto-details";

export default function RepartosPage() {
  const [repartos, setRepartos] = useState<Reparto[]>([]);
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesRepartoList, setClientesRepartoList] = useState<ClienteReparto[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReparto, setSelectedReparto] = useState<Reparto | null>(null);

  // --- Data Fetching ---
  const fetchRepartidores = useCallback(async () => {
    // Placeholder: Replace with actual Supabase call
    // const { data, error } = await supabase.from("repartidores").select("*");
    // if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    // else setRepartidores(data || []);
    console.log("Fetching repartidores...");
    setRepartidores([
        { id: "uuid-repartidor-1", nombre: "Juan Pérez", identificacion: "123", telefono: "555", vehiculo_asignado: "Moto" },
        { id: "uuid-repartidor-2", nombre: "Ana Gómez", identificacion: "456", telefono: "666", vehiculo_asignado: "Auto" },
    ]);
  }, [toast]);

  const fetchClientes = useCallback(async () => {
    // Placeholder: Replace with actual Supabase call
    // const { data, error } = await supabase.from("clientes").select("*");
    // if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    // else setClientes(data || []);
    console.log("Fetching clientes...");
     setClientes([
        { id: "uuid-cliente-1", nombre: "Empresa Alpha", direccion: "Calle Alpha 1", telefono: "111", correo_electronico: "a@a.com"},
        { id: "uuid-cliente-2", nombre: "Negocio Beta", direccion: "Calle Beta 2", telefono: "222", correo_electronico: "b@b.com"},
    ]);
  }, [toast]);

  const fetchClientesRepartoList = useCallback(async () => {
    // Placeholder: Replace with actual Supabase call
    // const { data, error } = await supabase.from("clientes_reparto").select("*, clientes(id, nombre)");
    // if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    // else setClientesRepartoList(data || []);
     console.log("Fetching clientes reparto list...");
     setClientesRepartoList([
        { id: 1, cliente_id: "uuid-cliente-1", nombre_reparto: "Sucursal Alpha Centro", direccion_reparto: "Centro 1", tarifa: 10, rango_horario: "9-12" },
        { id: 2, cliente_id: "uuid-cliente-1", nombre_reparto: "Sucursal Alpha Norte", direccion_reparto: "Norte 1", tarifa: 12, rango_horario: "14-17" },
        { id: 3, cliente_id: "uuid-cliente-2", nombre_reparto: "Deposito Beta", direccion_reparto: "Industrial 5", tarifa: 15, rango_horario: "10-18" },
     ]);
  }, [toast]);

  const fetchRepartos = useCallback(async () => {
    setIsLoading(true);
    // Placeholder: Replace with actual Supabase call
    // This will involve fetching from 'repartos' table and potentially a join table for 'clientes_reparto_asignados'
    // For now, using mock data.
    console.log("Fetching repartos...");
    const mockRepartos: Reparto[] = [
      { 
        id: "uuid-reparto-1", 
        fecha_reparto: new Date().toISOString(), 
        repartidor_id: "uuid-repartidor-1",
        cliente_id: "uuid-cliente-1",
        observaciones: "Primer reparto de prueba",
        repartidor: { nombre: "Juan Pérez" },
        cliente: { nombre: "Empresa Alpha" },
        clientes_reparto_asignados: [
            { id: 1, cliente_id: "uuid-cliente-1", nombre_reparto: "Sucursal Alpha Centro", direccion_reparto: "Centro 1", tarifa: 10, rango_horario: "9-12" }
        ],
        cantidad_clientes_reparto: 1,
      },
    ];
    setRepartos(mockRepartos);
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchRepartidores(),
      fetchClientes(),
      fetchClientesRepartoList(),
      fetchRepartos(),
    ]).finally(() => setIsLoading(false));
  }, [fetchRepartidores, fetchClientes, fetchClientesRepartoList, fetchRepartos]);

  // --- CRUD Handlers ---
  const handleCreateReparto = async (formData: RepartoFormData) => {
    console.log("Creating reparto:", formData);
    // Placeholder: Add Supabase insert logic for 'repartos' and the join table
    // const newRepartoBase: Omit<RepartoBase, 'id' | 'created_at' | 'updated_at'> = { ... }
    // const { data: newReparto, error } = await supabase.from('repartos').insert(newRepartoBase).select().single();
    // Then insert into join table for clientes_reparto_seleccionados_ids
    
    toast({ title: "Éxito", description: "Reparto creado (simulado)." });
    fetchRepartos(); // Refresh list
  };

  const handleUpdateReparto = async (id: string, formData: RepartoFormData) => {
    console.log("Updating reparto:", id, formData);
    // Placeholder: Add Supabase update logic
    toast({ title: "Éxito", description: "Reparto actualizado (simulado)." });
    fetchRepartos(); // Refresh list
    setSelectedReparto(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteReparto = async (id: string) => {
    console.log("Deleting reparto:", id);
    // Placeholder: Add Supabase delete logic
    toast({ title: "Éxito", description: "Reparto eliminado (simulado)." });
    fetchRepartos(); // Refresh list
    setSelectedReparto(null);
    setIsDeleteModalOpen(false);
  };
  
  // --- Modal Triggers ---
  const openEditModal = (reparto: Reparto) => {
    setSelectedReparto(reparto);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (reparto: Reparto) => {
    setSelectedReparto(reparto);
    setIsDeleteModalOpen(true);
  };
  
  const openDetailsModal = (reparto: Reparto) => {
    // Potentially fetch full details if not already loaded
    setSelectedReparto(reparto);
    setIsDetailsModalOpen(true);
  };


  if (isLoading && repartos.length === 0 && repartidores.length === 0 && clientes.length === 0) {
    return (
      <LoadingScaffold
        pageTitle="Gestión de Repartos"
        cardTitle="Lista de Repartos"
        loadingText="Cargando datos de repartos..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <CrudPageHeader
        title="Gestión de Repartos"
        createDialogComponent={
          <CreateRepartoDialog
            onCreate={handleCreateReparto}
            repartidores={repartidores}
            clientes={clientes}
            clientesRepartoList={clientesRepartoList}
          />
        }
      />
      <RepartoTable
        repartos={repartos}
        onEditReparto={openEditModal}
        // onDeleteReparto={(id) => { // Simplified for direct call, or use openDeleteModal
        //   const repartoToDelete = repartos.find(r => r.id === id);
        //   if (repartoToDelete) openDeleteModal(repartoToDelete);
        // }}
        onDeleteReparto={(repartoId) => {
            const repartoFound = repartos.find(r => r.id === repartoId);
            if(repartoFound) openDeleteModal(repartoFound);
            else toast({title: "Error", description: "Reparto no encontrado para eliminar.", variant: "destructive"});
        }}
        onViewDetails={openDetailsModal}
      />

      {selectedReparto && isEditModalOpen && (
        <EditRepartoDialog
          reparto={selectedReparto}
          onUpdate={handleUpdateReparto}
          repartidores={repartidores}
          clientes={clientes}
          clientesRepartoList={clientesRepartoList}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}
      
      {selectedReparto && isDeleteModalOpen && (
         <DeleteRepartoDialog
            repartoId={selectedReparto.id}
            repartoFecha={selectedReparto.fecha_reparto.toString()} // Pass as string
            onDelete={handleDeleteReparto}
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
        />
      )}

      {selectedReparto && isDetailsModalOpen && (
        <RepartoDetails
            reparto={selectedReparto}
            isOpen={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
        />
      )}
    </div>
  );
}
