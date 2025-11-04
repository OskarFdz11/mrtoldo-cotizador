"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
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

export default function CreateCustomerForm({
  customers,
}: {
  customers: CustomerField[];
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
    applyPersistedToFormData(fd, formData);
    await formAction(fd);
  };

  if (!isLoaded) return null;

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
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
              placeholder="Enter first name"
              value={formData.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {/* ...existing code... */}
        </div>

        {/* Lastname */}
        <div className="mb-4">
          <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
            Lastname
          </label>
          <div className="relative">
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={(e) => updateData({ lastname: e.target.value })}
              placeholder="Enter last name"
              className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          {/* Email */}
          <div className="mb-4 mt-2">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder="Enter email"
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

          {/* Company */}
          <div className="mb-4">
            <label htmlFor="company" className="mb-2 block text-sm font-medium">
              Company
            </label>
            <div className="relative">
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Enter company"
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
              RFC
            </label>
            <div className="relative">
              <input
                id="rfc"
                name="rfc"
                type="text"
                placeholder="Enter RFC"
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

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateData({ phone: e.target.value })}
                placeholder="Enter phone number"
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
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/customers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Customer</Button>
        </div>
      </div>
    </form>
  );
}
