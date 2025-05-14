
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship, Users2, Truck, ClipboardList, Route, LayoutDashboard } from "lucide-react"; // Added Route for Repartos & LayoutDashboard
import { cn } from "@/lib/utils";
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
// Button import might not be directly used here anymore, but keeping for safety unless cleanup is requested.
// import { Button } from "@/components/ui/button"; 

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, // New item for Dashboard
  { href: "/clientes", label: "Clientes", icon: Users2 },
  { href: "/repartidores", label: "Repartidores", icon: Truck },
  { href: "/clientes-reparto", label: "Clientes Reparto", icon: ClipboardList },
  { href: "/repartos", label: "Repartos", icon: Route }, 
];

// Internal component to consume SidebarContext
function AppSidebarInternal({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

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
          <div className="hidden md:block">
             {/* <UserNav /> */}
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

