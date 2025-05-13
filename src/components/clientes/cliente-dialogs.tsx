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
import { ClienteForm } from "./cliente-form";
import type { Cliente } from "@/types/cliente";
import type { ClienteFormData } from "@/schemas/cliente-schema";
import { PlusCircle, FilePenLine, Trash2 } from "lucide-react";

interface CreateClienteDialogProps {
  onCreate: (data: ClienteFormData) => void;
}

export function CreateClienteDialog({ onCreate }: CreateClienteDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (data: ClienteFormData) => {
    onCreate(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Complete los campos para agregar un nuevo cliente.
          </DialogDescription>
        </DialogHeader>
        <ClienteForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

interface EditClienteDialogProps {
  cliente: Cliente;
  onUpdate: (id: string, data: ClienteFormData) => void;
}

export function EditClienteDialog({ cliente, onUpdate }: EditClienteDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (data: ClienteFormData) => {
    onUpdate(cliente.id, data);
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
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifique los campos para actualizar la información del cliente.
          </DialogDescription>
        </DialogHeader>
        <ClienteForm onSubmit={handleSubmit} defaultValues={cliente} isEditing />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteClienteDialogProps {
  clienteId: string;
  clienteNombre: string;
  onDelete: (id: string) => void;
}

export function DeleteClienteDialog({ clienteId, clienteNombre, onDelete }: DeleteClienteDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete(clienteId);
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
          <DialogTitle>Eliminar Cliente</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar al cliente "{clienteNombre}"? Esta acción no se puede deshacer.
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
