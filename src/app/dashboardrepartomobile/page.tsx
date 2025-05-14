
"use client";

import type React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/lib/supabaseClient";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MapPinIcon } from 'lucide-react';

import { MobileDashboardHeader } from '@/components/dashboard-mobile/MobileDashboardHeader';
import { MobileRepartosSection } from '@/components/dashboard-mobile/MobileRepartosSection';
import { MobileRepartoTaskDetailsDialog } from '@/components/dashboard-mobile/MobileRepartoTaskDetailsDialog';
import { MobileRepartoEnCursoMap } from '@/components/dashboard-mobile/MobileRepartoEnCursoMap'; 

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
  if (typeof document === 'undefined') return null; // Guard for SSR or non-browser environments
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const MOCK_REPARTIDOR_LOCATION = { lat: -38.0023, lng: -57.5575 }; 

export default function DashboardRepartoMobilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<EnrichedClienteRepartoTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<EnrichedClienteRepartoTask | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [repartidorCurrentLocation, setRepartidorCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    setRepartidorCurrentLocation(MOCK_REPARTIDOR_LOCATION);
    setCurrentDate(format(new Date(), "PPP", { locale: es }));

    const cookieData = getCookie('userData');
    if (cookieData) {
      try {
        const parsedData: UserData = JSON.parse(cookieData);
        console.log("DashboardRepartoMobile: Parsed userData from cookie:", parsedData);
        setUserData(parsedData);
        if (parsedData.rol !== 'repartidor' || !parsedData.repartidor_id) {
          toast({ title: "Acceso Denegado", description: "No tiene permisos para acceder a esta página o falta ID de repartidor.", variant: "destructive" });
          router.push('/login');
        }
      } catch (e) {
        console.error("DashboardRepartoMobile: Failed to parse user data from cookie", e);
        toast({ title: "Error de Sesión", description: "No se pudo verificar su sesión. Por favor, inicie sesión de nuevo.", variant: "destructive" });
        router.push('/login');
      }
    } else {
      console.log("DashboardRepartoMobile: No userData cookie found. Redirecting to login.");
      router.push('/login');
    }
  }, [router, toast]);

  const fetchRepartoTasks = useCallback(async () => {
    if (!userData?.repartidor_id) {
      console.log("DashboardRepartoMobile: fetchRepartoTasks called without repartidor_id. UserData:", userData);
      return;
    }
    setIsLoading(true);
    console.log(`DashboardRepartoMobile: Fetching tasks for repartidor_id: ${userData.repartidor_id}`);

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
      .eq('fecha_reparto', today)
      .order('id', { referencedTable: 'reparto_cliente_reparto.clientes_reparto', ascending: true }); 

    if (error) {
      toast({ title: "Error al cargar repartos", description: error.message, variant: "destructive" });
      setTasks([]);
    } else {
      const enrichedTasks: EnrichedClienteRepartoTask[] = data.flatMap(reparto =>
        (reparto.reparto_cliente_reparto || []).map((rcr: any) => ({
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
      console.log("DashboardRepartoMobile: Tasks fetched:", enrichedTasks);
    }
    setIsLoading(false);
  }, [userData, toast]); // Added userData to dependency array

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
      fetchRepartoTasks(); 
    }
    setIsLoading(false);
  };

  const handleViewDetails = (task: EnrichedClienteRepartoTask) => {
    setSelectedTask(task);
    setIsDetailsDialogOpen(true);
  };

  const handleNavigate = (task: EnrichedClienteRepartoTask) => {
    if (task.direccion_reparto) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(task.direccion_reparto)}`;
      window.open(mapsUrl, '_blank');
    } else {
      toast({ title: "Error", description: "No hay dirección para navegar.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    console.log('DashboardRepartoMobile: userData cookie cleared.');
    router.push('/login');
    router.refresh();
  };

  if (!userData || userData.rol !== 'repartidor') { // Stricter check during initial render phase
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  const asignadosTasks = tasks.filter(task => task.reparto_estado === 'Asignado');
  const enCursoTasks = tasks.filter(task => task.reparto_estado === 'En Curso');
  const completadosTasks = tasks.filter(task => task.reparto_estado === 'Completo');
  
  const nextEnCursoTask = enCursoTasks.length > 0 ? enCursoTasks[0] : null;

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
          title="En Ruta"
          tasks={enCursoTasks}
          onUpdateEstado={handleUpdateEstado}
          onViewDetails={handleViewDetails}
          onNavigate={handleNavigate} 
          actionButtonLabel="Marcar Completo"
          targetStateForActionButton="Completo"
          emptyStateMessage="No hay repartos en curso."
          mapComponent={
            nextEnCursoTask ? (
              <MobileRepartoEnCursoMap 
                nextTask={nextEnCursoTask} 
                repartidorLocation={repartidorCurrentLocation}
                apiKey={googleMapsApiKey}
              />
            ) : (
              <div className="p-4 my-4 text-center text-sm text-muted-foreground bg-card rounded-lg shadow-md">
                Seleccione un reparto en curso para ver el mapa.
              </div>
            )
          }
        />

        <MobileRepartosSection
          title="Asignados para Hoy"
          tasks={asignadosTasks}
          onUpdateEstado={handleUpdateEstado}
          onViewDetails={handleViewDetails}
          onNavigate={handleNavigate}
          actionButtonLabel="Iniciar Ruta"
          targetStateForActionButton="En Curso"
          emptyStateMessage="No hay repartos asignados."
        />
       
        <MobileRepartosSection
          title="Completados Hoy"
          tasks={completadosTasks}
          onUpdateEstado={handleUpdateEstado} 
          onViewDetails={handleViewDetails}
          emptyStateMessage="No hay repartos completados."
          isCompletoSection 
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
