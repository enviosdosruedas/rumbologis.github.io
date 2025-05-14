
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { LoadingScaffold } from "@/components/layout/loading-scaffold";
import { CrudPageHeader } from "@/components/common/crud-page-header";

import type { Reparto, RepartoEstado } from "@/types/reparto";
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
    const { data, error } = await supabase.from("repartidores").select("id, nombre").order("nombre");
    if (error) toast({ title: "Error cargando repartidores", description: error.message, variant: "destructive" });
    else setRepartidores(data || []);
  }, [toast]);

  const fetchClientes = useCallback(async () => {
    const { data, error } = await supabase.from("clientes").select("id, nombre").order("nombre");
    if (error) toast({ title: "Error cargando clientes", description: error.message, variant: "destructive" });
    else setClientes(data || []);
  }, [toast]);

  const fetchClientesRepartoList = useCallback(async () => {
    const { data, error } = await supabase.from("clientes_reparto").select("*").order("nombre_reparto");
    if (error) toast({ title: "Error cargando lista de clientes de reparto", description: error.message, variant: "destructive" });
    else setClientesRepartoList(data || []);
  }, [toast]);

  const fetchRepartos = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("repartos")
      .select(`
        id,
        fecha_reparto,
        observaciones,
        estado,
        repartidor_id,
        repartidores (id, nombre),
        cliente_id,
        clientes (id, nombre),
        reparto_cliente_reparto ( cliente_reparto_id )
      `)
      .order("fecha_reparto", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      toast({ title: "Error cargando repartos", description: error.message, variant: "destructive" });
      setRepartos([]);
    } else {
      const formattedRepartos = data.map(reparto => ({
        ...reparto,
        repartidor: reparto.repartidores as Repartidor, 
        cliente: reparto.clientes as Cliente, 
        // @ts-ignore Supabase specific array structure for joined table
        cantidad_clientes_reparto: reparto.reparto_cliente_reparto?.length || 0,
        // @ts-ignore
        clientes_reparto_ids: reparto.reparto_cliente_reparto?.map(link => link.cliente_reparto_id) || [],
        estado: reparto.estado as RepartoEstado || 'Asignado', // Ensure estado is correctly typed
      }));
      setRepartos(formattedRepartos as Reparto[]);
    }
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
    const { clientes_reparto_seleccionados_ids, ...repartoDataFromForm } = formData;

    const repartoToInsert = {
      ...repartoDataFromForm,
      estado: 'Asignado' as RepartoEstado, // Set initial state
    };

    // 1. Insert into 'repartos' table
    const { data: newReparto, error: repartoError } = await supabase
      .from("repartos")
      .insert([repartoToInsert])
      .select()
      .single();

    if (repartoError) {
      toast({ title: "Error creando reparto", description: repartoError.message, variant: "destructive" });
      return;
    }

    if (newReparto && clientes_reparto_seleccionados_ids && clientes_reparto_seleccionados_ids.length > 0) {
      const linksToInsert = clientes_reparto_seleccionados_ids.map(cliente_reparto_id => ({
        reparto_id: newReparto.id,
        cliente_reparto_id: cliente_reparto_id,
      }));

      const { error: linkError } = await supabase
        .from("reparto_cliente_reparto")
        .insert(linksToInsert);

      if (linkError) {
        toast({ title: "Error asignando clientes de reparto", description: linkError.message, variant: "destructive" });
        await supabase.from("repartos").delete().eq("id", newReparto.id);
        return;
      }
    }
    
    toast({ title: "Reparto Creado", description: "El reparto ha sido creado exitosamente.", className: "bg-accent text-accent-foreground" });
    fetchRepartos(); 
  };

  const handleUpdateReparto = async (id: number, formData: RepartoFormData) => {
    const { clientes_reparto_seleccionados_ids, ...repartoData } = formData;
    // Note: 'estado' is not part of RepartoFormData by default, it's handled by handleUpdateRepartoEstado

    // 1. Update 'repartos' table
    const { error: repartoError } = await supabase
      .from("repartos")
      .update(repartoData) // This will update fields present in repartoData (fecha, repartidor_id, cliente_id, observaciones)
      .eq("id", id);

    if (repartoError) {
      toast({ title: "Error actualizando reparto", description: repartoError.message, variant: "destructive" });
      return;
    }

    // 2. Update 'reparto_cliente_reparto' links
    const { error: deleteError } = await supabase
      .from("reparto_cliente_reparto")
      .delete()
      .eq("reparto_id", id);

    if (deleteError) {
      toast({ title: "Error actualizando asignaciones (paso 1)", description: deleteError.message, variant: "destructive" });
      return;
    }

    if (clientes_reparto_seleccionados_ids && clientes_reparto_seleccionados_ids.length > 0) {
      const linksToInsert = clientes_reparto_seleccionados_ids.map(cliente_reparto_id => ({
        reparto_id: id,
        cliente_reparto_id: cliente_reparto_id,
      }));

      const { error: linkError } = await supabase
        .from("reparto_cliente_reparto")
        .insert(linksToInsert);

      if (linkError) {
        toast({ title: "Error actualizando asignaciones (paso 2)", description: linkError.message, variant: "destructive" });
        return;
      }
    }
    
    toast({ title: "Reparto Actualizado", description: "El reparto ha sido actualizado exitosamente.", className: "bg-accent text-accent-foreground"});
    fetchRepartos(); 
    setSelectedReparto(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateRepartoEstado = async (repartoId: number, nuevoEstado: RepartoEstado) => {
    const { error } = await supabase
      .from("repartos")
      .update({ estado: nuevoEstado })
      .eq("id", repartoId);

    if (error) {
      toast({ title: "Error Actualizando Estado", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Estado Actualizado",
        description: `El estado del reparto ha sido actualizado a "${nuevoEstado}".`,
        className: "bg-accent text-accent-foreground"
      });
      fetchRepartos(); // Refresh list to show the new state
    }
  };

  const handleDeleteReparto = async (id: number) => {
    const { error: linkError } = await supabase
      .from("reparto_cliente_reparto")
      .delete()
      .eq("reparto_id", id);

    if (linkError) {
      toast({ title: "Error eliminando asignaciones", description: linkError.message, variant: "destructive" });
      return;
    }

    const { error: repartoError } = await supabase
      .from("repartos")
      .delete()
      .eq("id", id);

    if (repartoError) {
      toast({ title: "Error eliminando reparto", description: repartoError.message, variant: "destructive" });
      return;
    }
    
    toast({ title: "Reparto Eliminado", description: "El reparto ha sido eliminado.", variant: "destructive" });
    fetchRepartos(); 
    setSelectedReparto(null);
    setIsDeleteModalOpen(false);
  };
  
  const openEditModal = async (reparto: Reparto) => {
    const { data: assignedLinks, error } = await supabase
        .from('reparto_cliente_reparto')
        .select('cliente_reparto_id, clientes_reparto(*)')
        .eq('reparto_id', reparto.id);

    if (error) {
        toast({ title: "Error cargando detalles para editar", description: error.message, variant: "destructive" });
        return;
    }
    
    const fullRepartoData: Reparto = {
        ...reparto,
        // @ts-ignore
        clientes_reparto_asignados: assignedLinks?.map(link => link.clientes_reparto as ClienteReparto) || [],
        // @ts-ignore
        clientes_reparto_ids: assignedLinks?.map(link => link.cliente_reparto_id) || [],
    };
    setSelectedReparto(fullRepartoData);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (reparto: Reparto) => {
    setSelectedReparto(reparto);
    setIsDeleteModalOpen(true);
  };
  
  const openDetailsModal = async (reparto: Reparto) => {
     const { data: assignedLinks, error } = await supabase
        .from('reparto_cliente_reparto')
        .select('cliente_reparto_id, clientes_reparto(*)') 
        .eq('reparto_id', reparto.id);

    if (error) {
        toast({ title: "Error cargando detalles", description: error.message, variant: "destructive" });
        setSelectedReparto(reparto); 
    } else {
       const fullRepartoData: Reparto = {
        ...reparto,
         // @ts-ignore
        clientes_reparto_asignados: assignedLinks?.map(link => link.clientes_reparto as ClienteReparto) || [],
       };
       setSelectedReparto(fullRepartoData);
    }
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
        onDeleteReparto={(repartoId) => {
            const repartoFound = repartos.find(r => r.id === repartoId);
            if(repartoFound) openDeleteModal(repartoFound);
            else toast({title: "Error", description: "Reparto no encontrado para eliminar.", variant: "destructive"});
        }}
        onViewDetails={openDetailsModal}
        onUpdateEstado={handleUpdateRepartoEstado}
      />

      {selectedReparto && isEditModalOpen && (
        <EditRepartoDialog
          reparto={selectedReparto}
          onUpdate={(id, data) => handleUpdateReparto(Number(id), data)} 
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
            repartoFecha={selectedReparto.fecha_reparto.toString()}
            onDelete={(id) => handleDeleteReparto(Number(id))} 
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
