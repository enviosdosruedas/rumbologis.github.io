import type { Cliente } from '@/types/cliente';

export interface ClienteReparto {
  id: number; // SERIAL PRIMARY KEY from database
  codigo: string;
  clienteId: string; // Foreign key to Cliente (UUID)
  nombreReparto: string;
  direccionReparto: string;
  tarifa: number;
  rangoHorario: string;
  created_at?: string; // Handled by Supabase
  updated_at?: string; // Handled by Supabase
  // Optional: for display purposes, can be populated by joining/mapping
  cliente?: Cliente; 
}
