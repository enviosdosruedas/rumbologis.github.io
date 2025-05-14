"use client";

import React from "react";
import type { Control, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RepartoFormData } from "@/schemas/reparto-schema";
import type { ClienteReparto } from "@/types/cliente-reparto";

interface ClienteRepartoSelectorProps {
  control: Control<RepartoFormData>;
  name: Path<RepartoFormData>; // Should be "clientes_reparto_seleccionados_ids"
  availableClientesReparto: ClienteReparto[];
  selectedClienteId?: string; // To know if a main client is selected
}

export function ClienteRepartoSelector({
  control,
  name,
  availableClientesReparto,
  selectedClienteId,
}: ClienteRepartoSelectorProps) {
  if (!selectedClienteId) {
    return (
      <p className="text-sm text-muted-foreground">
        Seleccione un cliente principal para ver sus clientes de reparto asociados.
      </p>
    );
  }

  if (availableClientesReparto.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Este cliente no tiene clientes de reparto asociados. Puede crearlos en la sección 'Clientes Reparto'.
      </p>
    );
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Clientes de Reparto Asociados</FormLabel>
          <ScrollArea className="h-40 w-full rounded-md border p-4">
            <div className="space-y-2">
              {availableClientesReparto.map((cr) => (
                <FormField
                  key={cr.id}
                  control={control}
                  name={name} // Use the same name for the nested FormField
                  render={({ field: subField }) => {
                    // Ensure subField.value is an array
                    const currentValues = Array.isArray(subField.value) ? subField.value : [];
                    return (
                      <FormItem
                        key={cr.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={currentValues.includes(cr.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? subField.onChange([...currentValues, cr.id])
                                : subField.onChange(
                                    currentValues.filter(
                                      (value) => value !== cr.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          {cr.nombre_reparto} ({cr.direccion_reparto})
                          {cr.tarifa && ` - Tarifa: $${cr.tarifa.toFixed(2)}`}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </ScrollArea>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
