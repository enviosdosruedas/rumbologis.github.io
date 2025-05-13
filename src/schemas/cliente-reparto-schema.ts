import { z } from 'zod';

export const clienteRepartoSchema = z.object({
  cliente_id: z.string().uuid({ message: "Debe seleccionar un cliente válido." }),
  nombre_reparto: z.string().min(1, { message: "El nombre para el reparto es requerido." }),
  direccion_reparto: z.string().min(1, { message: "La dirección de reparto es requerida." }),
  tarifa: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : typeof val === 'number' ? val : undefined),
    z.number({ invalid_type_error: "La tarifa debe ser un número." }).positive({ message: "La tarifa debe ser un número positivo." }).nullable().optional()
  ),
  rango_horario: z.string().min(1, { message: "El rango horario es requerido." }),
});

export type ClienteRepartoFormData = z.infer<typeof clienteRepartoSchema>;
