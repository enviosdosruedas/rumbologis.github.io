
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RepartosAsignadosCard } from "@/components/dashboard/repartos-asignados-card";
import { RepartosEnCursoCard } from "@/components/dashboard/repartos-en-curso-card";
import { ResumenDeRepartosDelDiaSection } from "@/components/dashboard/resumen-repartos-dia-section";
import { RepartidoresActivosSection } from "@/components/dashboard/repartidores-activos-section";
import { ClientesPrincipalesSection } from "@/components/dashboard/clientes-principales-section";
import { RendimientoRepartosSection } from "@/components/dashboard/rendimiento-repartos-section";

import { createSupabaseServerClient } from '@/lib/supabase/server'; // Use server client
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cookies } from 'next/headers'; 

export const metadata: Metadata = {
  title: 'Dashboard | Rumbo Envíos',
  description: 'Resumen de la operativa diaria de Rumbo Envíos.',
};

interface UserData {
  nombre: string;
  rol: string;
}

interface DashboardData {
  repartosAsignados: number;
  repartosEnCurso: number;
  repartosCompletados: number;
  totalRepartidores: number;
  repartidoresActivos: number;
  totalClientes: number;
  error?: string;
  userData?: UserData;
}

async function getDashboardData(): Promise<DashboardData> {
  const supabase = createSupabaseServerClient(); // Initialize server client
  const today = format(new Date(), 'yyyy-MM-dd');
  let errorMessages: string[] = [];

  // Initialize counts to 0
  let repartosAsignadosCount = 0;
  let repartosEnCursoCount = 0;
  let repartosCompletadosCount = 0;
  let totalRepartidoresCount = 0;
  let repartidoresActivosCount = 0;
  let totalClientesCount = 0;
  let parsedUserData: UserData | undefined;

  try {
    // User data from cookie
    const cookieStore = cookies();
    const userDataCookie = cookieStore.get('userData');
    if (userDataCookie?.value) {
      try {
        parsedUserData = JSON.parse(userDataCookie.value);
      } catch (e) {
        console.error("Failed to parse user data from cookie on dashboard page:", e);
        errorMessages.push("Error al leer datos de sesión.");
      }
    } else {
        errorMessages.push("Sesión no encontrada. Por favor, inicie sesión.");
    }

    // Repartos counts
    const { count: asignadosCount, error: asignadosError } = await supabase
      .from('repartos')
      .select('*', { count: 'exact', head: true })
      .eq('fecha_reparto', today)
      .eq('estado', 'Asignado');
    if (asignadosError) {
        console.error("Error fetching repartos asignados:", asignadosError);
        errorMessages.push(`Error al cargar repartos asignados: ${asignadosError.message}`);
    } else repartosAsignadosCount = asignadosCount ?? 0;

    const { count: enCursoCount, error: enCursoError } = await supabase
      .from('repartos')
      .select('*', { count: 'exact', head: true })
      .eq('fecha_reparto', today)
      .eq('estado', 'En Curso');
    if (enCursoError) {
        console.error("Error fetching repartos en curso:", enCursoError);
        errorMessages.push(`Error al cargar repartos en curso: ${enCursoError.message}`);
    } else repartosEnCursoCount = enCursoCount ?? 0;

    const { count: completadosCount, error: completadosError } = await supabase
      .from('repartos')
      .select('*', { count: 'exact', head: true })
      .eq('fecha_reparto', today)
      .eq('estado', 'Completo');
    if (completadosError) {
        console.error("Error fetching repartos completados:", completadosError);
        errorMessages.push(`Error al cargar repartos completados: ${completadosError.message}`);
    } else repartosCompletadosCount = completadosCount ?? 0;

    // Repartidores counts
    const { count: repartidoresTotal, error: repartidoresTotalError } = await supabase
      .from('repartidores')
      .select('*', { count: 'exact', head: true });
    if (repartidoresTotalError) {
        console.error("Error fetching total repartidores:", repartidoresTotalError);
        errorMessages.push(`Error al cargar total de repartidores: ${repartidoresTotalError.message}`);
    } else totalRepartidoresCount = repartidoresTotal ?? 0;

    const { data: enCursoRepartosData, error: enCursoRepartosError } = await supabase
      .from('repartos')
      .select('repartidor_id')
      .eq('fecha_reparto', today)
      .eq('estado', 'En Curso');
    if (enCursoRepartosError) {
        console.error("Error fetching active repartidores data:", enCursoRepartosError);
        errorMessages.push(`Error al cargar repartidores activos: ${enCursoRepartosError.message}`);
    } else if (enCursoRepartosData) {
      const activeIds = new Set(enCursoRepartosData.map(r => r.repartidor_id));
      repartidoresActivosCount = activeIds.size;
    }
    
    // Clientes count
    const { count: clientesTotal, error: clientesTotalError } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true });
    if (clientesTotalError) {
        console.error("Error fetching total clientes:", clientesTotalError);
        errorMessages.push(`Error al cargar total de clientes: ${clientesTotalError.message}`);
    } else totalClientesCount = clientesTotal ?? 0;


    if (errorMessages.length > 0) {
      return {
        repartosAsignados: repartosAsignadosCount,
        repartosEnCurso: repartosEnCursoCount,
        repartosCompletados: repartosCompletadosCount,
        totalRepartidores: totalRepartidoresCount,
        repartidoresActivos: repartidoresActivosCount,
        totalClientes: totalClientesCount,
        error: errorMessages.join(' '),
        userData: parsedUserData,
      };
    }

    return {
      repartosAsignados: repartosAsignadosCount,
      repartosEnCurso: repartosEnCursoCount,
      repartosCompletados: repartosCompletadosCount,
      totalRepartidores: totalRepartidoresCount,
      repartidoresActivos: repartidoresActivosCount,
      totalClientes: totalClientesCount,
      userData: parsedUserData,
    };

  } catch (e: unknown) {
      let errorMessage = "Ocurrió un error inesperado al cargar los datos del dashboard.";
      if (e instanceof Error) {
        errorMessage = `Error en getDashboardData: ${e.message}. Stack: ${e.stack}`;
      } else if (typeof e === 'string') {
        errorMessage = `Error en getDashboardData: ${e}`;
      }
      console.error(errorMessage);
      errorMessages.push(errorMessage);
      return {
          repartosAsignados: 0,
          repartosEnCurso: 0,
          repartosCompletados: 0,
          totalRepartidores: 0,
          repartidoresActivos: 0,
          totalClientes: 0,
          error: errorMessages.filter(Boolean).join(' ') || "Error desconocido.",
          userData: parsedUserData, // userData might have been parsed before the error
      };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const currentDate = format(new Date(), "PPP", { locale: es });

  if (data.error && !data.userData) { 
    return (
      <div className="space-y-6 p-4">
        <DashboardHeader 
            userName="Usuario" 
            userRole="Desconocido" 
            currentDate={currentDate} 
        />
        <Card className="shadow-lg rounded-xl border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Crítico al Cargar Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/10 p-4 rounded-md">
                <p className="text-sm text-destructive">{data.error}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Por favor, intente recargar la página o inicie sesión nuevamente. Si el problema persiste, contacte a soporte.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  if (data.error && data.userData) {
     console.warn("Partial data error on dashboard:", data.error);
  }


  return (
    <div className="space-y-8">
      <DashboardHeader 
        userName={data.userData?.nombre || "Usuario"} 
        userRole={data.userData?.rol || "Desconocido"} 
        currentDate={currentDate} 
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RepartosAsignadosCard count={data.repartosAsignados} />
        <RepartosEnCursoCard count={data.repartosEnCurso} />
        <ResumenDeRepartosDelDiaSection
            asignados={data.repartosAsignados}
            enCurso={data.repartosEnCurso}
            completados={data.repartosCompletados}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RepartidoresActivosSection 
            totalRepartidores={data.totalRepartidores} 
            repartidoresActivos={data.repartidoresActivos} 
        />
        <ClientesPrincipalesSection totalClientes={data.totalClientes} />
        <RendimientoRepartosSection /> 
      </div>
       {data.error && (
        <Card className="mt-6 shadow-lg rounded-xl border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive/80 text-sm">Aviso de Carga de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-destructive/70">{data.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

