
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
import type { Repartidor } from "@/types/repartidor";
import type { RepartidorFormData } from "@/schemas/repartidor-schema";
import { EditRepartidorDialog, DeleteRepartidorDialog } from "./repartidor-dialogs";
import { EmptyStateCard } from "@/components/common/empty-state-card";

interface RepartidoresTableProps {
  repartidores: Repartidor[];
  onUpdateRepartidor: (id: string, data: RepartidorFormData) => void;
  onDeleteRepartidor: (id: string) => void;
}

export function RepartidoresTable({ repartidores, onUpdateRepartidor, onDeleteRepartidor }: RepartidoresTableProps) {
  if (repartidores.length === 0) {
    return (
      <EmptyStateCard
        title="Repartidores"
        message="No hay repartidores registrados."
      />
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Repartidores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Identificación</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Vehículo Asignado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repartidores.map((repartidor) => (
              <TableRow key={repartidor.id}>
                <TableCell className="font-medium">{repartidor.nombre}</TableCell>
                <TableCell>{repartidor.identificacion}</TableCell>
                <TableCell>{repartidor.telefono}</TableCell>
                <TableCell>{repartidor.vehiculo_asignado}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditRepartidorDialog repartidor={repartidor} onUpdate={onUpdateRepartidor} />
                  <DeleteRepartidorDialog repartidorId={repartidor.id} repartidorNombre={repartidor.nombre} onDelete={onDeleteRepartidor} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
