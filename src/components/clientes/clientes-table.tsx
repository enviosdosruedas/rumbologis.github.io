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
import type { Cliente } from "@/types/cliente";
import type { ClienteFormData } from "@/schemas/cliente-schema";
import { EditClienteDialog, DeleteClienteDialog } from "./cliente-dialogs";

interface ClientesTableProps {
  clientes: Cliente[];
  onUpdateCliente: (id: string, data: ClienteFormData) => void;
  onDeleteCliente: (id: string) => void;
}

export function ClientesTable({ clientes, onUpdateCliente, onDeleteCliente }: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No hay clientes registrados.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">{cliente.nombre}</TableCell>
                <TableCell>{cliente.direccion}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditClienteDialog cliente={cliente} onUpdate={onUpdateCliente} />
                  <DeleteClienteDialog clienteId={cliente.id} clienteNombre={cliente.nombre} onDelete={onDeleteCliente} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
