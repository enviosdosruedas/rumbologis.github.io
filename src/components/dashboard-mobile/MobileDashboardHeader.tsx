
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, CalendarDays } from 'lucide-react';

interface MobileDashboardHeaderProps {
  repartidorNombre: string;
  currentDate: string;
  onLogout: () => void;
}

export function MobileDashboardHeader({ repartidorNombre, currentDate, onLogout }: MobileDashboardHeaderProps) {
  
  const handleLogoutClick = () => {
    // The actual cookie clearing logic is expected to be in the onLogout prop passed from the page
    // For example, the page's onLogout would do:
    // document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    // router.push('/login');
    // router.refresh();
    onLogout(); 
  }

  return (
    <header className="sticky top-0 z-20 flex flex-col p-4 border-b bg-card shadow-md">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <UserCircle className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold text-foreground truncate">
            {repartidorNombre}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogoutClick} className="text-destructive hover:bg-destructive/10">
          <LogOut className="mr-1.5 h-4 w-4" />
          Salir
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>{currentDate}</span>
      </div>
    </header>
  );
}
