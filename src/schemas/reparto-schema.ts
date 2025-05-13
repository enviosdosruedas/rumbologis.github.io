
import { z } from 'zod';

export const repartoSchema = z.object({
  fecha_reparto: z.date({
    required_error: "La fecha del reparto es requerida.",
    invalid_type_error: "La fecha del reparto es inválida.",
  }),
  repartidor_id: z.string().uuid({ message: "Debe seleccionar un repartidor." }),
  cliente_id: z.string().uuid({ message: "Debe seleccionar un cliente." }),
  // This will store an array of IDs of the selected ClienteReparto records
  clientes_reparto_seleccionados_ids: z.array(z.number())
    .min(1, { message: "Debe seleccionar al menos un cliente de reparto." })
    .optional(), // Making it optional for now, can be enforced later
  observaciones: z.string().optional(),
});

export type RepartoFormData = z.infer<typeof repartoSchema>;
