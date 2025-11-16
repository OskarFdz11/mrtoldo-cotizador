// app/ui/dashboard/desktop-header.tsx
import { Dictionary } from "@/app/lib/dictionaries";
import LanguageToggle from "@/app/ui/language-toggle";

interface DesktopHeaderProps {
  title?: string;
}

export default function DesktopHeader({ title }: DesktopHeaderProps) {
  return (
    <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center">
        {title && (
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle />
        {/* Aquí podrías agregar otras acciones como notificaciones, perfil, etc. */}
      </div>
    </header>
  );
}
