
"use client"; 

import type React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  userName: string;
  userRole: string;
  currentDate: string;
}

function LogoutButton() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    console.log('LogoutButton: userData cookie cleared.');
    
    toast({
      title: 'Sesión Cerrada',
      description: 'Has cerrado sesión exitosamente.',
    });
    
    router.push('/login');
    router.refresh(); 
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Cerrar Sesión
    </Button>
  );
}

export function DashboardHeader({ userName, userRole, currentDate }: DashboardHeaderProps) {
  return (
    <div className="mb-6 pb-4 border-b">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Usuario: <span className="font-medium text-foreground">{userName} ({userRole})</span></p>
        <p>Fecha: {currentDate}</p>
      </div>
    </div>
  );
}
