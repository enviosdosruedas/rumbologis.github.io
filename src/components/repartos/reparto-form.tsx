"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { repartoSchema, type RepartoFormData } from "@/schemas/reparto-schema";
import type { Repartidor } from "@/types/repartidor";
import type { Cliente } from "@/types/cliente";
import type { ClienteReparto } from "@/types/cliente-reparto";
import { ClienteRepartoSelector } from "./cliente-reparto-selector"; // Importar el nuevo componente

interface RepartoFormProps {
  onSubmit: (data: RepartoFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<RepartoFormData & { fecha_reparto?: string | Date }>;
  isEditing?: boolean;
  repartidores: Repartidor[];
  clientes: Cliente[];
  clientesRepartoList: ClienteReparto[]; // All available clientes_reparto records
}

export function RepartoForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  repartidores,
  clientes,
  clientesRepartoList,
}: RepartoFormProps) {
  const form = useForm<RepartoFormData>({
    resolver: zodResolver(repartoSchema),
    defaultValues: {
      ...defaultValues,
      fecha_reparto: defaultValues?.fecha_reparto ? new Date(defaultValues.fecha_reparto) : new Date(),
      repartidor_id: defaultValues?.repartidor_id || "",
      cliente_id: defaultValues?.cliente_id || "",
      clientes_reparto_seleccionados_ids: defaultValues?.clientes_reparto_seleccionados_ids || [],
      observaciones: defaultValues?.observaciones || "",
    },
  });

  const selectedClienteId = form.watch("cliente_id");
  const [availableClientesReparto, setAvailableClientesReparto] = useState<ClienteReparto[]>([]);

  useEffect(() => {
    if (selectedClienteId) {
      const filtered = clientesRepartoList.filter(cr => cr.cliente_id === selectedClienteId);
      setAvailableClientesReparto(filtered);
      
      const currentSelections = form.getValues("clientes_reparto_seleccionados_ids") || [];
      const validSelectionsForNewClient = currentSelections.filter(id => 
        filtered.some(crFiltered => crFiltered.id === id)
      );
      form.setValue('clientes_reparto_seleccionados_ids', validSelectionsForNewClient);
    } else {
      setAvailableClientesReparto([]);
      form.setValue('clientes_reparto_seleccionados_ids', []); 
    }
  }, [selectedClienteId, clientesRepartoList, form]);

  const handleFormSubmit = (data: RepartoFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fecha_reparto"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha del Reparto</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: es })
                      ) : (
                        <span>Seleccione una fecha</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date)}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repartidor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repartidor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un repartidor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {repartidores.map((repartidor) => (
                    <SelectItem key={repartidor.id} value={repartidor.id}>
                      {repartidor.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cliente_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente Principal</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cliente principal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <ClienteRepartoSelector
          control={form.control}
          name="clientes_reparto_seleccionados_ids"
          availableClientesReparto={availableClientesReparto}
          selectedClienteId={selectedClienteId}
        />

        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas adicionales sobre el reparto..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Guardar Cambios" : "Crear Reparto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
