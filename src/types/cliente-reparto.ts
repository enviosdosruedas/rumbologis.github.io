import type { Cliente } from '@/types/cliente';

export interface ClienteReparto {
  id: number; 
  cliente_id: string; 
  nombre_reparto: string;
  direccion_reparto: string;
  telefono_reparto?: string; // Added telefono_reparto field
  tarifa: number | null; // Allow null for tarifa
  rango_horario: string;
  created_at?: string; 
  updated_at?: string; 
  cliente?: Cliente; 
}
