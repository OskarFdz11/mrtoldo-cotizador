"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/app/hooks/useNotifications";
import NotificationModal from "@/app/ui/notification-modal";
import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";

type Gender = "m" | "f";

type Props = {
  // Pasa el nombre en singular: "producto", "cliente", "categoría", "detalle de pago", "cotización"
  entity: string;
  // Género gramatical del nombre (m por default)
  gender?: Gender;
  clearToPath: string;
};

function buildCopy(
  entity: string,
  action: "created" | "updated" | "deleted",
  gender: Gender = "m"
) {
  const adjectives: Record<Gender, Record<typeof action, string>> = {
    m: { created: "creado", updated: "actualizado", deleted: "eliminado" },
    f: { created: "creada", updated: "actualizada", deleted: "eliminada" },
  };

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return {
    title: cap(`${entity} ${adjectives[gender][action]} correctamente`),
    message: "La operación se completó correctamente.",
  };
}
export default function FlashFromQuery({
  entity,
  gender = "m",
  clearToPath,
}: Props) {
  const sp = useSearchParams();
  const router = useRouter();

  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const hideOverlay = useTransitionOverlay((s) => s.hide);

  useEffect(() => {
    const created = sp.get("created");
    const updated = sp.get("updated");
    const deleted = sp.get("deleted");
    const errorMsg = sp.get("error");

    const hideThen = (cb: () => void) => {
      hideOverlay();
      setTimeout(cb, 80);
    };

    if (created) {
      const { title, message } = buildCopy(entity, "created", gender);
      hideThen(() => {
        showSuccess(title, message);
        router.replace(clearToPath);
      });
    } else if (updated) {
      const { title, message } = buildCopy(entity, "updated", gender);
      hideThen(() => {
        showSuccess(title, message);
        router.replace(clearToPath);
      });
    } else if (deleted) {
      const { title, message } = buildCopy(entity, "deleted", gender);
      hideThen(() => {
        showSuccess(title, message);
        router.replace(clearToPath);
      });
    } else if (errorMsg) {
      hideThen(() => {
        showError("Ocurrió un error", errorMsg);
        router.replace(clearToPath);
      });
    }
  }, [
    sp,
    router,
    clearToPath,
    entity,
    gender,
    showSuccess,
    showError,
    hideOverlay,
  ]);

  return (
    <NotificationModal
      isOpen={notification.isOpen}
      onClose={hideNotification}
      type={notification.type}
      title={notification.title}
      message={notification.message}
    />
  );
}
