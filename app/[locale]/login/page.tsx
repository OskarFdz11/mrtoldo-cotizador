import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { Metadata } from "next";
import { getDictionary } from "@/app/lib/dictionaries";
import LanguageToggle from "@/app/ui/language-toggle";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({}: {}) {
  const headersList = await headers();
  const localeHeader = headersList.get("x-nextjs-locale");
  const locale = (localeHeader === "en" ? "en" : "es") as "es" | "en";
  const dict = await getDictionary(locale);

  const loginTranslations = {
    title: dict.auth?.loginTitle || "Por favor inicia sesión para continuar.",
    email: dict.auth?.email || "Correo electrónico",
    emailPlaceholder:
      dict.auth?.emailPlaceholder || "Ingresa tu correo electrónico",
    password: dict.auth?.password || "Contraseña",
    passwordPlaceholder:
      dict.auth?.passwordPlaceholder || "Ingresa tu contraseña",
    loginButton: dict.auth?.loginButton || "Iniciar sesión",
  };
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end justify-between rounded-lg bg-blue-500 p-3 md:h-36">
          <AcmeLogo />
          <LanguageToggle />
        </div>
        <Suspense>
          <LoginForm translations={loginTranslations} />
        </Suspense>
      </div>
    </main>
  );
}
