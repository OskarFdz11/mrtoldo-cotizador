import SideNav from "@/app/ui/dashboard/sidenav";
import DesktopHeader from "@/app/ui/dashboard/desktop-header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) {
    redirect(`/${locale}/login`);
  }
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
