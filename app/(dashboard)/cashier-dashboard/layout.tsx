import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/layout/cashier/DashboardHeader";
import { DashboardSidebar } from "@/layout/cashier/DashboardSidebar";
import LayoutClientWrapper from "./LayoutClientWrapper";
import { requireAuth } from "@/lib/requireAuth";
import { EROLES } from "@/types";

export default async function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth([EROLES.CASHIER]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-background p-4 lg:p-6">
            <LayoutClientWrapper>{children}</LayoutClientWrapper>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
