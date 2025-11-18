"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { deleteQuotation } from "@/app/lib/quotations-actions/quotations-actions";
import { Dictionary } from "@/app/lib/dictionaries";
import { useI18n } from "@/app/ui/i18n-provider";

export function CreateQuotation({ dict }: { dict: Dictionary }) {
  const { locale } = useI18n();
  return (
    <Link
      href={`/${locale}/dashboard/quotations/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">{dict.quotations.createQuotation}</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateQuotation({ id }: { id: number | string }) {
  const { locale } = useI18n();
  return (
    <Link
      href={`/${locale}/dashboard/quotations/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteQuotation({ id }: { id: string | number }) {
  const deleteQuotationWithId = deleteQuotation.bind(null, id);
  return (
    <form action={deleteQuotationWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
