
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Reparto } from "@/types/reparto";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RepartoDetailsProps {
  reparto: Reparto | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RepartoDetails({ reparto, isOpen, onOpenChange }: RepartoDetailsProps) {
  if (!reparto) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Reparto</DialogTitle>
          <DialogDescription>
            Información detallada del reparto seleccionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">ID Reparto:</span>
            <span>{reparto.id.substring(0,8)}...</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Fecha:</span>
            <span>{format(new Date(reparto.fecha_reparto), "PPP", { locale: es })}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Repartidor:</span>
            <span>{reparto.repartidor?.nombre || "No asignado"}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Cliente Principal:</span>
            <span>{reparto.cliente?.nombre || "No asignado"}</span>
          </div>
          
          {reparto.observaciones && (
            <div>
              <h4 className="font-semibold mt-2 mb-1">Observaciones:</h4>
              <p className="text-sm text-muted-foreground p-2 border rounded-md bg-secondary/30">
                {reparto.observaciones}
              </p>
            </div>
          )}

          <div>
            <h4 className="font-semibold mt-2 mb-1">Clientes de Reparto Asignados:</h4>
            {reparto.clientes_reparto_asignados && reparto.clientes_reparto_asignados.length > 0 ? (
              <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                {reparto.clientes_reparto_asignados.map((cr) => (
                  <li key={cr.id}>
                    {cr.nombre_reparto} - {cr.direccion_reparto}
                    {cr.tarifa && ` (Tarifa: $${cr.tarifa.toFixed(2)})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay clientes de reparto asignados.</p>
            )}
             {(reparto.cantidad_clientes_reparto && (!reparto.clientes_reparto_asignados || reparto.clientes_reparto_asignados.length ===0)) && (
                <p className="text-sm text-muted-foreground"> ({reparto.cantidad_clientes_reparto} clientes de reparto asignados - detalles no cargados)</p>
             )}
          </div>

        </div>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="mt-4 w-full">
            Cerrar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
