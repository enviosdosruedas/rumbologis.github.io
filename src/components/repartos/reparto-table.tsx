
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

interface RepartoTableProps {
  repartos: Reparto[];
  onEditReparto: (reparto: Reparto) => void; 
  onDeleteReparto: (repartoId: number) => void; 
  onViewDetails?: (reparto: Reparto) => void; 
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
        createActionComponent={ // Example, actual button passed from page
            <Button disabled>Crear Reparto (Ejemplo)</Button>
        }
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
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Repartidor</TableHead>
              <TableHead>Cliente Principal</TableHead>
              <TableHead className="text-center"># Sucursales</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repartos.map((reparto) => (
              <TableRow key={reparto.id}>
                <TableCell className="font-medium">{reparto.id}</TableCell>
                <TableCell>
                  {format(new Date(reparto.fecha_reparto), "dd/MM/yyyy", { locale: es })}
                </TableCell>
                <TableCell>{reparto.repartidor?.nombre || "N/A"}</TableCell>
                <TableCell>{reparto.cliente?.nombre || "N/A"}</TableCell>
                <TableCell className="text-center">{reparto.cantidad_clientes_reparto ?? 0}</TableCell>
                <TableCell className="text-right space-x-2">
                  {onViewDetails && (
                     <Button variant="outline" size="sm" onClick={() => onViewDetails(reparto)}>
                       <Eye className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Ver</span>
                     </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onEditReparto(reparto)}>
                    <FilePenLine className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Editar</span>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteReparto(reparto.id)}>
                    <Trash2 className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Eliminar</span>
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

