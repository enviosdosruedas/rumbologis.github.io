
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Info, ChevronsRight, CheckCircle } from 'lucide-react';
import type { EnrichedClienteRepartoTask } from '@/app/dashboardrepartomobile/page';
import type { RepartoEstado } from '@/types/reparto';

interface MobileRepartoTaskCardProps {
  task: EnrichedClienteRepartoTask;
  onUpdateEstado: (repartoId: number, nuevoEstado: RepartoEstado) => void;
  onViewDetails: (task: EnrichedClienteRepartoTask) => void;
  actionButtonLabel?: string;
  targetStateForActionButton?: RepartoEstado;
  isCompleto?: boolean;
}

export function MobileRepartoTaskCard({
  task,
  onUpdateEstado,
  onViewDetails,
  actionButtonLabel,
  targetStateForActionButton,
  isCompleto = false,
}: MobileRepartoTaskCardProps) {
  
  const handleActionClick = () => {
    if (targetStateForActionButton) {
      onUpdateEstado(task.reparto_id, targetStateForActionButton);
    }
  };

  return (
    <div className="p-3 bg-card hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start mb-1.5">
        <h3 className="font-semibold text-md text-primary truncate pr-2">{task.nombre_reparto}</h3>
        {task.tarifa && (
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-sm">
                ${task.tarifa.toFixed(2)}
            </span>
        )}
      </div>

      <div className="space-y-1 text-sm text-muted-foreground">
        {task.rango_horario && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{task.rango_horario}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{task.direccion_reparto}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(task)} className="flex-1 text-xs px-2 py-1 h-auto">
          <Info className="mr-1.5 h-3.5 w-3.5" />
          Detalles
        </Button>
        {!isCompleto && actionButtonLabel && targetStateForActionButton && (
          <Button 
            size="sm" 
            onClick={handleActionClick} 
            className="flex-1 text-xs px-2 py-1 h-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {targetStateForActionButton === "Completo" ? 
              <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> :
              <ChevronsRight className="mr-1.5 h-3.5 w-3.5" />
            }
            {actionButtonLabel}
          </Button>
        )}
         {isCompleto && (
            <span className="text-xs text-green-600 font-medium flex items-center">
                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                Entregado
            </span>
        )}
      </div>
    </div>
  );
}

    