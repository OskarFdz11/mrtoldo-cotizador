"use client";

import { Fragment } from "react";
import {
  DialogPanel,
  TransitionChild,
  Dialog,
  Transition,
  DialogTitle,
} from "@headlessui/react";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  dict?: Dictionary; // opcional (si quieres inyectar manualmente)
  titleOverride?: string;
  messageOverride?: string;
  confirmLabelOverride?: string;
  cancelLabelOverride?: string;
  pendingLabelOverride?: string;
}

export default function ConfirmLogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  dict: dictProp,
  titleOverride,
  messageOverride,
  confirmLabelOverride,
  cancelLabelOverride,
  pendingLabelOverride,
}: ConfirmLogoutModalProps) {
  const { dict: contextDict } = useI18n();
  const dict = dictProp || contextDict;

  const title = titleOverride || dict.auth?.logoutTitle || "¿Cerrar sesión?";

  const message =
    messageOverride ||
    dict.auth?.logoutMessage ||
    "¿Estás seguro de que quieres cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder al dashboard.";

  const confirmLabel =
    confirmLabelOverride ||
    (isPending
      ? dict.auth?.logoutPending || "Cerrando sesión..."
      : dict.auth?.logoutConfirm || "Cerrar sesión");

  const cancelLabel =
    cancelLabelOverride || dict.auth?.logoutCancel || "Cancelar";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={isPending ? () => {} : onClose}
      >
        {/* Fondo */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        {/* Contenedor */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <PowerIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-snug text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <p className="mt-3 text-sm text-gray-600">{message}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onClose}
                    disabled={isPending}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
                    onClick={onConfirm}
                    disabled={isPending}
                  >
                    {isPending && (
                      <span className="absolute left-4 inline-flex">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      </span>
                    )}
                    <span className={isPending ? "pl-6" : ""}>
                      {confirmLabel}
                    </span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
