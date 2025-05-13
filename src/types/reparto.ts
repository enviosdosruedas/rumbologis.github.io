
import type { Repartidor } from './repartidor';
import type { Cliente } from './cliente';
import type { ClienteReparto } from './cliente-reparto';

// Interface for data as stored in the DB or initially fetched
export interface RepartoBase {
  id: string; // Assuming UUID for consistency, or number if SERIAL
  fecha_reparto: string; // Store as ISO string, convert to Date object in UI
  repartidor_id: string; // UUID of the repartidor
  cliente_id: string; // UUID of the cliente
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for Reparto data used in the application, potentially with joined/enriched data
export interface Reparto extends RepartoBase {
  // For display purposes, populated after fetching/joining
  repartidor?: Pick<Repartidor, 'nombre'>;
  cliente?: Pick<Cliente, 'nombre'>;
  // IDs of ClienteReparto records associated with this Reparto
  // This association will likely be stored in a separate join table (e.g., reparto_clientes_reparto)
  // For simplicity in this phase, we might handle it directly or assume a simpler structure if
  // the DB schema for repartos isn't defined yet.
  // Let's assume for the form, we manage an array of selected ClienteReparto IDs.
  clientes_reparto_asignados?: ClienteReparto[]; // Full objects of assigned clientes_reparto
  // This might be derived or fetched based on a join table
  cantidad_clientes_reparto?: number;
}

// Type for the join table between repartos and clientes_reparto
export interface RepartoClienteRepartoLink {
  id: number; // Or string if UUID
  reparto_id: string; // FK to repartos.id
  cliente_reparto_id: number; // FK to clientes_reparto.id
}
