import type { Locale } from "@/app/lib/i18n";
import { isLocale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";
import { I18nProvider } from "@/app/ui/i18n-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "MrToldo Cotizador",
    default: "MrToldo Cotizador",
  },
  description: "A dashboard to manage your quotes",
  metadataBase: new URL("https://mrtoldo-cotizador.vercel.app"),
};

export default async function LocaleLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const locale = isLocale(params.locale) ? params.locale : "es";
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
