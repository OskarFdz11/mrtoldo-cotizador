import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import { GlobalTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: {
    template: "MrToldo Cotizador",
    default: "MrToldo Cotizador",
  },
  description: "A dashboard to manage your quotes",
  metadataBase: new URL("https://mrtoldo-cotizador.vercel.app"),
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <GlobalTransitionOverlay />
      </body>
    </html>
  );
}
