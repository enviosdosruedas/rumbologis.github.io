import type { Cliente } from '@/types/cliente';

export interface ClienteReparto {
  id: number; 
  cliente_id: string; 
  nombre_reparto: string;
  direccion_reparto: string;
  tarifa: number;
  rango_horario: string;
  created_at?: string; 
  updated_at?: string; 
  cliente?: Cliente; 
}
