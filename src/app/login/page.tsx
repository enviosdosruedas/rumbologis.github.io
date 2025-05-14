
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

export default function LoginPage() {
  const [email, setEmail] = useState(''); // Using 'email' as Supabase uses it, but UI can say "Usuario"
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email, // Map form's "usuario" field to Supabase's "email"
      password: password,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: 'Error de Inicio de Sesión',
        description: error.message || 'Usuario o contraseña incorrectos.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Inicio de Sesión Exitoso',
        description: 'Redirigiendo...',
        variant: 'default',
        className: "bg-accent text-accent-foreground"
      });
      // Check user role after login if needed, then redirect accordingly
      // For now, redirecting all successful logins to dashboardrepartomobile
      router.push('/dashboardrepartomobile'); 
      router.refresh(); // Ensure page reloads to reflect auth state
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
              <Label htmlFor="email">Usuario</Label>
              <Input
                id="email"
                type="text" // Changed to text if 'usuario' is not an email format
                placeholder="su_usuario" // Or "usuario@ejemplo.com" if it must be email
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
