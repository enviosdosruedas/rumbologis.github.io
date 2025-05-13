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
import { repartidorSchema, type RepartidorFormData } from "@/schemas/repartidor-schema";
import type { Repartidor } from "@/types/repartidor";

interface RepartidorFormProps {
  onSubmit: (data: RepartidorFormData) => void;
  defaultValues?: Partial<Repartidor>;
  isEditing?: boolean;
}

export function RepartidorForm({ onSubmit, defaultValues, isEditing = false }: RepartidorFormProps) {
  const form = useForm<RepartidorFormData>({
    resolver: zodResolver(repartidorSchema),
    defaultValues: {
      nombre: defaultValues?.nombre || "",
      identificacion: defaultValues?.identificacion || "",
      telefono: defaultValues?.telefono || "",
      vehiculo: defaultValues?.vehiculo || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo del repartidor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="identificacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: DNI, CUIT, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Ej: +54 9 11 12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehiculo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehículo Asignado</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Moto Honda CB190, Patente A001BCD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEditing ? "Guardar Cambios" : "Crear Repartidor"}
        </Button>
      </form>
    </Form>
  );
}
