import { z } from 'zod';

export const clienteRepartoSchema = z.object({
  codigo: z.string().min(1, { message: "El código es requerido." }),
  clienteId: z.string().min(1, { message: "Debe seleccionar un cliente." }),
  nombreReparto: z.string().min(1, { message: "El nombre para el reparto es requerido." }),
  direccionReparto: z.string().min(1, { message: "La dirección de reparto es requerida." }),
  tarifa: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number({ invalid_type_error: "La tarifa debe ser un número." }).positive({ message: "La tarifa debe ser un número positivo." })
  ),
  rangoHorario: z.string().min(1, { message: "El rango horario es requerido." }),
});

export type ClienteRepartoFormData = z.infer<typeof clienteRepartoSchema>;
