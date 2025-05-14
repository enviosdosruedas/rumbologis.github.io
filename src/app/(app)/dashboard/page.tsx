
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RepartosAsignadosCard } from "@/components/dashboard/repartos-asignados-card";
import { RepartosEnCursoCard } from "@/components/dashboard/repartos-en-curso-card";
import { supabase } from "@/lib/supabaseClient";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Rumbo Envíos',
  description: 'Resumen de los repartos del día.',
};

async function getRepartosCounts() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { count: asignadosCount, error: asignadosError } = await supabase
    .from('repartos')
    .select('*', { count: 'exact', head: true })
    .eq('fecha_reparto', today)
    .eq('estado', 'Asignado');

  const { count: enCursoCount, error: enCursoError } = await supabase
    .from('repartos')
    .select('*', { count: 'exact', head: true })
    .eq('fecha_reparto', today)
    .eq('estado', 'En Curso');

  if (asignadosError) {
    console.error("Error fetching asignados count:", asignadosError.message);
    // In a real app, you might throw the error or return an error object
  }
  if (enCursoError) {
    console.error("Error fetching en curso count:", enCursoError.message);
     // In a real app, you might throw the error or return an error object
  }

  return {
    asignados: asignadosCount ?? 0,
    enCurso: enCursoCount ?? 0,
  };
}

export default async function DashboardPage() {
  const counts = await getRepartosCounts();
  const currentDate = format(new Date(), "PPP", { locale: es });

  return (
    <div className="space-y-6">
      <DashboardHeader currentDate={currentDate} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RepartosAsignadosCard count={counts.asignados} />
        <RepartosEnCursoCard count={counts.enCurso} />
        {/* Add more cards here as needed, e.g., RepartosCompletosCard */}
      </div>
    </div>
  );
}
