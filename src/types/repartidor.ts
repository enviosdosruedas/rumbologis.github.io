
export interface Repartidor {
  id: string; // UUID, Primary Key
  nombre: string;
  identificacion: string; // Unique
  telefono: string | null;
  vehiculo_asignado: string | null;
  // Removed: usuario?: string | null; 
  // Removed: rol?: string | null; 
  // Removed: auth_user_id?: string | null; 
}
