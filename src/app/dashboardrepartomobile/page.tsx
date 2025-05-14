
"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, UserCircle, Truck } from 'lucide-react';

interface UserData {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string; // Optional: UUID of the repartidor profile
}

// Helper function to get cookie (can be moved to a utils file)
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default function DashboardRepartoMobilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookieData = getCookie('userData');
    if (cookieData) {
      try {
        const parsedData: UserData = JSON.parse(cookieData);
        setUserData(parsedData);
      } catch (e) {
        console.error("Failed to parse user data from cookie", e);
        router.push('/login'); 
      }
    } else {
      router.push('/login'); 
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
    router.refresh(); 
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-foreground">Cargando...</p>
      </div>
    );
  }
  
  if (!userData) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-destructive">No autenticado. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-card shadow-sm">
        <div className="flex items-center gap-2">
          <Truck className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Panel Repartidor</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </header>

      <main className="flex-1 p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserCircle className="h-10 w-10 text-muted-foreground" />
              <div>
                <CardTitle className="text-2xl">¡Bienvenido!</CardTitle>
                <CardDescription className="text-sm">
                  {userData.nombre || 'Repartidor'} (Rol: {userData.rol})
                  {userData.repartidor_id && <span className="block text-xs">ID Repartidor: {userData.repartidor_id.substring(0,8)}...</span>}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aquí podrás ver tus repartos asignados y gestionar tus entregas.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Mis Repartos de Hoy</CardTitle>
            <CardDescription>Lista de entregas programadas para hoy.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 border-2 border-dashed border-border rounded-md">
              <p className="text-muted-foreground">No hay repartos asignados para hoy.</p>
              <p className="text-xs text-muted-foreground mt-1">(Funcionalidad en desarrollo)</p>
            </div>
          </CardContent>
        </Card>

      </main>
       <footer className="p-4 border-t bg-card text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Rumbo Envíos. Panel Repartidor.
      </footer>
    </div>
  );
}
