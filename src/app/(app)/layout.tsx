
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar"; // Ensure SidebarProvider is here

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Ensure SidebarProvider wraps AppSidebar if AppSidebar itself doesn't include it at its root
    // Based on current AppSidebar structure, it already includes SidebarProvider.
    // If error persists, wrapping here might be necessary, but usually provider is in the component itself.
    // <SidebarProvider defaultOpen> 
    <AppSidebar>{children}</AppSidebar>
    // </SidebarProvider>
  );
}
