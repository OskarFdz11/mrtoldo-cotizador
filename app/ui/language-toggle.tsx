// app/ui/language-toggle.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LanguageIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface LanguageToggleProps {
  currentLocale: string;
  variant?: "blue" | "white" | "sidebar" | "header";
  className?: string;
}

export default function LanguageToggle({
  currentLocale,
  variant = "blue",
  className,
}: LanguageToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = currentLocale === "es" ? "en" : "es";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={clsx(
        // Estilos base
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2",

        // Estilos por variante
        {
          // Fondo azul (sidebar móvil, header azul)
          "text-white hover:bg-white/10 focus:ring-white/50":
            variant === "blue",

          // Fondo blanco (header, modales)
          "text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500":
            variant === "white" || variant === "header",

          // Sidebar de desktop (fondo gris claro)
          "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-blue-500":
            variant === "sidebar",
        },

        // Clase personalizada opcional
        className
      )}
      title={`Cambiar a ${currentLocale === "es" ? "English" : "Español"}`}
    >
      <LanguageIcon
        className={clsx("h-4 w-4", {
          "text-white": variant === "blue",
          "text-gray-600": variant === "white" || variant === "header",
          "text-gray-500 group-hover:text-gray-700": variant === "sidebar",
        })}
      />
      <span>{currentLocale === "es" ? "ES" : "EN"}</span>
    </button>
  );
}
