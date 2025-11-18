// app/ui/quotations/edit-form.tsx
"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CustomerField,
  ProductField,
  BillingDetailsField,
  QuotationWithDetails,
} from "@/app/lib/definitions";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  UserCircleIcon,
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import {
  updateQuotation,
  State,
} from "@/app/lib/quotations-actions/quotations-actions";
import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { Dictionary } from "@/app/lib/dictionaries";
import SearchableSelect from "../searchable-select";

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
  const router = useRouter();
  const initialState: State = { message: "", errors: {}, success: false };
  const updateQuotationWithId = updateQuotation.bind(null, quotation.id);
  const [state, formAction] = useActionState(
    updateQuotationWithId,
    initialState
  );
  const { show, hide } = useTransitionOverlay();

  // ✅ NUEVO: Estados para manejar los campos del formulario
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    String(quotation.customerId)
  );
  const [selectedBillingDetailsId, setSelectedBillingDetailsId] =
    useState<string>(String(quotation.billingDetailsId));
  const [notes, setNotes] = useState<string>(quotation.notes || "");

  // Inicializar productos desde la cotización existente
  const [selectedProducts, setSelectedProducts] = useState<QuotationProduct[]>(
    quotation.products.map((p) => ({
      productId: p.productId.toString(),
      quantity: p.quantity,
      price: Number(p.price),
    }))
  );
  const [iva, setIva] = useState(quotation.iva);

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
      const id = state.quotationId;
      const label = id ? `#${id}` : "";
      router.replace(
        `/dashboard/quotations?updated=${encodeURIComponent(label)}`
      );
    }
  }, [state.success, router]);

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: "", quantity: 1, price: 0 },
    ]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (
    index: number,
    field: keyof QuotationProduct,
    value: string | number
  ) => {
    const updated = [...selectedProducts];
    if (field === "productId") {
      updated[index][field] = value as string;
      const selectedProduct = products.find((p) => p.id.toString() === value);
      if (selectedProduct) {
        updated[index].price = selectedProduct.price;
      }
    } else {
      updated[index][field] = Number(value);
    }
    setSelectedProducts(updated);
  };

  const updateQuantity = (index: number, increment: boolean) => {
    const updated = [...selectedProducts];
    const newQuantity = increment
      ? updated[index].quantity + 1
      : Math.max(1, updated[index].quantity - 1);
    updated[index].quantity = newQuantity;
    setSelectedProducts(updated);
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return iva ? subtotal * 1.16 : subtotal;
  };

  // ✅ NUEVO: Manejar envío con JSON
  const handleSubmit = async (fd: FormData) => {
    try {
      show(dict.quotations?.updating || "Actualizando cotización...");

      // Filtrar productos válidos
      const validProducts = selectedProducts.filter(
        (p) => p.productId && p.productId !== ""
      );

      // Validar que haya al menos un producto
      if (validProducts.length === 0) {
        alert(
          dict.quotations?.atLeastOneProduct ||
            "Debe seleccionar al menos un producto"
        );
        return;
      }

      // Preparar FormData
      fd.set("customerId", selectedCustomerId);
      fd.set("billingDetailsId", selectedBillingDetailsId);
      fd.set("notes", notes);
      fd.set("iva", iva.toString());
      fd.set("products", JSON.stringify(validProducts));

      // Debug
      console.log("Sending update data:");
      console.log("Customer:", selectedCustomerId);
      console.log("Billing:", selectedBillingDetailsId);
      console.log("Products:", validProducts);
      console.log("IVA:", iva);

      await formAction(fd);
    } finally {
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Selection */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            {dict.quotations?.chooseCustomer || "Seleccionar cliente"}
          </label>
          <div className="relative">
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 z-10" />
            <SearchableSelect
              options={customers.map((customer) => ({
                id: String(customer.id),
                name: `${customer.name} ${customer.lastname} - ${customer.email} - ${customer.company}`,
              }))}
              value={selectedCustomerId}
              onSelect={(value) => setSelectedCustomerId(value)}
              placeholder={
                dict.quotations?.chooseCustomer || "Seleccionar cliente"
              }
              searchPlaceholder={
                dict.quotations?.searchCustomer || "Buscar cliente..."
              }
              emptyMessage={
                dict.quotations?.noCustomersFound ||
                "No se encontraron clientes"
              }
              filterFunction={(option, searchTerm) => {
                const customer = customers.find(
                  (c) => String(c.id) === option.id
                );
                if (!customer) return false;
                const searchText =
                  `${customer.name} ${customer.lastname} ${customer.email} ${customer.company}`.toLowerCase();
                return searchText.includes(searchTerm.toLowerCase());
              }}
            />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Billing Details Selection */}
        <div className="mb-4">
          <label
            htmlFor="billingDetails"
            className="mb-2 block text-sm font-medium"
          >
            {dict.quotations?.chooseBillingDetails ||
              "Seleccionar detalles de facturación"}
          </label>
          <div className="relative">
            <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 z-10" />
            <SearchableSelect
              options={billingDetails.map((billing) => ({
                id: String(billing.id),
                name: `${billing.company} - ${billing.name} ${billing.lastname} - RFC: ${billing.rfc}`,
              }))}
              value={selectedBillingDetailsId}
              onSelect={(value) => setSelectedBillingDetailsId(value)}
              placeholder={
                dict.quotations?.chooseBillingDetails ||
                "Seleccionar detalles de facturación"
              }
              searchPlaceholder={
                dict.quotations?.searchBillingDetails ||
                "Buscar detalles de facturación..."
              }
              emptyMessage={
                dict.quotations?.noBillingDetailsFound ||
                "No se encontraron detalles de facturación"
              }
              filterFunction={(option, searchTerm) => {
                const billing = billingDetails.find(
                  (b) => String(b.id) === option.id
                );
                if (!billing) return false;
                const searchText =
                  `${billing.company} ${billing.name} ${billing.lastname} ${billing.rfc}`.toLowerCase();
                return searchText.includes(searchTerm.toLowerCase());
              }}
            />
          </div>
          <div id="billingDetails-error" aria-live="polite" aria-atomic="true">
            {state.errors?.billingDetailsId &&
              state.errors.billingDetailsId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Products Selection */}
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

          {selectedProducts.map((selectedProduct, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center mb-2 p-3 border rounded-md bg-white"
            >
              {/* Product select */}
              <div className="sm:col-span-5 min-w-0">
                <div className="relative">
                  <CubeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 z-10" />
                  <SearchableSelect
                    options={products.map((product) => ({
                      id: String(product.id),
                      name: `${product.name} - ${product.brand} - $${product.price}`,
                    }))}
                    value={selectedProduct.productId}
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
                    filterFunction={(option, searchTerm) => {
                      const product = products.find(
                        (p) => String(p.id) === option.id
                      );
                      if (!product) return false;
                      const searchText =
                        `${product.name} ${product.brand}`.toLowerCase();
                      return searchText.includes(searchTerm.toLowerCase());
                    }}
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <input
                    type="number"
                    value={selectedProduct.quantity}
                    onChange={(e) =>
                      updateProduct(index, "quantity", e.target.value)
                    }
                    min="1"
                    placeholder={dict.quotations?.quantity || "Cant."}
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                  />
                </div>
              </div>

              {/* Unit price */}
              <div className="sm:col-span-3">
                <input
                  type="number"
                  value={selectedProduct.price}
                  onChange={(e) =>
                    updateProduct(index, "price", e.target.value)
                  }
                  step="0.01"
                  placeholder={dict.quotations?.unitPrice || "Precio"}
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2"
                />
              </div>

              {/* Line total + remove */}
              <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                <span className="text-sm font-medium whitespace-nowrap">
                  $
                  {(selectedProduct.price * selectedProduct.quantity).toFixed(
                    2
                  )}
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
            {state.errors?.products &&
              state.errors.products.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* IVA Toggle */}
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

        {/* Totals Display */}
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

        {/* Notes */}
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

        {/* Status Selection */}
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
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/quotations"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {dict.common?.cancel || "Cancelar"}
        </Link>
        <Button type="submit">{dict.common?.save || "Guardar"}</Button>
      </div>
    </form>
  );
}
