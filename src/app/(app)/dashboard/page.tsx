
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RepartosAsignadosCard } from "@/components/dashboard/repartos-asignados-card";
import { RepartosEnCursoCard } from "@/components/dashboard/repartos-en-curso-card";
import { supabase } from "@/lib/supabaseClient";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: 'Dashboard | Rumbo Envíos',
  description: 'Resumen de los repartos del día.',
};

interface RepartosCountsResult {
  asignados: number;
  enCurso: number;
  error?: string;
}

async function getRepartosCounts(): Promise<RepartosCountsResult> {
  const today = format(new Date(), 'yyyy-MM-dd');
  let errorMessages: string[] = [];

  if (!supabase) {
    console.error("Supabase client is not available.");
    return {
      asignados: 0,
      enCurso: 0,
      error: "Error de configuración: No se pudo conectar a la base de datos."
    };
  }

  let asignadosCountData = 0;
  let enCursoCountData = 0;

  try {
    const { count: asignadosCount, error: asignadosError } = await supabase
      .from('repartos')
      .select('*', { count: 'exact', head: true })
      .eq('fecha_reparto', today)
      .eq('estado', 'Asignado');

    if (asignadosError) {
      console.error("Error fetching asignados count:", asignadosError.message);
      errorMessages.push("Error al cargar repartos asignados.");
    } else {
      asignadosCountData = asignadosCount ?? 0;
    }

    const { count: enCursoCount, error: enCursoError } = await supabase
      .from('repartos')
      .select('*', { count: 'exact', head: true })
      .eq('fecha_reparto', today)
      .eq('estado', 'En Curso');

    if (enCursoError) {
      console.error("Error fetching en curso count:", enCursoError.message);
      errorMessages.push("Error al cargar repartos en curso.");
    } else {
      enCursoCountData = enCursoCount ?? 0;
    }
    
    if (errorMessages.length > 0) {
      return {
        asignados: asignadosCountData, // Return potentially partial or zeroed data
        enCurso: enCursoCountData,     // Return potentially partial or zeroed data
        error: errorMessages.join(' '),
      };
    }

    return {
      asignados: asignadosCountData,
      enCurso: enCursoCountData,
    };

  } catch (e) {
      console.error("General error in getRepartosCounts:", e);
      let message = "Ocurrió un error inesperado al cargar los datos del dashboard.";
      if (e instanceof Error) {
        // You might want to avoid exposing raw error messages to the client in production
        // For now, we'll use a generic one if it's not a specific message we've set
        if (!errorMessages.includes(e.message)) {
             message = "Error de conexión o consulta a la base de datos.";
        } else {
            message = e.message;
        }
      }
      errorMessages.push(message);
      return {
          asignados: 0,
          enCurso: 0,
          error: errorMessages.filter(Boolean).join(' ') || "Error desconocido.",
      };
  }
}

export default async function DashboardPage() {
  const data = await getRepartosCounts();
  const currentDate = format(new Date(), "PPP", { locale: es });

  if (data.error) {
    return (
      <div className="space-y-6">
        <DashboardHeader currentDate={currentDate} />
        <Card className="shadow-lg rounded-xl border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error al Cargar Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/10 p-4 rounded-md">
                <p className="text-sm text-destructive">{data.error}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Por favor, intente recargar la página. Si el problema persiste, contacte a soporte.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader currentDate={currentDate} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RepartosAsignadosCard count={data.asignados} />
        <RepartosEnCursoCard count={data.enCurso} />
        {/* Add more cards here as needed, e.g., RepartosCompletosCard */}
      </div>
    </div>
  );
}
