"use client";
import { useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  autoCloseTime?: number;
  dict?: Dictionary;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  autoCloseTime = 2000,
  dict: dictProp,
}: SuccessModalProps) {
  const { dict: contextDict } = useI18n();
  const dict = dictProp || contextDict;

  const finalTitle = title || dict.forms?.successTitle || "¡Operación exitosa!";
  const finalMessage =
    message ||
    dict.forms?.operationOk ||
    "La operación se completó correctamente.";

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(onClose, autoCloseTime);
      return () => clearTimeout(t);
    }
  }, [isOpen, onClose, autoCloseTime]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-lg">
        <div className="w-14 h-14 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {finalTitle}
        </h3>
        <p className="text-sm text-gray-600">{finalMessage}</p>
      </div>
    </div>
  );
}
