"use client";

import { useEffect } from "react";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

type ActionKind = "created" | "updated" | "deleted" | "custom";
type Variant = "success" | "error" | "warning" | "info";

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
  variant?: Variant;
  hideMessage?: boolean;
  confirmLabelOverride?: string;
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
    "";

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

const variantStyles: Record<
  Variant,
  {
    circleBg: string;
    iconColor: string;
    buttonBg: string;
    buttonHover: string;
    ringColor: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
> = {
  success: {
    circleBg: "bg-green-100",
    iconColor: "text-green-600",
    buttonBg: "bg-green-600",
    buttonHover: "hover:bg-green-500",
    ringColor: "focus:ring-green-400",
    Icon: CheckIcon,
  },
  error: {
    circleBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonBg: "bg-red-600",
    buttonHover: "hover:bg-red-500",
    ringColor: "focus:ring-red-400",
    Icon: XCircleIcon,
  },
  warning: {
    circleBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    buttonBg: "bg-yellow-600",
    buttonHover: "hover:bg-yellow-500",
    ringColor: "focus:ring-yellow-400",
    Icon: ExclamationTriangleIcon,
  },
  info: {
    circleBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonBg: "bg-blue-600",
    buttonHover: "hover:bg-blue-500",
    ringColor: "focus:ring-blue-400",
    Icon: InformationCircleIcon,
  },
};

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
  variant = "success",
  hideMessage = false,
  confirmLabelOverride,
}: ActionResultModalProps) {
  const { dict: contextDict } = useI18n();
  const dict = dictProp || contextDict;

  const computedTitle =
    titleOverride ||
    buildTitle(dict, action, entityKey, entityNameOverride) ||
    (action === "custom" ? "Operación" : "");
  const computedMessage =
    messageOverride ||
    dict.common?.operationCompleted ||
    dict.forms?.operationOk ||
    "La operación se completó correctamente.";

  useEffect(() => {
    if (isOpen && !requireAccept) {
      const t = setTimeout(onClose, autoCloseTime);
      return () => clearTimeout(t);
    }
  }, [isOpen, requireAccept, autoCloseTime, onClose]);

  if (!isOpen) return null;

  const vs = variantStyles[variant];
  const confirmLabel =
    confirmLabelOverride ||
    dict.common?.accept ||
    (variant === "error"
      ? dict.common?.close || "Cerrar"
      : dict.common?.ok || "Aceptar");

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
        <div
          className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${vs.circleBg}`}
        >
          <vs.Icon className={`w-8 h-8 ${vs.iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {computedTitle}
        </h3>
        {!hideMessage && (
          <p className="text-sm text-gray-600 mb-5">{computedMessage}</p>
        )}

        {requireAccept && (
          <button
            type="button"
            onClick={onClose}
            className={`w-full rounded-lg ${vs.buttonBg} px-4 py-2 text-sm font-medium text-white ${vs.buttonHover} focus:outline-none focus:ring-2 ${vs.ringColor}`}
          >
            {confirmLabel}
          </button>
        )}
      </div>
    </div>
  );
}
