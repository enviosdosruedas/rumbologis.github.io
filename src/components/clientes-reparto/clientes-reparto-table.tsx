
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClienteReparto } from "@/types/cliente-reparto";
import type { ClienteRepartoFormData } from "@/schemas/cliente-reparto-schema";
import type { Cliente } from "@/types/cliente"; // Main client type for the 'clientes' prop
import { EditClienteRepartoDialog, DeleteClienteRepartoDialog } from "./cliente-reparto-dialogs";
import { EmptyStateCard } from "@/components/common/empty-state-card";

interface ClientesRepartoTableProps {
  clientesReparto: ClienteReparto[]; // This now contains nested 'clientes' object with name
  clientes: Cliente[]; // Main list of clients, passed to EditClienteRepartoDialog
  onUpdateClienteReparto: (id: number, data: ClienteRepartoFormData) => void;
  onDeleteClienteReparto: (id: number) => void;
}

export function ClientesRepartoTable({ 
  clientesReparto, 
  clientes, // Keep this prop for passing to EditClienteRepartoDialog
  onUpdateClienteReparto, 
  onDeleteClienteReparto 
}: ClientesRepartoTableProps) {
  
  // The getClienteNombre function is no longer needed if 'clientes.nombre' is fetched directly.
  // const getClienteNombre = (clienteId: string) => {
  //   const cliente = clientes.find(c => c.id === clienteId);
  //   return cliente ? cliente.nombre : "Desconocido";
  // };

  if (clientesReparto.length === 0) {
    return (
      <EmptyStateCard
        title="Registros de Reparto por Cliente"
        message="No hay registros de reparto configurados."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Registros de Reparto</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente Principal</TableHead>
              <TableHead>Nombre Cliente Reparto</TableHead>
              <TableHead>Dirección Reparto</TableHead>
              <TableHead>Teléfono Reparto</TableHead>
              <TableHead>Tarifa</TableHead>
              <TableHead>Rango Horario</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesReparto.map((cr) => (
              <TableRow key={cr.id}>
                {/* Access nested client name: cr.clientes?.nombre */}
                <TableCell>{cr.clientes?.nombre || "Desconocido"}</TableCell>
                <TableCell>{cr.nombre_reparto}</TableCell>
                <TableCell>{cr.direccion_reparto}</TableCell>
                <TableCell>{cr.telefono_reparto || '-'}</TableCell>
                <TableCell>{cr.tarifa ? cr.tarifa.toFixed(2) : '-'}</TableCell>
                <TableCell>{cr.rango_horario}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditClienteRepartoDialog 
                    clienteReparto={cr} 
                    onUpdate={onUpdateClienteReparto} 
                    clientes={clientes} // Pass main clients list to Edit dialog
                  />
                  <DeleteClienteRepartoDialog 
                    clienteRepartoId={cr.id} 
                    // Use nombre_reparto for the confirmation dialog as client name might not be loaded if something went wrong.
                    // Or, ideally, use cr.clientes?.nombre if available.
                    clienteRepartoNombre={cr.nombre_reparto || `ID ${cr.id}`} 
                    onDelete={onDeleteClienteReparto} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
