import { z } from 'zod';

export const repartidorSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido." }),
  identificacion: z.string().min(1, { message: "La identificación es requerida." }),
  telefono: z.string().min(1, { message: "El teléfono es requerido." }).regex(/^\+?[0-9\s-]{7,15}$/, { message: "Número de teléfono inválido." }),
  vehiculo: z.string().min(1, { message: "El vehículo asignado es requerido." }),
});

export type RepartidorFormData = z.infer<typeof repartidorSchema>;
