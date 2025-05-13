
"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clienteRepartoSchema, type ClienteRepartoFormData } from "@/schemas/cliente-reparto-schema";
import type { ClienteReparto } from "@/types/cliente-reparto";
import type { Cliente } from "@/types/cliente";

interface ClienteRepartoFormProps {
  onSubmit: (data: ClienteRepartoFormData) => void;
  defaultValues?: Partial<ClienteReparto>;
  clientes: Cliente[]; 
  isEditing?: boolean;
}

export function ClienteRepartoForm({ onSubmit, defaultValues, clientes, isEditing = false }: ClienteRepartoFormProps) {
  const form = useForm<ClienteRepartoFormData>({
    resolver: zodResolver(clienteRepartoSchema),
    defaultValues: {
      cliente_id: defaultValues?.cliente_id || "",
      nombre_reparto: defaultValues?.nombre_reparto || "",
      direccion_reparto: defaultValues?.direccion_reparto || "",
      telefono_reparto: defaultValues?.telefono_reparto || "",
      tarifa: defaultValues?.tarifa === null ? undefined : defaultValues?.tarifa || undefined, // Handle null for optional number
      rango_horario: defaultValues?.rango_horario || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cliente_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente Principal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="nombre_reparto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Cliente Reparto</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente de reparto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="direccion_reparto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección Cliente Reparto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Calle Falsa 123, Ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefono_reparto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono Cliente Reparto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: +54 9 11 12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tarifa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarifa</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  {...field} 
                  value={field.value === null ? '' : field.value || ''} // Handle null and undefined for input display
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '') {
                      field.onChange(null); // Set to null if empty
                    } else {
                      const num = parseFloat(val);
                      field.onChange(isNaN(num) ? null : num); // Set to null if not a valid number
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rango_horario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rango Horario</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Lunes a Viernes 9:00-12:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEditing ? "Guardar Cambios" : "Crear Registro"}
        </Button>
      </form>
    </Form>
  );
}
