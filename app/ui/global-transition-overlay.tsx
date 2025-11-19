"use client";

import { TailSpin } from "react-loader-spinner";
import { create } from "zustand";

type TransitionState = {
  active: boolean;
  label?: string;
  show: (label?: string) => void;
  hide: () => void;
};

export const useTransitionOverlay = create<TransitionState>((set) => ({
  active: false,
  label: "Procesando...",
  show: (label) => set({ active: true, label }),
  hide: () => set({ active: false, label: "Procesando..." }),
}));

export const GlobalTransitionOverlay = () => {
  const active = useTransitionOverlay((s) => s.active);
  const label = useTransitionOverlay((s) => s.label);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <TailSpin
          height="48"
          width="48"
          color="#2f6feb"
          ariaLabel="tail-spin-loading"
          radius="1"
        />
        <p className="text-sm text-gray-700">{label}</p>
      </div>
    </div>
  );
};
