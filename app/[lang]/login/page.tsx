import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";
import { Metadata } from "next";
import { getDictionary } from "@/app/lib/dictionaries";
import LanguageToggle from "@/app/ui/language-toggle";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "es" | "en");
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
          <div className="ml-4">
            <LanguageToggle currentLocale={lang} />
          </div>
        </div>
        <Suspense>
          <LoginForm dict={dict} />
        </Suspense>
      </div>
    </main>
  );
}
