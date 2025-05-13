
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ship, Users2, Truck, ClipboardList, Route } from "lucide-react"; // Added Route for Repartos
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
  SheetHeader as ShadcnSheetHeader, // Renamed ShadcnSheetHeader
  SheetTitle as ShadcnSheetTitle    // Renamed ShadcnSheetTitle
} from "@/components/ui/sheet"; // Import from actual sheet component
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/clientes", label: "Clientes", icon: Users2 },
  { href: "/repartidores", label: "Repartidores", icon: Truck },
  { href: "/clientes-reparto", label: "Clientes Reparto", icon: ClipboardList },
  { href: "/repartos", label: "Repartos", icon: Route }, // New item for Repartos
];

// This component will render the SheetHeader and SheetTitle only on mobile
function MobileAccessibleSheetHeader() {
  const { isMobile } = useSidebar();

  if (!isMobile) {
    return null;
  }

  return (
    // Use ShadcnSheetHeader and ShadcnSheetTitle here
    <ShadcnSheetHeader className="p-0 border-0 h-auto"> 
      <ShadcnSheetTitle className="sr-only">Navegación Principal</ShadcnSheetTitle>
    </ShadcnSheetHeader>
  );
}

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        {/* The custom sidebar component itself might manage its own SheetHeader for mobile if it's part of its SheetContent */}
        {/* If the Sidebar component itself renders a Sheet on mobile, the SheetHeader should be inside that SheetContent. */}
        {/* For this example, we assume the Sidebar component's mobile view might need this. */}
        {/* It's better if the Sidebar component itself handles its mobile Sheet's title for accessibility. */}
        {/* Let's remove MobileAccessibleSheetHeader from here if Sidebar component handles it. */}
        {/* The custom sidebar component will handle its own title for mobile if it uses a Sheet */}
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
    </SidebarProvider>
  );
}
