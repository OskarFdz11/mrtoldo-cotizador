"use client";
import { useEffect } from "react";
import { useTransitionOverlay } from "./global-transition-overlay";

export default function FinishTransitionOnConfirm({
  created,
  updated,
  deleted,
}: {
  created?: string | null;
  updated?: string | null;
  deleted?: string | null;
}) {
  const hide = useTransitionOverlay((s) => s.hide);

  useEffect(() => {
    if (created || updated || deleted) {
      const id = setTimeout(() => hide(), 150); // pequeño delay para suavizar
      return () => clearTimeout(id);
    }
  }, [created, updated, deleted, hide]);

  return null;
}
