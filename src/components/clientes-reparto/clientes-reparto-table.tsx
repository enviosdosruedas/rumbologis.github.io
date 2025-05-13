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
import type { Cliente } from "@/types/cliente";
import { EditClienteRepartoDialog, DeleteClienteRepartoDialog } from "./cliente-reparto-dialogs";
import { EmptyStateCard } from "@/components/common/empty-state-card";

interface ClientesRepartoTableProps {
  clientesReparto: ClienteReparto[];
  clientes: Cliente[]; // To look up client names
  onUpdateClienteReparto: (id: string, data: ClienteRepartoFormData) => void;
  onDeleteClienteReparto: (id: string) => void;
}

export function ClientesRepartoTable({ 
  clientesReparto, 
  clientes, 
  onUpdateClienteReparto, 
  onDeleteClienteReparto 
}: ClientesRepartoTableProps) {
  
  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : "Desconocido";
  };

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
              <TableHead>Código</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Nombre Reparto</TableHead>
              <TableHead>Dirección Reparto</TableHead>
              <TableHead>Tarifa</TableHead>
              <TableHead>Rango Horario</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesReparto.map((cr) => (
              <TableRow key={cr.id}>
                <TableCell className="font-medium">{cr.codigo}</TableCell>
                <TableCell>{getClienteNombre(cr.clienteId)}</TableCell>
                <TableCell>{cr.nombreReparto}</TableCell>
                <TableCell>{cr.direccionReparto}</TableCell>
                <TableCell>{cr.tarifa.toFixed(2)}</TableCell>
                <TableCell>{cr.rangoHorario}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditClienteRepartoDialog 
                    clienteReparto={cr} 
                    onUpdate={onUpdateClienteReparto} 
                    clientes={clientes} 
                  />
                  <DeleteClienteRepartoDialog 
                    clienteRepartoId={cr.id} 
                    clienteRepartoCodigo={cr.codigo} 
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
