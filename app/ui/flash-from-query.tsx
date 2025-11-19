"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/app/ui/i18n-provider";
import ActionResultModal from "@/app/ui/action-result-modal";

type Gender = "m" | "f"; // si mantienes género en otro sitio
type Props = {
  entityKey:
    | "customers"
    | "products"
    | "quotations"
    | "categories"
    | "billingDetails";
  clearToPath: string;
};

export default function FlashFromQuery({ entityKey, clearToPath }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const { dict } = useI18n();

  const created = sp.get("created");
  const updated = sp.get("updated");
  const deleted = sp.get("deleted");
  const errorMsg = sp.get("error");

  const show =
    created !== null ||
    updated !== null ||
    deleted !== null ||
    errorMsg !== null;

  const action: "created" | "updated" | "deleted" | "custom" = errorMsg
    ? "custom"
    : created
    ? "created"
    : updated
    ? "updated"
    : deleted
    ? "deleted"
    : "custom";

  // Para error podrías usar un modal distinto, aquí simplificado:
  const titleOverride = errorMsg ? dict.forms?.error || "Error" : undefined;
  const messageOverride = errorMsg || undefined;

  useEffect(() => {
    if (show && !errorMsg) {
      // Limpia la URL para no mantener el query param
      const timeout = setTimeout(() => {
        router.replace(clearToPath);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (show && errorMsg) {
      const timeout = setTimeout(() => {
        router.replace(clearToPath);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [show, errorMsg, router, clearToPath]);

  return (
    <ActionResultModal
      isOpen={show}
      onClose={() => router.replace(clearToPath)}
      action={action}
      entityKey={entityKey}
      titleOverride={titleOverride}
      messageOverride={messageOverride}
      // requireAccept si quieres que el usuario cierre manualmente
      requireAccept={false}
      autoCloseTime={2000}
    />
  );
}
