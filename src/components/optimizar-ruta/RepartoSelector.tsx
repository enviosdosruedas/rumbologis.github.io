
"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Reparto } from '@/types/reparto';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RepartoSelectorProps {
  repartos: Reparto[];
  selectedRepartoId: number | null;
  onSelectReparto: (repartoId: string) => void;
  isLoading: boolean;
}

export function RepartoSelector({ repartos, selectedRepartoId, onSelectReparto, isLoading }: RepartoSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="reparto-selector" className="text-sm font-medium">Seleccionar Reparto a Optimizar</Label>
      <Select
        value={selectedRepartoId?.toString() || ""}
        onValueChange={onSelectReparto}
        disabled={isLoading || repartos.length === 0}
      >
        <SelectTrigger id="reparto-selector" className="w-full">
          <SelectValue placeholder={isLoading ? "Cargando repartos..." : "Seleccione un reparto"} />
        </SelectTrigger>
        <SelectContent>
          {repartos.length === 0 && !isLoading && (
            <SelectItem value="no-repartos" disabled>No hay repartos disponibles</SelectItem>
          )}
          {repartos.map((reparto) => (
            <SelectItem key={reparto.id} value={reparto.id.toString()}>
              Reparto #{reparto.id} - {format(new Date(reparto.fecha_reparto), 'dd/MM/yyyy', { locale: es })} - {reparto.cliente?.nombre || 'Cliente Desconocido'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
