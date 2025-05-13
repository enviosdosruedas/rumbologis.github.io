import type { Cliente } from '@/types/cliente';

export interface ClienteReparto {
  id: string; // UUID, will be auto-generated or handled by Supabase later
  codigo: string;
  clienteId: string; // Foreign key to Cliente
  nombreReparto: string;
  direccionReparto: string;
  tarifa: number;
  rangoHorario: string;
  // Optional: for display purposes, can be populated by joining/mapping
  cliente?: Cliente; 
}
