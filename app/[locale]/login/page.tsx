import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { Metadata } from "next";
import { getDictionary } from "@/app/lib/dictionaries";
import LanguageToggle from "@/app/ui/language-toggle";
import { Locale } from "@/app/lib/i18n";
import MrToldoLogo from "@/app/ui/mrtoldo-logo";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale ?? "es");

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end justify-between rounded-lg bg-blue-500 p-3 md:h-36">
          <MrToldoLogo />
          <LanguageToggle variant="login" />
        </div>
        <Suspense>
          <LoginForm dict={dict} />
        </Suspense>
      </div>
    </main>
  );
}
