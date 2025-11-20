"use client";

import {
  useActionState,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import {
  CustomerField,
  ProductField,
  BillingDetailsField,
} from "@/app/lib/definitions";
import {
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
  PlusIcon,
  TrashIcon,
  BuildingOfficeIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import {
  createQuotation,
  State,
} from "@/app/lib/quotations-actions/quotations-actions";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import { Dictionary } from "@/app/lib/dictionaries";
import SearchableSelect from "@/app/ui/searchable-select";
import { useI18n } from "@/app/ui/i18n-provider";
import { useLocaleRouter } from "@/app/hooks/useLocaleRouter";
import { useFormSubmission } from "@/app/hooks/useFormSubmussion";
import ActionResultModal from "@/app/ui/action-result-modal";

type QuotationProduct = {
  productId: string;
  quantity: number;
  price: number;
};

export default function CreateQuotationForm({
  customers,
  products,
  billingDetails,
  dict,
}: {
  customers: CustomerField[];
  products: ProductField[];
  billingDetails: BillingDetailsField[];
  dict: Dictionary;
}) {
  const { locale } = useI18n();
  const localeRouter = useLocaleRouter();

  const initialState: State = { message: "", errors: {}, success: false };
  const [state, formAction] = useActionState<State, FormData>(
    createQuotation,
    initialState
  );

  const [selectedProducts, setSelectedProducts] = useState<QuotationProduct[]>([
    { productId: "", quantity: 1, price: 0 },
  ]);
  const [iva, setIva] = useState(false);

  const {
    data: persisted,
    updateData,
    clearData,
    isLoaded,
  } = useFormPersistence<{
    customerId: string;
    billingDetailsId: string;
    notes: string;
    status: string;
    iva: boolean;
    productsJSON: string;
  }>("create-quotation-form", {
    customerId: "",
    billingDetailsId: "",
    iva: false,
    notes: "",
    status: "pending",
    productsJSON: "[]",
  });

  const [showValidationModal, setShowValidationModal] = useState(false);
  const [clientErrors, setClientErrors] = useState<{
    customerId?: boolean;
    billingDetailsId?: boolean;
    products?: boolean;
  }>({});

  const hasServerFieldErrors = useMemo(() => {
    const e = state.errors || {};
    const keys = Object.keys(e);
    return keys.some(
      (k) =>
        k !== "general" &&
        Array.isArray((e as any)[k]) &&
        (e as any)[k]?.length > 0
    );
  }, [state.errors]);

  useEffect(() => {
    if (hasServerFieldErrors && !state.success) {
      setShowValidationModal(true);
    }
  }, [hasServerFieldErrors, state.success]);

  // Hidratar estado desde persistencia
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const parsed = JSON.parse(persisted.productsJSON || "[]");
      if (Array.isArray(parsed) && parsed.length) setSelectedProducts(parsed);
      setIva(!!persisted.iva);
    } catch {}
  }, [isLoaded, persisted.productsJSON, persisted.iva]);

  // Guardar selección de productos en persistencia
  useEffect(() => {
    updateData({ productsJSON: JSON.stringify(selectedProducts) });
  }, [selectedProducts, updateData]);

  // Guardar IVA en persistencia
  useEffect(() => {
    updateData({ iva });
  }, [iva, updateData]);

  const clearCompleteForm = useCallback(() => {
    clearData();
    setSelectedProducts([{ productId: "", quantity: 1, price: 0 }]);
    setIva(false);
  }, [clearData]);

  const addProduct = () => {
    setSelectedProducts((prev) => [
      ...prev,
      { productId: "", quantity: 1, price: 0 },
    ]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProduct = (
    index: number,
    field: keyof QuotationProduct,
    value: string | number
  ) => {
    setSelectedProducts((prev) => {
      const updated = [...prev];
      if (field === "productId") {
        updated[index][field] = value as string;
        const p = products.find((pp) => String(pp.id) === value);
        if (p) updated[index].price = p.price;
      } else {
        updated[index][field] = Number(value);
      }
      return updated;
    });
  };

  const calculateSubtotal = () =>
    selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return iva ? subtotal * 1.16 : subtotal;
  };

  // Navegación post-éxito (loader se esconde dentro del hook)
  const handleSuccess = useCallback(() => {
    const label = state.quotationId ? `#${state.quotationId}` : "";
    clearCompleteForm();
    localeRouter.replace(
      `/${locale}/dashboard/quotations?created=${encodeURIComponent(label)}`
    );
  }, [state.quotationId, clearCompleteForm, localeRouter, locale]);

  const { startSubmission } = useFormSubmission(
    state,
    dict.quotations?.creating || "Creando cotización...",
    handleSuccess
  );

  const handleSubmit = async (fd: FormData) => {
    const validProducts = selectedProducts.filter((p) => p.productId);

    const missing: {
      customerId?: boolean;
      billingDetailsId?: boolean;
      products?: boolean;
    } = {};
    if (!persisted.customerId) missing.customerId = true;
    if (!persisted.billingDetailsId) missing.billingDetailsId = true;
    if (validProducts.length === 0) missing.products = true;

    if (missing.customerId || missing.billingDetailsId || missing.products) {
      setClientErrors(missing);
      setShowValidationModal(true);
      return;
    } else {
      setClientErrors({});
    }

    fd.set("customerId", persisted.customerId);
    fd.set("billingDetailsId", persisted.billingDetailsId);
    fd.set("notes", persisted.notes);
    fd.set("iva", iva.toString());
    fd.set("products", JSON.stringify(validProducts));

    startSubmission();
    await formAction(fd);
  };

  if (!isLoaded) return null;

  const customerError =
    clientErrors.customerId || (state.errors?.customerId?.length ?? 0) > 0;
  const billingError =
    clientErrors.billingDetailsId ||
    (state.errors?.billingDetailsId?.length ?? 0) > 0;
  const productsError =
    clientErrors.products || (state.errors?.products?.length ?? 0) > 0;

  const requiredMsg = dict.forms?.required || "Este campo es requerido";

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Cliente */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            {dict.quotations?.chooseCustomer || "Seleccionar cliente"}
          </label>
          <div className="relative">
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 z-10" />
            <SearchableSelect
              options={customers.map((c) => ({
                id: String(c.id),
                name: `${c.name} ${c.lastname} - ${c.email} - ${c.company}`,
              }))}
              value={persisted.customerId}
              onSelect={(value) => updateData({ customerId: value })}
              placeholder={dict.quotations?.chooseCustomer}
              searchPlaceholder={dict.quotations?.searchCustomer}
              emptyMessage={dict.quotations?.noCustomersFound}
              filterFunction={(option, term) => {
                const c = customers.find((x) => String(x.id) === option.id);
                if (!c) return false;
                const text =
                  `${c.name} ${c.lastname} ${c.email} ${c.company}`.toLowerCase();
                return text.includes(term.toLowerCase());
              }}
              error={customerError}
            />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId?.map((e) => (
              <p key={e} className="mt-2 text-sm text-red-500">
                {e}
              </p>
            ))}
            {customerError && !(state.errors?.customerId?.length ?? 0) && (
              <p className="mt-2 text-sm text-red-500">{requiredMsg}</p>
            )}
          </div>
        </div>

        {/* Datos de facturación */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            {dict.quotations?.chooseBillingDetails ||
              "Seleccionar detalles de facturación"}
          </label>
          <div className="relative">
            <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 z-10" />
            <SearchableSelect
              options={billingDetails.map((b) => ({
                id: String(b.id),
                name: `${b.company} - ${b.name} ${b.lastname} - RFC: ${b.rfc}`,
              }))}
              value={persisted.billingDetailsId}
              onSelect={(value) => updateData({ billingDetailsId: value })}
              placeholder={dict.quotations?.chooseBillingDetails}
              searchPlaceholder={dict.quotations?.searchBillingDetails}
              emptyMessage={dict.quotations?.noBillingDetailsFound}
              filterFunction={(option, term) => {
                const b = billingDetails.find(
                  (x) => String(x.id) === option.id
                );
                if (!b) return false;
                const text =
                  `${b.company} ${b.name} ${b.lastname} ${b.rfc}`.toLowerCase();
                return text.includes(term.toLowerCase());
              }}
              error={billingError}
            />
          </div>
          <div id="billingDetails-error" aria-live="polite" aria-atomic="true">
            {state.errors?.billingDetailsId?.map((e) => (
              <p key={e} className="mt-2 text-sm text-red-500">
                {e}
              </p>
            ))}
            {billingError && !(state.errors?.billingDetailsId?.length ?? 0) && (
              <p className="mt-2 text-sm text-red-500">{requiredMsg}</p>
            )}
          </div>
        </div>

        {/* Productos */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              {dict.products?.title || "Productos"}
            </label>
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
            >
              <PlusIcon className="h-4 w-4" />
              {dict.quotations?.addProduct || "Agregar producto"}
            </button>
          </div>

          {selectedProducts.map((sp, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center mb-2 p-3 border rounded-md bg-white"
            >
              <div className="sm:col-span-5 min-w-0">
                <div className="relative">
                  <CubeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 z-10" />
                  <SearchableSelect
                    options={products.map((p) => ({
                      id: String(p.id),
                      name: `${p.name} - ${p.brand} - $${p.price}`,
                    }))}
                    value={sp.productId}
                    onSelect={(value) =>
                      updateProduct(index, "productId", value)
                    }
                    placeholder={
                      dict.products?.selectProduct || "Seleccionar producto"
                    }
                    searchPlaceholder={
                      dict.products?.searchProduct || "Buscar producto..."
                    }
                    emptyMessage={
                      dict.products?.noProductsFound ||
                      "No se encontraron productos"
                    }
                    filterFunction={(option, term) => {
                      const p = products.find(
                        (x) => String(x.id) === option.id
                      );
                      if (!p) return false;
                      const text = `${p.name} ${p.brand}`.toLowerCase();
                      return text.includes(term.toLowerCase());
                    }}
                    error={productsError}
                  />
                  <input
                    type="hidden"
                    name={`products[${index}][productId]`}
                    value={sp.productId}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  name={`products[${index}][quantity]`}
                  value={sp.quantity}
                  min={1}
                  onChange={(e) =>
                    updateProduct(index, "quantity", e.target.value)
                  }
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="number"
                  name={`products[${index}][price]`}
                  value={sp.price}
                  step="0.01"
                  onChange={(e) =>
                    updateProduct(index, "price", e.target.value)
                  }
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                <span className="text-sm font-medium whitespace-nowrap">
                  ${(sp.price * sp.quantity).toFixed(2)}
                </span>
                {selectedProducts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="shrink-0 text-red-600 hover:text-red-500"
                    aria-label={dict.common?.delete || "Eliminar"}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div id="products-error" aria-live="polite" aria-atomic="true">
            {state.errors?.products?.map((e) => (
              <p key={e} className="mt-2 text-sm text-red-500">
                {e}
              </p>
            ))}
            {productsError && !(state.errors?.products?.length ?? 0) && (
              <p className="mt-2 text-sm text-red-500">
                {dict.quotations?.atLeastOneProduct ||
                  "Debe seleccionar al menos un producto"}
              </p>
            )}
            {/* Inventario */}
            <div id="inventory-error" aria-live="polite" aria-atomic="true">
              {state.errors?.inventory?.map((e) => (
                <p key={e} className="mt-2 text-sm text-red-600">
                  {e}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* IVA */}
        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="iva"
              name="iva"
              type="checkbox"
              checked={iva}
              onChange={(e) => setIva(e.target.checked)}
              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
            />
            <label
              htmlFor="iva"
              className="ml-2 cursor-pointer text-sm font-medium"
            >
              {dict.quotations?.ivaToggle || "¿Incluir IVA? (16%)"}
            </label>
          </div>
        </div>

        {/* Totales */}
        <div className="mb-4 bg-white p-4 rounded-md border">
          <div className="flex justify-between text-sm mb-2">
            <span>{dict.quotations?.subtotal || "Subtotal"}:</span>
            <span className="font-medium">
              ${calculateSubtotal().toFixed(2)}
            </span>
          </div>
          {iva && (
            <div className="flex justify-between text-sm mb-2">
              <span>IVA (16%):</span>
              <span className="font-medium">
                ${(calculateSubtotal() * 0.16).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>{dict.quotations?.total || "Total"}:</span>
            <span className="text-green-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        {/* Notas */}
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium">
            {dict.quotations?.notes || "Notas"}
          </label>
          <textarea
            onChange={(e) => updateData({ notes: e.target.value })}
            id="notes"
            name="notes"
            rows={3}
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            placeholder={
              dict.quotations?.notesPlaceholder || "Notas adicionales..."
            }
          />
        </div>

        {/* Estado */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            {dict.quotations?.status || "Estado"}
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  checked={persisted.status === "pending"}
                  onChange={(e) => updateData({ status: e.target.value })}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  {dict.quotations?.statusPending || "Pendiente"}{" "}
                  <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  checked={persisted.status === "paid"}
                  onChange={(e) => updateData({ status: e.target.value })}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  {dict.quotations?.statusPaid || "Pagado"}{" "}
                  <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status?.map((e) => (
              <p key={e} className="mt-2 text-sm text-red-500">
                {e}
              </p>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/${locale}/dashboard/quotations`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {dict.common?.cancel || "Cancelar"}
        </Link>
        <Button type="submit">
          {dict.quotations?.createQuotation || "Crear Cotización"}
        </Button>
      </div>
      <ActionResultModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        action="custom"
        variant="error"
        titleOverride={
          dict.forms?.validationErrorTitle || "Faltan campos requeridos"
        }
        messageOverride={
          dict.forms?.validationErrorMessage ||
          "Por favor completa los campos marcados como requeridos."
        }
        requireAccept
      />
    </form>
  );
}
