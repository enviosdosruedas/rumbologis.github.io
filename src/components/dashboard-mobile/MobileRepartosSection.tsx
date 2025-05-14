
"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileRepartoTaskCard } from './MobileRepartoTaskCard';
import type { EnrichedClienteRepartoTask } from '@/app/dashboardrepartomobile/page';
import type { RepartoEstado } from '@/types/reparto';

interface MobileRepartosSectionProps {
  title: string;
  tasks: EnrichedClienteRepartoTask[];
  onUpdateEstado: (repartoId: number, nuevoEstado: RepartoEstado) => void;
  onViewDetails: (task: EnrichedClienteRepartoTask) => void;
  actionButtonLabel?: string;
  targetStateForActionButton?: RepartoEstado;
  emptyStateMessage?: string;
  isCompletoSection?: boolean;
}

export function MobileRepartosSection({
  title,
  tasks,
  onUpdateEstado,
  onViewDetails,
  actionButtonLabel,
  targetStateForActionButton,
  emptyStateMessage = "No hay repartos en esta sección.",
  isCompletoSection = false,
}: MobileRepartosSectionProps) {
  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-card-foreground/5 p-3">
        <CardTitle className="text-lg font-semibold text-card-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {tasks.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground text-center">{emptyStateMessage}</p>
        ) : (
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <MobileRepartoTaskCard
                key={`${task.reparto_id}-${task.cliente_reparto_id}`}
                task={task}
                onUpdateEstado={onUpdateEstado}
                onViewDetails={onViewDetails}
                actionButtonLabel={actionButtonLabel}
                targetStateForActionButton={targetStateForActionButton}
                isCompleto={isCompletoSection}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    