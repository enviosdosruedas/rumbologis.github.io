
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { RepartoForm } from "./reparto-form";
import type { Reparto } from "@/types/reparto";
import type { RepartoFormData } from "@/schemas/reparto-schema";
import type { Repartidor } from "@/types/repartidor";
import type { Cliente } from "@/types/cliente";
import type { ClienteReparto } from "@/types/cliente-reparto";
import { PlusCircle, FilePenLine, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CreateRepartoDialogProps {
  onCreate: (data: RepartoFormData) => void;
  repartidores: Repartidor[];
  clientes: Cliente[];
  clientesRepartoList: ClienteReparto[];
  triggerButton?: React.ReactNode;
}

export function CreateRepartoDialog({
  onCreate,
  repartidores,
  clientes,
  clientesRepartoList,
  triggerButton
}: CreateRepartoDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (data: RepartoFormData) => {
    onCreate(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Reparto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Reparto</DialogTitle>
          <DialogDescription>
            Complete los campos para programar un nuevo reparto.
          </DialogDescription>
        </DialogHeader>
        <RepartoForm
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          repartidores={repartidores}
          clientes={clientes}
          clientesRepartoList={clientesRepartoList}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditRepartoDialogProps {
  reparto: Reparto; 
  onUpdate: (id: number, data: RepartoFormData) => void;
  repartidores: Repartidor[];
  clientes: Cliente[];
  clientesRepartoList: ClienteReparto[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRepartoDialog({
  reparto,
  onUpdate,
  repartidores,
  clientes,
  clientesRepartoList,
  isOpen,
  onOpenChange,
}: EditRepartoDialogProps) {
  
  const handleSubmit = (data: RepartoFormData) => {
    onUpdate(reparto.id, data); // reparto.id is number
    onOpenChange(false);
  };

  const defaultValues: Partial<RepartoFormData & { fecha_reparto?: string | Date }> = {
    ...reparto, // Spread all properties from reparto
    fecha_reparto: new Date(reparto.fecha_reparto),
    // Use pre-fetched clientes_reparto_ids if available on the reparto object
    // This assumes the parent component (RepartosPage) fetches and attaches `clientes_reparto_ids` to the `selectedReparto` object
    clientes_reparto_seleccionados_ids: reparto.clientes_reparto_ids || reparto.clientes_reparto_asignados?.map(cr => cr.id) || [],
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Reparto</DialogTitle>
          <DialogDescription>
            Modifique los campos para actualizar la información del reparto.
          </DialogDescription>
        </DialogHeader>
        <RepartoForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          defaultValues={defaultValues}
          isEditing
          repartidores={repartidores}
          clientes={clientes}
          clientesRepartoList={clientesRepartoList}
        />
      </DialogContent>
    </Dialog>
  );
}


interface DeleteRepartoDialogProps {
  repartoId: number;
  repartoFecha: string; 
  onDelete: (id: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRepartoDialog({ repartoId, repartoFecha, onDelete, isOpen, onOpenChange }: DeleteRepartoDialogProps) {
  
  const handleDelete = () => {
    onDelete(repartoId);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Reparto</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar el reparto del día {format(new Date(repartoFecha), "PPP", {locale: es})} (ID: {repartoId})? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

