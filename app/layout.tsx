import "@/app/globals.css";
import { GlobalTransitionOverlay } from "@/app/ui/global-transition-overlay";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {children} <GlobalTransitionOverlay />
      </body>
    </html>
  );
}
