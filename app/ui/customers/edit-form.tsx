// app/ui/customers/edit-form.tsx
"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  updateCustomer,
  CustomerFormState,
} from "@/app/lib/customer-actions/customer-actions";
import { CustomerField } from "@/app/lib/definitions";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { useNotification } from "@/app/hooks/useNotifications";
import NotificationModal from "@/app/ui/notification-modal";
import { useRouter } from "next/navigation";
import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { Dictionary } from "@/app/lib/dictionaries";
import { useI18n } from "@/app/ui/i18n-provider";
import { useLocaleRouter } from "@/app/hooks/useLocaleRouter";

export default function EditCustomerForm({
  customer,
  dict,
}: {
  customer: CustomerField;
  dict: Dictionary;
}) {
  const localeRouter = useLocaleRouter();
  const { locale } = useI18n();
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const initialState: CustomerFormState = {
    message: null,
    success: false,
    errors: {},
  };
  const [state, formAction] = useActionState(
    updateCustomerWithId,
    initialState
  );

  // Estados controlados
  const [formData, setFormData] = useState({
    name: customer.name,
    lastname: customer.lastname,
    email: customer.email,
    phone: customer.phone || "",
    company: customer.company || "",
    rfc: customer.rfc || "",
  });

  const { notification, showSuccess, showError, hideNotification } =
    useNotification();
  const { show, hide } = useTransitionOverlay();

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
      showSuccess(
        "Cliente actualizado",
        "El cliente se actualizó correctamente."
      );
    } else if (state.message && state.success === false) {
      showError("Error al actualizar cliente", state.message);
    }
  }, [state.success, state.message, showSuccess, showError]);

  const handleCloseModal = () => {
    hideNotification();
    if (notification.type === "success") {
      localeRouter.push("/dashboard/customers");
    }
  };

  const handleSubmit = async (fd: FormData) => {
    try {
      show(dict.customers?.updating || "Actualizando cliente...");

      // Preparar FormData con datos actuales
      Object.entries(formData).forEach(([key, value]) => {
        fd.set(key, value);
      });

      await formAction(fd);
    } finally {
    }
  };

  return (
    <>
      <form action={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                {dict.customers?.name || "Nombre"}
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={
                    dict.customers?.namePlaceholder || "Ingresa el nombre"
                  }
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

            {/* Lastname */}
            <div>
              <label
                htmlFor="lastname"
                className="mb-2 block text-sm font-medium"
              >
                {dict.customers?.lastname || "Apellidos"}
              </label>
              <div className="relative">
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  placeholder={
                    dict.customers?.lastnamePlaceholder ||
                    "Ingresa los apellidos"
                  }
                  value={formData.lastname}
                  onChange={(e) => updateField("lastname", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="lastname-error" aria-live="polite" aria-atomic="true">
                {state.errors?.lastname &&
                  state.errors.lastname.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                {dict.customers?.email || "Correo electrónico"}
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={
                    dict.customers?.emailPlaceholder || "Ingresa el correo"
                  }
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                {dict.customers?.phone || "Teléfono"}
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={
                    dict.customers?.phonePlaceholder || "Ingresa el teléfono"
                  }
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="mb-2 block text-sm font-medium"
              >
                {dict.customers?.company || "Empresa"}
              </label>
              <div className="relative">
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder={
                    dict.customers?.companyPlaceholder || "Ingresa la empresa"
                  }
                  value={formData.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
            {/*RFC*/}
            <div>
              <label htmlFor="rfc" className="mb-2 block text-sm font-medium">
                {dict.customers?.rfc || "RFC"}
              </label>
              <div className="relative">
                <input
                  id="rfc"
                  name="rfc"
                  type="text"
                  placeholder={
                    dict.customers?.rfcPlaceholder || "Ingresa el RFC"
                  }
                  value={formData.rfc}
                  onChange={(e) => updateField("rfc", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
            href={`/${locale}/dashboard/customers`}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {dict.common?.cancel || "Cancelar"}
          </Link>
          <Button type="submit">{dict.common?.save || "Guardar"}</Button>
        </div>
      </form>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleCloseModal}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
}
