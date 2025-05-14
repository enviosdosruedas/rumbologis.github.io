
"use client";

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Info as InfoIcon,DollarSign, FileText, X } from 'lucide-react';
import type { EnrichedClienteRepartoTask } from '@/app/dashboardrepartomobile/page';

interface MobileRepartoTaskDetailsDialogProps {
  task: EnrichedClienteRepartoTask | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileRepartoTaskDetailsDialog({ task, isOpen, onOpenChange }: MobileRepartoTaskDetailsDialogProps) {
  if (!task) return null;

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number | null }) => (
    value ? (
      <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-b-0">
        <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground">{String(value)}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-lg text-primary">{task.nombre_reparto}</DialogTitle>
          {task.cliente_principal_nombre && (
            <DialogDescription className="text-xs">
              Cliente Principal: {task.cliente_principal_nombre}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="p-4 space-y-1 max-h-[60vh] overflow-y-auto">
          <DetailItem icon={MapPin} label="Dirección de Entrega" value={task.direccion_reparto} />
          <DetailItem icon={Phone} label="Teléfono Contacto" value={task.telefono_reparto} />
          <DetailItem icon={Clock} label="Rango Horario" value={task.rango_horario} />
          <DetailItem icon={DollarSign} label="Tarifa" value={task.tarifa ? `$${task.tarifa.toFixed(2)}` : null} />
          <DetailItem icon={FileText} label="Observaciones del Reparto General" value={task.reparto_observaciones} />
        </div>

        <div className="p-4 border-t border-border">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full">
               <X className="mr-2 h-4 w-4" /> Cerrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

    