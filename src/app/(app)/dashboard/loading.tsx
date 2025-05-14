
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Truck, Hourglass, PieChart, Users, Building, TrendingUp } from "lucide-react";

export default function DashboardLoading() {
  const currentDate = format(new Date(), "PPP", { locale: es });
  return (
    <div className="space-y-8">
      {/* Skeleton for DashboardHeader - assuming it might fetch user data or have interactive elements */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-9 w-1/3" /> {/* Title */}
          <Skeleton className="h-9 w-32" /> {/* Logout Button */}
        </div>
        <div className="flex items-center justify-between text-sm">
          <Skeleton className="h-4 w-2/5" /> {/* User Info */}
          <Skeleton className="h-4 w-1/4" /> {/* Date */}
        </div>
      </div>

      {/* First row of cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Skeleton for RepartosAsignadosCard */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold"><Skeleton className="h-5 w-32" /></CardTitle>
            <Truck className="h-6 w-6 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-1/4 mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
        
        {/* Skeleton for RepartosEnCursoCard */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold"><Skeleton className="h-5 w-32" /></CardTitle>
            <Hourglass className="h-6 w-6 text-muted-foreground opacity-50" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-1/4 mb-2" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>

        {/* Skeleton for ResumenDeRepartosDelDiaSection */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold"><Skeleton className="h-6 w-40" /></CardTitle>
            <Skeleton className="h-3 w-full mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><Skeleton className="h-4 w-16 mx-auto mb-1" /><Skeleton className="h-8 w-10 mx-auto" /></div>
              <div><Skeleton className="h-4 w-16 mx-auto mb-1" /><Skeleton className="h-8 w-10 mx-auto" /></div>
              <div><Skeleton className="h-4 w-16 mx-auto mb-1" /><Skeleton className="h-8 w-10 mx-auto" /></div>
            </div>
            <Skeleton className="h-[150px] w-full" /> {/* Chart placeholder */}
            <Skeleton className="h-9 w-full" /> {/* Button placeholder */}
          </CardContent>
        </Card>
      </div>

      {/* Second row of cards/sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Skeleton for RepartidoresActivosSection */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold"><Skeleton className="h-6 w-36" /></CardTitle>
            <Skeleton className="h-3 w-full mt-1" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-3/4 mx-auto mt-2" />
          </CardContent>
        </Card>

        {/* Skeleton for ClientesPrincipalesSection */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold"><Skeleton className="h-6 w-40" /></CardTitle>
            <Skeleton className="h-3 w-full mt-1" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-12 w-full" />
             <Skeleton className="h-3 w-3/4 mx-auto mt-2" />
          </CardContent>
        </Card>
        
        {/* Skeleton for RendimientoRepartosSection */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
             <CardTitle className="text-lg font-semibold"><Skeleton className="h-6 w-44" /></CardTitle>
             <Skeleton className="h-3 w-full mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-32">
              <TrendingUp className="h-10 w-10 text-muted-foreground opacity-30 mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
