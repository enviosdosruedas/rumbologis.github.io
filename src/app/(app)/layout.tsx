
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar"; // Ensure SidebarProvider is here

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // AppSidebar already includes SidebarProvider internally.
    // If a user is not authenticated, the middleware should redirect them before this layout is rendered for protected routes.
    <AppSidebar>{children}</AppSidebar>
  );
}
