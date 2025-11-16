"use client";

import React, { createContext, useContext } from "react";
import type { Dictionary } from "@/app/lib/dictionaries";
import type { Locale } from "@/app/lib/i18n";

type I18nValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: I18nValue & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider no está presente en el árbol");
  return ctx;
}
