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
import { RepartidorForm } from "./repartidor-form";
import type { Repartidor } from "@/types/repartidor";
import type { RepartidorFormData } from "@/schemas/repartidor-schema";
import { PlusCircle, FilePenLine, Trash2 } from "lucide-react";

interface CreateRepartidorDialogProps {
  onCreate: (data: RepartidorFormData) => void;
}

export function CreateRepartidorDialog({ onCreate }: CreateRepartidorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (data: RepartidorFormData) => {
    onCreate(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Repartidor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Repartidor</DialogTitle>
          <DialogDescription>
            Complete los campos para agregar un nuevo repartidor.
          </DialogDescription>
        </DialogHeader>
        <RepartidorForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

interface EditRepartidorDialogProps {
  repartidor: Repartidor;
  onUpdate: (id: string, data: RepartidorFormData) => void;
}

export function EditRepartidorDialog({ repartidor, onUpdate }: EditRepartidorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (data: RepartidorFormData) => {
    onUpdate(repartidor.id, data);
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
          <DialogTitle>Editar Repartidor</DialogTitle>
          <DialogDescription>
            Modifique los campos para actualizar la información del repartidor.
          </DialogDescription>
        </DialogHeader>
        <RepartidorForm onSubmit={handleSubmit} defaultValues={repartidor} isEditing />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteRepartidorDialogProps {
  repartidorId: string;
  repartidorNombre: string;
  onDelete: (id: string) => void;
}

export function DeleteRepartidorDialog({ repartidorId, repartidorNombre, onDelete }: DeleteRepartidorDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete(repartidorId);
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
          <DialogTitle>Eliminar Repartidor</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar al repartidor "{repartidorNombre}"? Esta acción no se puede deshacer.
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
