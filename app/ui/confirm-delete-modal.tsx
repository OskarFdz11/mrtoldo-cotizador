"use client";
import { useEffect, useRef } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  dict?: Dictionary;
  confirmLabel?: string;
  cancelLabel?: string;
  autoFocusConfirm?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  dict: dictProp,
  confirmLabel,
  cancelLabel,
  autoFocusConfirm = false,
}: ConfirmDeleteModalProps) {
  const { dict: contextDict } = useI18n();
  const dict = dictProp || contextDict;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus dialog for accessibility
      dialogRef.current?.focus();
      if (autoFocusConfirm) {
        setTimeout(() => confirmBtnRef.current?.focus(), 50);
      }
    }
  }, [isOpen, autoFocusConfirm]);

  if (!isOpen) return null;

  const finalConfirm =
    confirmLabel ||
    dict.quotations?.delete ||
    dict.common?.accept ||
    "Eliminar";
  const finalCancel = cancelLabel || dict.common?.cancel || "Cancelar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg outline-none"
      >
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold text-gray-900 mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-center text-sm text-gray-600 mb-3">{message}</p>
        {itemName && (
          <p className="text-center text-sm font-medium text-gray-800 mb-5 break-words">
            {itemName}
          </p>
        )}

        <div className="mt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-w-[110px] rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {finalCancel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[110px] rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 relative"
          >
            {isLoading && (
              <span className="absolute left-3 inline-flex">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              </span>
            )}
            <span className={isLoading ? "pl-5" : ""}>{finalConfirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
