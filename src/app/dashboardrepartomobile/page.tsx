
"use client";

import type React from 'react';
import { useEffect, useState }
from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, UserCircle, Truck } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function DashboardRepartoMobilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/login'); // Should be handled by middleware, but good failsafe
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
  
  if (!user) {
     // This case should ideally be handled by middleware redirecting to /login
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
                  {user?.email || 'Repartidor'} 
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aquí podrás ver tus repartos asignados y gestionar tus entregas.
            </p>
            {/* Further dashboard content will go here */}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Mis Repartos de Hoy</CardTitle>
            <CardDescription>Lista de entregas programadas para hoy.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for delivery list */}
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
