
"use client";

import type React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Ship, UserCog, User } from 'lucide-react';

interface UserDataCookie {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string;
}

export default function TestLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleTestLogin = (role: 'admin' | 'repartidor1') => {
    let userData: UserDataCookie;
    let redirectPath: string;

    if (role === 'admin') {
      userData = {
        nombre: 'admin',
        rol: 'admin',
        codigo: 1, 
      };
      redirectPath = '/dashboard';
    } else { // repartidor1
      userData = {
        nombre: 'repartidor1',
        rol: 'repartidor',
        codigo: 2, 
        repartidor_id: '37804e1f-8047-49f2-bb2e-7c91a7c32b92', 
      };
      redirectPath = '/dashboardrepartomobile';
    }

    document.cookie = `userData=${JSON.stringify(userData)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    console.log('TestLogin page: userData cookie set. Value:', JSON.stringify(userData));


    toast({
      title: 'Inicio de Sesión de Prueba Exitoso',
      description: `Ingresando como ${userData.nombre}. Redirigiendo...`,
      variant: 'default',
      className: "bg-accent text-accent-foreground"
    });

    router.push(redirectPath);
    router.refresh(); 
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Ship className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Página de Pruebas de Login</CardTitle>
          <CardDescription>Seleccione un rol para ingresar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleTestLogin('admin')}
            className="w-full text-lg py-3"
            variant="outline"
          >
            <UserCog className="mr-2 h-5 w-5" />
            Ingresar como Admin (admin/1234)
          </Button>
          <Button
            onClick={() => handleTestLogin('repartidor1')}
            className="w-full text-lg py-3"
            variant="outline"
          >
            <User className="mr-2 h-5 w-5" />
            Ingresar como Repartidor 1 (repartidor1/1234)
          </Button>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          <p>Esta página es solo para fines de prueba y simula un inicio de sesión.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
