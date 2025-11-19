"use client";

import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { useEffect, useRef } from "react";

type FormState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string | null;
};

export function useFormSubmission(
  state: FormState,
  loadingMessage = "Procesando...",
  onSuccess?: () => void
) {
  const { show, hide } = useTransitionOverlay();
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (state.success === true) {
      hide();
      onSuccessRef.current?.();
    } else if (
      state.success === false ||
      (state.errors && Object.keys(state.errors).length > 0)
    ) {
      hide();
    }
  }, [state.success, state.errors, hide]);

  const startSubmission = (customMessage?: string) => {
    show(customMessage || loadingMessage);
  };

  return {
    startSubmission,
    isSuccess: state.success === true,
    hasErrors: !!(state.errors && Object.keys(state.errors).length > 0),
    hide,
  };
}
