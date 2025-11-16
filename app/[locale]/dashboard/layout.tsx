import SideNav from "@/app/ui/dashboard/sidenav";
import DesktopHeader from "@/app/ui/dashboard/desktop-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-1 flex flex-col md:overflow-hidden">
        <DesktopHeader />
        <main className="flex-1 p-6 md:overflow-y-auto md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
