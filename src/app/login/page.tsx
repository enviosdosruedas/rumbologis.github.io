
"use client";

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Ship } from 'lucide-react';
import type { Database } from '@/types/supabase';

type Usuario = Database['public']['Tables']['usuarios']['Row'];

interface UserDataCookie {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string; // UUID of the repartidor, if applicable
}

export default function LoginPage() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!supabase) {
      toast({
        title: "Error de Configuración",
        description: "El cliente de Supabase no está disponible.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Fetch the user, including the repartidor_id
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*, repartidor_id') // Ensure repartidor_id is selected
      .eq('nombre', nombre)
      .eq('pass', password) 
      .single();

    setIsLoading(false);

    if (error || !user) {
      toast({
        title: 'Error de Inicio de Sesión',
        description: 'Nombre de usuario o contraseña incorrectos.',
        variant: 'destructive',
      });
    } else {
      const cookieData: UserDataCookie = {
        nombre: user.nombre,
        rol: user.rol,
        codigo: user.codigo,
      };

      if (user.rol === 'repartidor' && user.repartidor_id) {
        cookieData.repartidor_id = user.repartidor_id;
      }
      
      document.cookie = `userData=${JSON.stringify(cookieData)}; path=/; max-age=${60 * 60 * 24 * 7}`; // Cookie for 7 days

      toast({
        title: 'Inicio de Sesión Exitoso',
        description: 'Redirigiendo...',
        variant: 'default',
        className: "bg-accent text-accent-foreground"
      });

      if (user.rol === 'admin') {
        router.push('/dashboard'); 
      } else if (user.rol === 'repartidor') {
        router.push('/dashboardrepartomobile');
      } else {
        router.push('/'); 
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Ship className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Rumbo Envíos</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de Usuario</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="su_usuario"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rumbo Envíos. Todos los derechos reservados.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
