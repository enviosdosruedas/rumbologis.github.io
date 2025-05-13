
// No longer need to import Cliente from '@/types/cliente' for the 'cliente?: Cliente' field

export interface ClienteReparto {
  id: number; 
  cliente_id: string; 
  nombre_reparto: string;
  direccion_reparto: string;
  telefono_reparto?: string;
  tarifa: number | null; 
  rango_horario: string;
  created_at?: string; 
  updated_at?: string; 
  clientes?: { // For data fetched like: clientes (id, nombre)
    id: string;
    nombre: string;
  };
}
