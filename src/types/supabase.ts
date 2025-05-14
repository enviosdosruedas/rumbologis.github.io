
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          nombre: string
          direccion: string | null
          telefono: string | null
          correo_electronico: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Insert: {
          id: string
          nombre: string
          direccion?: string | null
          telefono?: string | null
          correo_electronico?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          direccion?: string | null
          telefono?: string | null
          correo_electronico?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      repartidores: {
        Row: {
          id: string // UUID, Primary Key
          nombre: string
          identificacion: string // Unique
          telefono: string | null
          vehiculo_asignado: string | null
          created_at?: string | null
          updated_at?: string | null
          rol?: string | null // Added
          usuario?: string | null // Added, Unique
          auth_user_id?: string | null // Added, FK to auth.users.id
        }
        Insert: {
          id: string // Should come from auth.users.id if it's the PK linked to auth
          nombre: string
          identificacion: string
          telefono?: string | null
          vehiculo_asignado?: string | null
          created_at?: string | null
          updated_at?: string | null
          rol?: string | null
          usuario?: string | null
          auth_user_id?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          identificacion?: string
          telefono?: string | null
          vehiculo_asignado?: string | null
          created_at?: string | null
          updated_at?: string | null
          rol?: string | null
          usuario?: string | null
          auth_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repartidores_auth_user_id_fkey"
            columns: ["auth_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      clientes_reparto: {
        Row: {
          id: number // SERIAL, Primary Key
          cliente_id: string // UUID, FK to clientes.id
          nombre_reparto: string
          direccion_reparto: string | null
          telefono_reparto: string | null
          tarifa: number | null
          rango_horario: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Insert: {
          id?: number // Optional on insert as it's SERIAL
          cliente_id: string
          nombre_reparto: string
          direccion_reparto?: string | null
          telefono_reparto?: string | null
          tarifa?: number | null
          rango_horario?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          cliente_id?: string
          nombre_reparto?: string
          direccion_reparto?: string | null
          telefono_reparto?: string | null
          tarifa?: number | null
          rango_horario?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_reparto_cliente_id_fkey"
            columns: ["cliente_id"]
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      repartos: {
        Row: {
          id: number // SERIAL, Primary Key
          fecha_reparto: string // DATE
          repartidor_id: string // UUID, FK to repartidores.id
          cliente_id: string // UUID, FK to clientes.id
          observaciones: string | null
          estado: string // VARCHAR or ENUM type
          created_at?: string | null
          updated_at?: string | null
        }
        Insert: {
          id?: number // Optional on insert
          fecha_reparto: string
          repartidor_id: string
          cliente_id: string
          observaciones?: string | null
          estado: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          fecha_reparto?: string
          repartidor_id?: string
          cliente_id?: string
          observaciones?: string | null
          estado?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repartos_repartidor_id_fkey"
            columns: ["repartidor_id"]
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repartos_cliente_id_fkey"
            columns: ["cliente_id"]
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          }
        ]
      }
      reparto_cliente_reparto: {
        Row: {
          reparto_id: number // FK to repartos.id
          cliente_reparto_id: number // FK to clientes_reparto.id
        }
        Insert: {
          reparto_id: number
          cliente_reparto_id: number
        }
        Update: {
          reparto_id?: number
          cliente_reparto_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "reparto_cliente_reparto_reparto_id_fkey"
            columns: ["reparto_id"]
            referencedRelation: "repartos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reparto_cliente_reparto_cliente_reparto_id_fkey"
            columns: ["cliente_reparto_id"]
            referencedRelation: "clientes_reparto"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
