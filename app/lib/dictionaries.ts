import "server-only";

const dictionaries = {
  es: () => import("../dictionaries/es.json").then((module) => module.default),
  en: () => import("../dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: "es" | "en") => {
  return dictionaries[locale]?.() ?? dictionaries.es();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export type Locale = keyof typeof dictionaries;
