import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido." }),
  direccion: z.string().min(1, { message: "La dirección es requerida." }),
  telefono: z.string().min(1, { message: "El teléfono es requerido." }).regex(/^\+?[0-9\s-]{7,15}$/, { message: "Número de teléfono inválido." }),
  correo_electronico: z.string().min(1, { message: "El correo electrónico es requerido." }).email({ message: "Correo electrónico inválido." }),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
