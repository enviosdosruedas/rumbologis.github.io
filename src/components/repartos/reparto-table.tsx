
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePenLine, Trash2, Eye, ChevronDown } from "lucide-react";
import type { Reparto, RepartoEstado } from "@/types/reparto";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EmptyStateCard } from "@/components/common/empty-state-card";

interface RepartoTableProps {
  repartos: Reparto[];
  onEditReparto: (reparto: Reparto) => void; 
  onDeleteReparto: (repartoId: number) => void; 
  onViewDetails?: (reparto: Reparto) => void; 
  onUpdateEstado: (repartoId: number, nuevoEstado: RepartoEstado) => void;
}

const estadoOpciones: RepartoEstado[] = ['Asignado', 'En Curso', 'Completo'];

export function RepartoTable({
  repartos,
  onEditReparto,
  onDeleteReparto,
  onViewDetails,
  onUpdateEstado,
}: RepartoTableProps) {
  
  if (!repartos || repartos.length === 0) {
    return (
      <EmptyStateCard
        title="Repartos"
        message="No hay repartos registrados."
        // Create action component could be passed from the page if needed for the empty state
        // createActionComponent={<Button disabled>Crear Reparto (Ejemplo)</Button>}
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
              <TableHead>Estado</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{reparto.estado}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 p-0 data-[state=open]:bg-muted">
                          <ChevronDown className="h-3.5 w-3.5" />
                          <span className="sr-only">Cambiar estado</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {estadoOpciones.map((estadoOp) => (
                          <DropdownMenuItem
                            key={estadoOp}
                            onClick={() => onUpdateEstado(reparto.id, estadoOp)}
                            disabled={reparto.estado === estadoOp}
                          >
                            {estadoOp}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
                <TableCell className="text-center">{reparto.cantidad_clientes_reparto ?? 0}</TableCell>
                <TableCell className="text-right space-x-1">
                  {onViewDetails && (
                     <Button variant="outline" size="sm" onClick={() => onViewDetails(reparto)} className="p-1.5 h-auto md:p-2 md:h-9">
                       <Eye className="h-3.5 w-3.5 md:mr-1.5" /> <span className="hidden md:inline">Ver</span>
                     </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => onEditReparto(reparto)} className="p-1.5 h-auto md:p-2 md:h-9">
                    <FilePenLine className="h-3.5 w-3.5 md:mr-1.5" /> <span className="hidden md:inline">Editar</span>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteReparto(reparto.id)} className="p-1.5 h-auto md:p-2 md:h-9">
                    <Trash2 className="h-3.5 w-3.5 md:mr-1.5" /> <span className="hidden md:inline">Eliminar</span>
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
