"use client";

import {
  useActionState,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createCustomer,
  CustomerFormState,
} from "@/app/lib/customer-actions/customer-actions";
import { CustomerField } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import { applyPersistedToFormData } from "@/app/lib/utils";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { Dictionary } from "@/app/lib/dictionaries";

export default function CreateCustomerForm({
  customers,
  dict,
}: {
  customers: CustomerField[];
  dict: Dictionary;
}) {
  const router = useRouter();
  const initialState: CustomerFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const [state, formAction] = useActionState<CustomerFormState, FormData>(
    createCustomer,
    initialState
  );

  const { show, hide } = useTransitionOverlay();

  const {
    data: formData,
    updateData,
    clearData,
    isLoaded,
  } = useFormPersistence<{
    name: string;
    lastname: string;
    email: string;
    company: string;
    rfc: string;
    phone: string;
  }>("create-customer-form", {
    name: "",
    lastname: "",
    email: "",
    company: "",
    rfc: "",
    phone: "",
  });

  const clearCompleteForm = useCallback(() => {
    clearData();
  }, [clearData]);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      !state.success &&
      state.errors &&
      Object.keys(state.errors).length > 0
    ) {
      hide();
    }
  }, [state.errors, state.success, hide]);

  useEffect(() => {
    if (state.success) {
      const currentName = nameRef.current?.value || customers[0]?.name || "";
      // Redirige a la lista con el flag de "created"

      router.replace(
        `/dashboard/customers?created=${encodeURIComponent(currentName)}`
      );
      clearCompleteForm();
    }
  }, [state.success, router, customers]);

  const handleSubmit = async (fd: FormData) => {
    try {
      show(dict.customers.creating);
      await formAction(fd);
    } finally {
    }
  };

  if (!isLoaded) return null;

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              {dict.customers.name}
            </label>
            <div className="relative">
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                placeholder={dict.customers.namePlaceholder}
                value={formData.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Lastname */}
          <div className="mb-4">
            <label
              htmlFor="lastname"
              className="mb-2 block text-sm font-medium"
            >
              {dict.customers.lastname}
            </label>
            <div className="relative">
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={(e) => updateData({ lastname: e.target.value })}
                placeholder={dict.customers.lastnamePlaceholder}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
        {/* Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              {dict.customers.email}
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder={dict.customers.emailPlaceholder}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              {dict.customers.phone}
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateData({ phone: e.target.value })}
                placeholder={dict.customers.phonePlaceholder}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="phone-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone &&
                state.errors.phone.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Company */}
          <div className="mb-4">
            <label htmlFor="company" className="mb-2 block text-sm font-medium">
              {dict.customers.company}
            </label>
            <div className="relative">
              <input
                id="company"
                name="company"
                type="text"
                placeholder={dict.customers.companyPlaceholder}
                value={formData.company}
                onChange={(e) => updateData({ company: e.target.value })}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="company-error" aria-live="polite" aria-atomic="true">
              {state.errors?.company &&
                state.errors.company.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          {/* RFC */}
          <div className="mb-4">
            <label htmlFor="rfc" className="mb-2 block text-sm font-medium">
              {dict.customers.rfc}
            </label>
            <div className="relative">
              <input
                id="rfc"
                name="rfc"
                type="text"
                placeholder={dict.customers.rfcPlaceholder}
                value={formData.rfc}
                onChange={(e) => updateData({ rfc: e.target.value })}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="rfc-error" aria-live="polite" aria-atomic="true">
              {state.errors?.rfc &&
                state.errors.rfc.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {dict.common.cancel}
        </Link>
        <Button type="submit">{dict.customers.createCustomer}</Button>
      </div>
    </form>
  );
}
