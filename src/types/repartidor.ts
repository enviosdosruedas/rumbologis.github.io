
export interface Repartidor {
  id: string; // Should ideally be UUID from auth.users.id
  nombre: string;
  identificacion: string;
  telefono: string;
  vehiculo_asignado: string;
  usuario?: string | null; // Optional: For display or specific logic, login uses email.
  rol?: string | null; // Optional: e.g., 'repartidor', 'admin'
  auth_user_id?: string | null; // Optional: Foreign key to auth.users table
}
