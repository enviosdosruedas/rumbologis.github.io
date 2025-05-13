
import type { Repartidor } from './repartidor';
import type { Cliente } from './cliente';
import type { ClienteReparto } from './cliente-reparto';

// Interface for data as stored in the DB or initially fetched
export interface RepartoBase {
  id: number; // SERIAL PRIMARY KEY, so it's a number
  fecha_reparto: string; // Store as ISO string (YYYY-MM-DD from DATE type), convert to Date object in UI
  repartidor_id: string; // UUID of the repartidor
  cliente_id: string; // UUID of the cliente
  observaciones?: string | null; // Allow null for text fields from DB
  created_at?: string;
  updated_at?: string;
}

// Interface for Reparto data used in the application, potentially with joined/enriched data
export interface Reparto extends RepartoBase {
  // For display purposes, populated after fetching/joining
  repartidor?: Pick<Repartidor, 'nombre' | 'id'>; // Include ID for potential linking or consistency
  cliente?: Pick<Cliente, 'nombre' | 'id'>; // Include ID
  
  // Full objects of assigned clientes_reparto
  // This will be fetched separately or through a more complex join for the details view/edit form
  clientes_reparto_asignados?: ClienteReparto[]; 
  
  // Count of assigned clientes_reparto, typically fetched with the main list
  cantidad_clientes_reparto?: number;

  // Storing just the IDs is useful for form submission if full objects aren't needed everywhere
  clientes_reparto_ids?: number[];
}

// Type for the join table between repartos and clientes_reparto
export interface RepartoClienteRepartoLink {
  reparto_id: number; // FK to repartos.id
  cliente_reparto_id: number; // FK to clientes_reparto.id
}

