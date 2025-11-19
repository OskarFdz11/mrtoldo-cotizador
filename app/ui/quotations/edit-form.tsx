"use client";

import { useActionState, useState, useCallback } from "react";
import Link from "next/link";
import {
  CustomerField,
  ProductField,
  BillingDetailsField,
  QuotationWithDetails,
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
  updateQuotation,
  State,
} from "@/app/lib/quotations-actions/quotations-actions";
import { Dictionary } from "@/app/lib/dictionaries";
import SearchableSelect from "@/app/ui/searchable-select";
import { useI18n } from "@/app/ui/i18n-provider";
import { useLocaleRouter } from "@/app/hooks/useLocaleRouter";
import { useFormSubmission } from "@/app/hooks/useFormSubmussion";

type QuotationProduct = {
  productId: string;
  quantity: number;
  price: number;
};

export default function EditQuotationForm({
  quotation,
  customers,
  products,
  billingDetails,
  dict,
}: {
  quotation: QuotationWithDetails;
  customers: CustomerField[];
  products: ProductField[];
  billingDetails: BillingDetailsField[];
  dict: Dictionary;
}) {
  const { locale } = useI18n();
  const localeRouter = useLocaleRouter();

  const initialState: State = { message: "", errors: {}, success: false };
  const updateQuotationWithId = updateQuotation.bind(null, quotation.id);
  const [state, formAction] = useActionState(
    updateQuotationWithId,
    initialState
  );

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    String(quotation.customerId)
  );
  const [selectedBillingDetailsId, setSelectedBillingDetailsId] =
    useState<string>(String(quotation.billingDetailsId));
  const [notes, setNotes] = useState<string>(quotation.notes || "");

  const [selectedProducts, setSelectedProducts] = useState<QuotationProduct[]>(
    quotation.products.map((p) => ({
      productId: String(p.productId),
      quantity: p.quantity,
      price: Number(p.price),
    }))
  );
  const [iva, setIva] = useState(quotation.iva);

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

  // Navegación post-éxito (el hook oculta el loader)
  const handleSuccess = useCallback(() => {
    const id = state.quotationId;
    const label = id ? `#${id}` : "";
    localeRouter.replace(
      `/${locale}/dashboard/quotations?updated=${encodeURIComponent(label)}`
    );
  }, [state.quotationId, localeRouter, locale]);

  const { startSubmission } = useFormSubmission(
    state,
    dict.quotations?.updating || "Actualizando cotización...",
    handleSuccess
  );

  const handleSubmit = async (fd: FormData) => {
    // Valida antes del loader
    const validProducts = selectedProducts.filter((p) => !!p.productId);
    if (!validProducts.length) {
      alert(
        dict.quotations?.atLeastOneProduct ||
          "Debe seleccionar al menos un producto"
      );
      return;
    }

    // Preparar payload
    fd.set("customerId", selectedCustomerId);
    fd.set("billingDetailsId", selectedBillingDetailsId);
    fd.set("notes", notes);
    fd.set("iva", iva.toString());
    fd.set("products", JSON.stringify(validProducts));

    startSubmission();
    await formAction(fd);
  };

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
              value={selectedCustomerId}
              onSelect={setSelectedCustomerId}
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
            />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId?.map((e) => (
              <p key={e} className="mt-2 text-sm text-red-500">
                {e}
              </p>
            ))}
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
              value={selectedBillingDetailsId}
              onSelect={setSelectedBillingDetailsId}
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
            />
          </div>
          <div id="billingDetails-error" aria-live="polite" aria-atomic="true">
            {state.errors?.billingDetailsId?.map((e) => (
              <p key={e} className="mt-2 text-sm text-red-500">
                {e}
              </p>
            ))}
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
                    placeholder={dict.products?.selectProduct}
                    searchPlaceholder={dict.products?.searchProduct}
                    emptyMessage={dict.products?.noProductsFound}
                    filterFunction={(option, term) => {
                      const p = products.find(
                        (x) => String(x.id) === option.id
                      );
                      if (!p) return false;
                      const text = `${p.name} ${p.brand}`.toLowerCase();
                      return text.includes(term.toLowerCase());
                    }}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
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
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
                  defaultChecked={quotation.status === "pending"}
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
                  defaultChecked={quotation.status === "paid"}
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
        <Button type="submit">{dict.common?.save || "Guardar"}</Button>
      </div>
    </form>
  );
}
