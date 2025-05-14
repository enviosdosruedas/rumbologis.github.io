
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Truck, Hourglass } from "lucide-react";

export default function DashboardLoading() {
  const currentDate = format(new Date(), "PPP", { locale: es });
  return (
    <div className="space-y-6">
      <DashboardHeader currentDate={currentDate} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Skeleton for RepartosAsignadosCard */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-primary">
              Repartos Asignados Hoy
            </CardTitle>
            <Truck className="h-6 w-6 text-primary opacity-50" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-1/4 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mt-1" />
          </CardContent>
        </Card>
        
        {/* Skeleton for RepartosEnCursoCard */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-accent">
              Repartos En Curso Hoy
            </CardTitle>
            <Hourglass className="h-6 w-6 text-accent opacity-50" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-1/4 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mt-1" />
          </CardContent>
        </Card>
        
        {/* Example for a third potential card */}
        <Card className="shadow-lg rounded-xl hidden lg:block">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <Skeleton className="h-5 w-3/5" />
             <Skeleton className="h-6 w-6 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-1/4 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mt-1" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
