"use client";

import { useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

type ActionKind = "created" | "updated" | "deleted" | "custom";

interface ActionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: ActionKind;
  entityKey?: keyof Dictionary;
  entityNameOverride?: string;
  titleOverride?: string;
  messageOverride?: string;
  requireAccept?: boolean;
  autoCloseTime?: number;
  dict?: Dictionary;
}

function buildTitle(
  dict: Dictionary,
  action: ActionKind,
  entityKey?: keyof Dictionary,
  entityNameOverride?: string
): string {
  if (action === "custom") return "";

  const singular =
    entityNameOverride ||
    (entityKey && (dict[entityKey] as any)?.customer) ||
    (entityKey && (dict[entityKey] as any)?.product) ||
    (entityKey && (dict[entityKey] as any)?.quotation) ||
    (entityKey && (dict[entityKey] as any)?.category) ||
    (entityKey && (dict[entityKey] as any)?.billingDetail) ||
    ""; // fallback vacío

  if (entityKey) {
    const scoped = dict[entityKey] as any;
    if (action === "created" && scoped?.createdTitle)
      return scoped.createdTitle;
    if (action === "updated" && scoped?.updatedTitle)
      return scoped.updatedTitle;
    if (action === "deleted" && scoped?.deletedTitle)
      return scoped.deletedTitle;
  }

  const actWord =
    action === "created"
      ? dict.common?.created || "creado"
      : action === "updated"
      ? dict.common?.updated || "actualizado"
      : action === "deleted"
      ? dict.common?.deleted || "eliminado"
      : "";

  if (singular && actWord) {
    const cap =
      singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase();
    return `${cap} ${actWord} correctamente`;
  }

  return dict.forms?.operationOk || "Operación exitosa";
}

export default function ActionResultModal({
  isOpen,
  onClose,
  action,
  entityKey,
  entityNameOverride,
  titleOverride,
  messageOverride,
  requireAccept = false,
  autoCloseTime = 2000,
  dict: dictProp,
}: ActionResultModalProps) {
  const { dict: contextDict } = useI18n();
  const dict = dictProp || contextDict;

  if (!isOpen) return null;

  const computedTitle =
    titleOverride || buildTitle(dict, action, entityKey, entityNameOverride);

  const computedMessage =
    messageOverride ||
    dict.common?.operationCompleted ||
    dict.forms?.operationOk ||
    "La operación se completó correctamente.";

  useEffect(() => {
    if (!requireAccept) {
      const t = setTimeout(onClose, autoCloseTime);
      return () => clearTimeout(t);
    }
  }, [requireAccept, autoCloseTime, onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
        <div className="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {computedTitle}
        </h3>
        {/* <p className="text-sm text-gray-600 mb-5">{computedMessage}</p> */}

        {requireAccept && (
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {dict.common?.accept || "Aceptar"}
          </button>
        )}
      </div>
    </div>
  );
}
