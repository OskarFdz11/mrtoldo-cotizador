"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createCategory,
  CategoryFormState,
} from "@/app/lib/categories-actions/categories-actions";
import { CategoryField } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import { DocumentTextIcon, TagIcon } from "@heroicons/react/24/outline";
import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { Dictionary } from "@/app/lib/dictionaries";
import { useI18n } from "@/app/ui/i18n-provider";
import { useLocaleRouter } from "@/app/hooks/useLocaleRouter";
import { useFormSubmission } from "@/app/hooks/useFormSubmussion";

export default function CreateCategoryForm({
  categories,
  dict,
}: {
  categories: CategoryField[];
  dict: Dictionary;
}) {
  const localeRouter = useLocaleRouter();
  const { locale } = useI18n();
  const initialState: CategoryFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const [state, formAction] = useActionState(createCategory, initialState);
  const nameRef = useRef<HTMLInputElement>(null);

  const {
    data: formData,
    updateData,
    clearData,
    isLoaded,
  } = useFormPersistence<{
    name: string;
    description: string;
  }>("create-customer-form", {
    name: "",
    description: "",
  });

  const clearCompleteForm = useCallback(() => {
    clearData();
  }, [clearData]);

  const handleSuccess = useCallback(() => {
    const currentName = formData.name || "";
    localeRouter.replace(
      `/${locale}/dashboard/categories?created=${encodeURIComponent(
        currentName
      )}`
    );
    clearCompleteForm();
  }, [localeRouter, locale, clearCompleteForm, formData.name]);

  const { startSubmission } = useFormSubmission(
    state,
    dict.categories.creating,
    handleSuccess
  );

  const handleSubmit = async (fd: FormData) => {
    startSubmission();
    await formAction(fd);
  };

  if (!isLoaded) return null;

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            {dict.categories.name}
          </label>
          <div className="relative">
            <input
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder={dict.categories.namePlaceholder}
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            {dict.categories.description}
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => updateData({ description: e.target.value })}
              placeholder={dict.categories.descriptionPlaceholder}
              className="block w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px]   text-gray-500" />
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.description &&
              state.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/${locale}/dashboard/categories`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {dict.common.cancel}
        </Link>
        <Button type="submit">
          {dict.common.create} {dict.categories.singleTitle}
        </Button>
      </div>
    </form>
  );
}
