
"use client";

import type React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/lib/supabaseClient";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { MobileDashboardHeader } from '@/components/dashboard-mobile/MobileDashboardHeader';
import { MobileRepartosSection } from '@/components/dashboard-mobile/MobileRepartosSection';
import { MobileRepartoTaskDetailsDialog } from '@/components/dashboard-mobile/MobileRepartoTaskDetailsDialog';

import type { RepartoEstado } from '@/types/reparto';

interface UserData {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string;
}

export interface EnrichedClienteRepartoTask {
  reparto_id: number;
  reparto_estado: RepartoEstado;
  reparto_observaciones?: string | null;
  cliente_reparto_id: number;
  nombre_reparto: string;
  direccion_reparto: string | null;
  telefono_reparto?: string | null;
  rango_horario?: string | null;
  tarifa?: number | null;
  cliente_principal_nombre?: string;
  fecha_reparto: string;
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default function DashboardRepartoMobilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<EnrichedClienteRepartoTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<EnrichedClienteRepartoTask | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(format(new Date(), "PPP", { locale: es }));
    const cookieData = getCookie('userData');
    if (cookieData) {
      try {
        const parsedData: UserData = JSON.parse(cookieData);
        setUserData(parsedData);
        if (!parsedData.repartidor_id) {
          toast({ title: "Error", description: "ID de repartidor no encontrado.", variant: "destructive" });
          router.push('/login');
        }
      } catch (e) {
        console.error("Failed to parse user data from cookie", e);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router, toast]);

  const fetchRepartoTasks = useCallback(async () => {
    if (!userData?.repartidor_id) return;
    setIsLoading(true);

    const today = format(new Date(), 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('repartos')
      .select(`
        id,
        fecha_reparto,
        estado,
        observaciones,
        clientes ( nombre ),
        reparto_cliente_reparto (
          clientes_reparto (
            id,
            nombre_reparto,
            direccion_reparto,
            telefono_reparto,
            rango_horario,
            tarifa
          )
        )
      `)
      .eq('repartidor_id', userData.repartidor_id)
      .eq('fecha_reparto', today);

    if (error) {
      toast({ title: "Error al cargar repartos", description: error.message, variant: "destructive" });
      setTasks([]);
    } else {
      const enrichedTasks: EnrichedClienteRepartoTask[] = data.flatMap(reparto =>
        (reparto.reparto_cliente_reparto || []).map((rcr: any) => ({ // Use any for rcr due to Supabase dynamic typing
          reparto_id: reparto.id,
          reparto_estado: reparto.estado as RepartoEstado,
          reparto_observaciones: reparto.observaciones,
          cliente_reparto_id: rcr.clientes_reparto.id,
          nombre_reparto: rcr.clientes_reparto.nombre_reparto,
          direccion_reparto: rcr.clientes_reparto.direccion_reparto,
          telefono_reparto: rcr.clientes_reparto.telefono_reparto,
          rango_horario: rcr.clientes_reparto.rango_horario,
          tarifa: rcr.clientes_reparto.tarifa,
          cliente_principal_nombre: reparto.clientes?.nombre,
          fecha_reparto: reparto.fecha_reparto,
        }))
      );
      setTasks(enrichedTasks);
    }
    setIsLoading(false);
  }, [userData?.repartidor_id, toast]);

  useEffect(() => {
    if (userData?.repartidor_id) {
      fetchRepartoTasks();
    }
  }, [userData, fetchRepartoTasks]);


  const handleUpdateEstado = async (repartoId: number, nuevoEstado: RepartoEstado) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('repartos')
      .update({ estado: nuevoEstado })
      .eq('id', repartoId);

    if (error) {
      toast({ title: "Error actualizando estado", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Estado Actualizado", description: `Reparto marcado como ${nuevoEstado}.`, className: "bg-accent text-accent-foreground"});
      fetchRepartoTasks(); // Re-fetch to update lists
    }
    setIsLoading(false);
  };

  const handleViewDetails = (task: EnrichedClienteRepartoTask) => {
    setSelectedTask(task);
    setIsDetailsDialogOpen(true);
  };

  const handleLogout = () => {
    document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
    router.refresh();
  };

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando sesión...</p>
      </div>
    );
  }

  const asignadosTasks = tasks.filter(task => task.reparto_estado === 'Asignado');
  const enCursoTasks = tasks.filter(task => task.reparto_estado === 'En Curso');
  const completadosTasks = tasks.filter(task => task.reparto_estado === 'Completo');

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <MobileDashboardHeader 
        repartidorNombre={userData.nombre}
        currentDate={currentDate}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        {isLoading && tasks.length === 0 && <p className="text-center text-muted-foreground">Cargando repartos...</p>}
        
        {!isLoading && tasks.length === 0 && (
           <div className="text-center py-10">
             <p className="text-lg text-muted-foreground">No tienes repartos para hoy.</p>
           </div>
        )}

        <MobileRepartosSection
          title="Asignados para Hoy"
          tasks={asignadosTasks}
          onUpdateEstado={handleUpdateEstado}
          onViewDetails={handleViewDetails}
          actionButtonLabel="Iniciar Ruta"
          targetStateForActionButton="En Curso"
          emptyStateMessage="No hay repartos asignados."
        />
        <MobileRepartosSection
          title="En Ruta"
          tasks={enCursoTasks}
          onUpdateEstado={handleUpdateEstado}
          onViewDetails={handleViewDetails}
          actionButtonLabel="Marcar Completo"
          targetStateForActionButton="Completo"
          emptyStateMessage="No hay repartos en curso."
        />
        <MobileRepartosSection
          title="Completados Hoy"
          tasks={completadosTasks}
          onUpdateEstado={handleUpdateEstado} // Potentially to revert state, or just view details
          onViewDetails={handleViewDetails}
          emptyStateMessage="No hay repartos completados."
          isCompletoSection // To disable action button or change its behavior
        />
      </main>
      
      {selectedTask && (
        <MobileRepartoTaskDetailsDialog
          task={selectedTask}
          isOpen={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        />
      )}
       <footer className="p-3 border-t bg-card text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rumbo Envíos. Panel Repartidor.
      </footer>
    </div>
  );
}

    