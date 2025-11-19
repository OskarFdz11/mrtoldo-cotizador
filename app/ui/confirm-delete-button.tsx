"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "./confirm-delete-modal";
import SuccessModal from "./success-modal";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

interface ConfirmDeleteButtonProps {
  itemId: string | number;
  deleteAction: (
    id: string | number
  ) => Promise<void | { success: boolean; message: string }>;

  entityName: string;
  entityLabel?: string;

  itemName?: string;
  iconOnly?: boolean;
  buttonClassName?: string;
  dict?: Dictionary;
  onDeleteSuccess?: () => void;
}

export default function ConfirmDeleteButton({
  itemId,
  deleteAction,
  entityName,
  entityLabel,
  itemName,
  iconOnly = true,
  buttonClassName = "rounded-md border p-2 hover:bg-gray-100 text-red-600 hover:text-red-500",
  dict: dictProp,
  onDeleteSuccess,
}: ConfirmDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const { dict: contextDict } = useI18n();
  const dict = dictProp || contextDict;

  const label = entityLabel?.trim() || entityName;

  const titleShort = `${
    dict.common?.deleteShort || dict.common?.delete || "Eliminar"
  } ${label}?`;

  const successTitle =
    dict.forms?.deleteSuccess ||
    `¡${label.charAt(0).toUpperCase() + label.slice(1)} ${
      dict.common?.deleted || "eliminado"
    }!`;

  const deletingSpinnerLabel = dict.common?.deleting || "Eliminando...";
  const buttonLabel = `${dict.common?.delete || "Eliminar"} ${label}`;

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await deleteAction(itemId);
        if (
          result &&
          typeof result === "object" &&
          "success" in result &&
          !result.success
        ) {
          alert(result.message || dict.forms?.error || "Ocurrió un error.");
          setIsConfirmOpen(false);
          return;
        }
        setIsConfirmOpen(false);
        setIsSuccessOpen(true);
        onDeleteSuccess?.();
        router.refresh();
      } catch (err) {
        console.error("Delete error:", err);
        alert(dict.forms?.error || `Ocurrió un error al eliminar ${label}.`);
        setIsConfirmOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isPending}
        className={buttonClassName}
        title={buttonLabel}
      >
        {isPending ? (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
            {!iconOnly && (
              <span className="text-xs">{deletingSpinnerLabel}</span>
            )}
          </div>
        ) : (
          <>
            <TrashIcon className="w-5 h-5" />
            {!iconOnly && <span className="ml-1">{buttonLabel}</span>}
          </>
        )}
      </button>

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={titleShort}
        message={
          dict.common?.deleteWarning || "Esta acción no se puede deshacer."
        }
        itemName={itemName}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title={successTitle}
        message={
          dict.forms?.operationOk || "La operación se completó correctamente."
        }
        autoCloseTime={1800}
      />
    </>
  );
}
