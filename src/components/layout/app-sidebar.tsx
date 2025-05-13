
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship, Users2, Truck, ClipboardList } from "lucide-react"; // Added ClipboardList
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader as CustomSidebarHeader, // Renamed to avoid conflict with ShadcnSheetHeader
  SidebarContent as CustomSidebarContent, // Renamed to avoid conflict
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar, // Import useSidebar
} from "@/components/ui/sidebar";
import { 
  SheetHeader as ShadcnSheetHeader,
  SheetTitle as ShadcnSheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/clientes", label: "Clientes", icon: Users2 },
  { href: "/repartidores", label: "Repartidores", icon: Truck },
  { href: "/clientes-reparto", label: "Clientes Reparto", icon: ClipboardList }, // New item
];

// This component will render the SheetHeader and SheetTitle only on mobile
function MobileAccessibleSheetHeader() {
  const { isMobile } = useSidebar();

  if (!isMobile) {
    return null;
  }

  return (
    <ShadcnSheetHeader className="h-0 p-0 overflow-hidden">
      <ShadcnSheetTitle className="sr-only">Navegación Principal</ShadcnSheetTitle>
    </ShadcnSheetHeader>
  );
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <MobileAccessibleSheetHeader /> {/* Use the conditional component */}
        <CustomSidebarHeader className="p-4">
          <Link href="/clientes" className="flex items-center gap-2">
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
                  isActive={pathname.startsWith(item.href)}
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
          {/* Mobile sidebar trigger, only visible on md and below where sidebar might be offcanvas */}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          {/* Placeholder for potential user menu or actions */}
          <div className="hidden md:block">
             {/* <UserNav /> */}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
         {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

