"use client";

import {
  CategoryFormState,
  updateCategory,
} from "@/app/lib/categories-actions/categories-actions";
import { useActionState, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { DocumentTextIcon, TagIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/app/ui/i18n-provider";
import { useLocaleRouter } from "@/app/hooks/useLocaleRouter";
import { useFormSubmission } from "@/app/hooks/useFormSubmussion";
import { Dictionary } from "@/app/lib/dictionaries";
import { CategoryField } from "@/app/lib/definitions";

export default function EditCategoryForm({
  category,
  dict,
}: {
  category: CategoryField;
  dict: Dictionary;
}) {
  const localeRouter = useLocaleRouter();
  const { locale } = useI18n();
  const initialState: CategoryFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const updateCategoryWithId = updateCategory.bind(null, category.id);
  const [state, formAction] = useActionState(
    updateCategoryWithId,
    initialState
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const handleSuccess = useCallback(() => {
    const currentName = FormData.name || "";
    localeRouter.replace(
      `/${locale}/dashboard/categories?updated=${encodeURIComponent(
        currentName
      )}`
    );
  }, [localeRouter, locale, FormData.name]);

  const { startSubmission } = useFormSubmission(
    state,
    dict.categories.updating || "Actualizando categoría...",
    handleSuccess
  );

  const handleSubmit = async (fd: FormData) => {
    startSubmission();
    await formAction(fd);
  };

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              defaultValue={category.name}
              placeholder="Enter category name"
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
            Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              name="description"
              defaultValue={category.description}
              placeholder="Enter description"
              className="block w-full rounded-md border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <DocumentTextIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500" />
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
          Cancel
        </Link>
        <Button type="submit">Edit Category</Button>
      </div>
    </form>
  );
}
