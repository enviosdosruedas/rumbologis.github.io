
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Eye } from "lucide-react";
import type { Reparto } from "@/types/reparto";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EmptyStateCard } from "@/components/common/empty-state-card";
// Import dialogs if actions are handled here, or pass handlers from parent
// For now, let's assume Edit and Delete dialogs will be triggered by parent page
// import { EditRepartoDialog, DeleteRepartoDialog } from "./reparto-dialogs"; 


interface RepartoTableProps {
  repartos: Reparto[];
  onEditReparto: (reparto: Reparto) => void; // Callback for edit action
  onDeleteReparto: (repartoId: string) => void; // Callback for delete action
  onViewDetails?: (reparto: Reparto) => void; // Optional: callback for viewing details
}

export function RepartoTable({
  repartos,
  onEditReparto,
  onDeleteReparto,
  onViewDetails,
}: RepartoTableProps) {
  
  if (!repartos || repartos.length === 0) {
    return (
      <EmptyStateCard
        title="Repartos"
        message="No hay repartos registrados."
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Repartos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Reparto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Repartidor</TableHead>
              <TableHead>Cliente Principal</TableHead>
              <TableHead># Clientes Reparto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repartos.map((reparto) => (
              <TableRow key={reparto.id}>
                <TableCell className="font-medium">{reparto.id.substring(0,8)}...</TableCell>
                <TableCell>
                  {format(new Date(reparto.fecha_reparto), "dd/MM/yyyy", { locale: es })}
                </TableCell>
                <TableCell>{reparto.repartidor?.nombre || "N/A"}</TableCell>
                <TableCell>{reparto.cliente?.nombre || "N/A"}</TableCell>
                <TableCell>{reparto.cantidad_clientes_reparto ?? reparto.clientes_reparto_asignados?.length ?? 0}</TableCell>
                <TableCell className="text-right space-x-2">
                  {onViewDetails && (
                     <Button variant="outline" size="sm" onClick={() => onViewDetails(reparto)}>
                       <Eye className="mr-2 h-4 w-4" /> Ver
                     </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onEditReparto(reparto)}>
                    <FilePenLine className="mr-2 h-4 w-4" /> Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteReparto(reparto.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
