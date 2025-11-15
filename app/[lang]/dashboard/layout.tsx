import SideNav from "@/app/ui/dashboard/sidenav";
import { getDictionary } from "@/app/lib/dictionaries";
import DesktopHeader from "@/app/ui/dashboard/desktop-header";

// export const experimental_prr = true;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "es" | "en");
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav lang={lang} dict={dict} />
      </div>
      <div className="flex-1 flex flex-col md:overflow-hidden">
        <DesktopHeader lang={lang} dict={dict} />
        <main className="flex-1 p-6 md:overflow-y-auto md:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
