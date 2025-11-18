"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createBillingDetails,
  BillingDetailsFormState,
} from "@/app/lib/billing-details-actions/billing-details-actions";
import { BillingDetailsField } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import { applyPersistedToFormData } from "@/app/lib/utils";
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  EnvelopeIcon,
  HashtagIcon,
  HomeIcon,
  IdentificationIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { Dictionary } from "@/app/lib/dictionaries";

export default function CreateBillingDetailsForm({
  billingDetails,
  dict,
}: {
  billingDetails: BillingDetailsField[];
  dict: Dictionary;
}) {
  const router = useRouter();
  const initialState: BillingDetailsFormState = {
    message: null,
    errors: {},
    success: false,
  };
  const [state, formAction] = useActionState(
    createBillingDetails,
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
    cardNumber: string;
    clabe: string;
    checkAccount: string;
    street: string;
    outsideNumber: string;
    colony: string;
    city: string;
    cp: string;
  }>("create-billing-details-form", {
    name: "",
    lastname: "",
    email: "",
    company: "",
    rfc: "",
    phone: "",
    cardNumber: "",
    clabe: "",
    checkAccount: "",
    street: "",
    outsideNumber: "",
    colony: "",
    city: "",
    cp: "",
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const clearCompleteForm = useCallback(() => {
    clearData();
  }, [clearData]);

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
      const currentName =
        nameRef.current?.value || billingDetails[0]?.name || "";
      clearCompleteForm();
      router.replace(
        `/dashboard/billing-details?created=${encodeURIComponent(currentName)}`
      );
    }
  }, [state.success, router, billingDetails[0]?.name]);

  const handleSubmit = async (fd: FormData) => {
    try {
      show(dict.billingDetails.creating);
      applyPersistedToFormData(fd, formData);
      await formAction(fd);
    } finally {
    }
  };

  if (!isLoaded) return null;

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              {dict.billingDetails.name}
            </label>
            <div className="relative">
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                placeholder={dict.billingDetails.namePlaceholder}
                value={formData.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
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

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastname"
              className="mb-2 block text-sm font-medium"
            >
              {dict.billingDetails.lastname}
            </label>
            <div className="relative">
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={(e) => updateData({ lastname: e.target.value })}
                placeholder={dict.billingDetails.lastnamePlaceholder}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
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

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Company */}
          <div>
            <label htmlFor="company" className="mb-2 block text-sm font-medium">
              {dict.billingDetails.company}
            </label>
            <div className="relative">
              <input
                id="company"
                name="company"
                type="text"
                placeholder={dict.billingDetails.companyPlaceholder}
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
          <div>
            <label htmlFor="rfc" className="mb-2 block text-sm font-medium">
              {dict.billingDetails.rfc}
            </label>
            <div className="relative">
              <input
                id="rfc"
                name="rfc"
                type="text"
                placeholder={dict.billingDetails.rfcPlaceholder}
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

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              {dict.billingDetails.email}
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateData({ email: e.target.value })}
                placeholder={dict.billingDetails.emailPlaceholder}
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
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              {dict.billingDetails.phone}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateData({ phone: e.target.value })}
              placeholder={dict.billingDetails.phonePlaceholder}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
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

        {/* Banking Information */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* CardNumber */}
          <div>
            <label
              htmlFor="cardNumber"
              className="mb-2 block text-sm font-medium"
            >
              {dict.billingDetails.cardNumber}
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                value={formData.cardNumber}
                onChange={(e) => updateData({ cardNumber: e.target.value })}
                placeholder={dict.billingDetails.cardNumberPlaceholder}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <CreditCardIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="cardNumber-error" aria-live="polite" aria-atomic="true">
              {state.errors?.cardNumber &&
                state.errors.cardNumber.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          {/* CLABE */}
          <div>
            <label htmlFor="clabe" className="mb-2 block text-sm font-medium">
              {dict.billingDetails.clabe}
            </label>
            <div className="relative">
              <input
                id="clabe"
                name="clabe"
                type="text"
                value={formData.clabe}
                onChange={(e) => updateData({ clabe: e.target.value })}
                placeholder={dict.billingDetails.clabePlaceholder}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="clabe-error" aria-live="polite" aria-atomic="true">
              {state.errors?.clabe &&
                state.errors.clabe.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Check Account */}
          <div>
            <label
              htmlFor="checkAccount"
              className="mb-2 block text-sm font-medium"
            >
              {dict.billingDetails.checkAccount}
            </label>
            <div className="relative">
              <input
                id="checkAccount"
                name="checkAccount"
                type="text"
                value={formData.checkAccount}
                onChange={(e) => updateData({ checkAccount: e.target.value })}
                placeholder={dict.billingDetails.checkAccountPlaceholder}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
              />
              <BuildingLibraryIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="checkAccount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.checkAccount &&
                state.errors.checkAccount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {dict.billingDetails.addressInformation}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Street */}
            <div>
              <label
                htmlFor="street"
                className="mb-2 block text-sm font-medium"
              >
                {dict.billingDetails.street}
              </label>
              <div className="relative">
                <input
                  id="street"
                  value={formData.street}
                  onChange={(e) => updateData({ street: e.target.value })}
                  name="street"
                  type="text"
                  placeholder={dict.billingDetails.streetPlaceholder}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                />
                <HomeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="street-error" aria-live="polite" aria-atomic="true">
                {state.errors?.street &&
                  state.errors.street.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* Outside Number */}
            <div>
              <label
                htmlFor="outsideNumber"
                className="mb-2 block text-sm font-medium"
              >
                {dict.billingDetails.externalNumber}
              </label>
              <div className="relative">
                <input
                  id="outsideNumber"
                  value={formData.outsideNumber}
                  onChange={(e) =>
                    updateData({ outsideNumber: e.target.value })
                  }
                  name="outsideNumber"
                  type="text"
                  placeholder={dict.billingDetails.externalNumberPlaceholder}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                />
                <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div
                id="outsideNumber-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {state.errors?.outsideNumber &&
                  state.errors.outsideNumber.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Colony */}
            <div>
              <label
                htmlFor="colony"
                className="mb-2 block text-sm font-medium"
              >
                {dict.billingDetails.colony}
              </label>
              <div className="relative">
                <input
                  id="colony"
                  name="colony"
                  value={formData.colony}
                  onChange={(e) => updateData({ colony: e.target.value })}
                  type="text"
                  placeholder={dict.billingDetails.colonyPlaceholder}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                />
                <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="colony-error" aria-live="polite" aria-atomic="true">
                {state.errors?.colony &&
                  state.errors.colony.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium">
                {dict.billingDetails.city}
              </label>
              <div className="relative">
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => updateData({ city: e.target.value })}
                  type="text"
                  placeholder={dict.billingDetails.cityPlaceholder}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                />
                <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="city-error" aria-live="polite" aria-atomic="true">
                {state.errors?.city &&
                  state.errors.city.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="cp" className="mb-2 block text-sm font-medium">
                {dict.billingDetails.cp}
              </label>
              <div className="relative">
                <input
                  id="cp"
                  name="cp"
                  value={formData.cp}
                  onChange={(e) => updateData({ cp: e.target.value })}
                  type="text"
                  placeholder={dict.billingDetails.cpPlaceholder}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500"
                />
                <MapPinIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="cp-error" aria-live="polite" aria-atomic="true">
                {state.errors?.cp &&
                  state.errors.cp.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/billing-details"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {dict.common.cancel}
        </Link>
        <Button type="submit">
          {dict.common.create} {dict.billingDetails.title}
        </Button>
      </div>
    </form>
  );
}
