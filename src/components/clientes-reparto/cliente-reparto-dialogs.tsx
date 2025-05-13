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
import { ClienteRepartoForm } from "./cliente-reparto-form";
import type { ClienteReparto } from "@/types/cliente-reparto";
import type { ClienteRepartoFormData } from "@/schemas/cliente-reparto-schema";
import type { Cliente } from "@/types/cliente";
import { PlusCircle, FilePenLine, Trash2 } from "lucide-react";

interface CreateClienteRepartoDialogProps {
  onCreate: (data: ClienteRepartoFormData) => void;
  clientes: Cliente[];
}

export function CreateClienteRepartoDialog({ onCreate, clientes }: CreateClienteRepartoDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (data: ClienteRepartoFormData) => {
    onCreate(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Registro Reparto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Registro de Reparto para Cliente</DialogTitle>
          <DialogDescription>
            Complete los campos para agregar una nueva configuración de reparto.
          </DialogDescription>
        </DialogHeader>
        <ClienteRepartoForm onSubmit={handleSubmit} clientes={clientes} />
      </DialogContent>
    </Dialog>
  );
}

interface EditClienteRepartoDialogProps {
  clienteReparto: ClienteReparto;
  onUpdate: (id: string, data: ClienteRepartoFormData) => void;
  clientes: Cliente[];
}

export function EditClienteRepartoDialog({ clienteReparto, onUpdate, clientes }: EditClienteRepartoDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (data: ClienteRepartoFormData) => {
    onUpdate(clienteReparto.id, data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FilePenLine className="mr-2 h-4 w-4" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Registro de Reparto</DialogTitle>
          <DialogDescription>
            Modifique los campos para actualizar la configuración de reparto.
          </DialogDescription>
        </DialogHeader>
        <ClienteRepartoForm onSubmit={handleSubmit} defaultValues={clienteReparto} clientes={clientes} isEditing />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteClienteRepartoDialogProps {
  clienteRepartoId: string;
  clienteRepartoCodigo: string; // Or nombreReparto for better context
  onDelete: (id: string) => void;
}

export function DeleteClienteRepartoDialog({ clienteRepartoId, clienteRepartoCodigo, onDelete }: DeleteClienteRepartoDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete(clienteRepartoId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Registro de Reparto</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar el registro de reparto con código "{clienteRepartoCodigo}"? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
