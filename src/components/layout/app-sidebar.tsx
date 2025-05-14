
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship, Users2, Truck, ClipboardList, Route, LayoutDashboard, Waypoints } from "lucide-react"; // Added Waypoints for Optimizar Ruta
import { cn } from "@/lib/utils";
import React from "react"; // Import React for useEffect, useState
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader as CustomSidebarHeader,
  SidebarContent as CustomSidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar, 
} from "@/components/ui/sidebar";
import { 
  SheetHeader as ShadcnSheetHeader, 
  SheetTitle as ShadcnSheetTitle    
} from "@/components/ui/sheet"; 
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users2 },
  { href: "/repartidores", label: "Repartidores", icon: Truck },
  { href: "/clientes-reparto", label: "Clientes Reparto", icon: ClipboardList },
  { href: "/repartos", label: "Repartos", icon: Route }, 
  { href: "/optimizar-ruta", label: "Optimizar Ruta", icon: Waypoints }, // New item for Optimizar Ruta
];

// Internal component to consume SidebarContext
function AppSidebarInternal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a simplified skeleton or null to match server render and avoid hydration issues
    // This skeleton should be very basic and not depend on `isMobile` itself.
    return (
        <div className="flex min-h-svh w-full">
            {/* Simplified Skeleton for Sidebar area */}
            <div className="hidden md:flex flex-col w-64 bg-sidebar p-4 border-r"> {/* Corresponds to expanded desktop sidebar width */}
                <div className="flex items-center gap-2 mb-6">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <Skeleton className="h-6 w-32 rounded-md" />
                </div>
                <div className="space-y-2">
                    {[...Array(navItems.length)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-md" />
                    ))}
                </div>
            </div>
             {/* Mobile skeleton part is implicitly handled by Sheet not rendering initially if we return null for mobile part */}
            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background md:justify-end">
                    <div className="md:hidden"><Skeleton className="h-7 w-7 rounded-md" /></div>
                </header>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
  }

  return (
    <>
      <Sidebar collapsible="icon">
         {isMobile && (
          <ShadcnSheetHeader className="p-0 border-0 h-auto">
            <ShadcnSheetTitle className="sr-only">Navegación Principal</ShadcnSheetTitle>
          </ShadcnSheetHeader>
        )}
        <CustomSidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Ship className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
              Rumbo Envíos
            </h1>
          </Link>
        </CustomSidebarHeader>
        <CustomSidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </CustomSidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background md:justify-end">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
         {children}
        </main>
      </SidebarInset>
    </>
  );
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebarInternal>{children}</AppSidebarInternal>
    </SidebarProvider>
  );
}

