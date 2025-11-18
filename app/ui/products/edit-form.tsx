// app/ui/products/edit-form.tsx
"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  updateProduct,
  ProductFormState,
} from "@/app/lib/products-actions/products-actions";
import { CategoryField, ProductField } from "@/app/lib/definitions";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useNotification } from "@/app/hooks/useNotifications";
import NotificationModal from "@/app/ui/notification-modal";
import { useRouter } from "next/navigation";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  CubeIcon,
  DocumentTextIcon,
  TagIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import {
  GlobalTransitionOverlay,
  useTransitionOverlay,
} from "@/app/ui/global-transition-overlay";
import { Dictionary } from "@/app/lib/dictionaries";
import SearchableSelect from "@/app/ui/searchable-select";
import { useI18n } from "@/app/ui/i18n-provider";
import { useLocaleRouter } from "@/app/hooks/useLocaleRouter";

export default function EditProductForm({
  product,
  categories,
  dict,
}: {
  product: ProductField;
  categories: CategoryField[];
  dict: Dictionary;
}) {
  const localeRouter = useLocaleRouter();
  const { locale } = useI18n();
  const updateProductWithId = updateProduct.bind(null, product.id);
  const initialState: ProductFormState = {
    message: null,
    success: false,
    errors: {},
  };
  const [state, formAction] = useActionState(updateProductWithId, initialState);

  // Estados controlados
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    categoryId: String(product.category.id),
    price: product.price.toString(),
    brand: product.brand,
    quantity: product.quantity.toString(),
  });
  const [imageUrl, setImageUrl] = useState<string | null>(
    product.image_url || ""
  );

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
        "Producto actualizado",
        "El producto se actualizó correctamente."
      );
    } else if (state.message && state.success === false) {
      showError("Error al actualizar producto", state.message);
    }
  }, [state.success, state.message, showSuccess, showError]);

  const handleCloseModal = () => {
    hideNotification();
    if (notification.type === "success") {
      localeRouter.push("/dashboard/products");
    }
  };

  const handleSubmit = async (fd: FormData) => {
    try {
      show(dict.products.updating || "Actualizando producto...");

      // Preparar FormData con datos actuales
      fd.set("name", formData.name);
      fd.set("description", formData.description);
      fd.set("categoryId", formData.categoryId);
      fd.set("price", formData.price);
      fd.set("brand", formData.brand);
      fd.set("quantity", formData.quantity);
      fd.set("imageUrl", imageUrl || "");

      await formAction(fd);
    } finally {
    }
  };

  return (
    <>
      <form action={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Información básica del producto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                {dict.products.name}
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={dict.products.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <CubeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="mb-2 block text-sm font-medium">
                {dict.products.brand}
              </label>
              <div className="relative">
                <input
                  id="brand"
                  name="brand"
                  type="text"
                  placeholder={dict.products.brandPlaceholder}
                  value={formData.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <BuildingStorefrontIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="brand-error" aria-live="polite" aria-atomic="true">
                {state.errors?.brand &&
                  state.errors.brand.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              {dict.products.description}
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                placeholder={dict.products.descriptionPlaceholder}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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

          {/* Category y Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Category con SearchableSelect */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                {dict.products.category}
              </label>
              <div className="relative">
                <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 z-10" />
                <SearchableSelect
                  options={categories.map((category) => ({
                    id: String(category.id),
                    name: category.name,
                    description: category.description,
                  }))}
                  value={formData.categoryId}
                  onSelect={(value) => updateField("categoryId", value)}
                  placeholder={
                    dict.products.selectCategory || "Seleccionar categoría"
                  }
                  searchPlaceholder={
                    dict.products.searchCategoryPlaceholder ||
                    "Buscar categoría..."
                  }
                  emptyMessage={
                    dict.products?.noCategoriesFound ||
                    "No se encontraron categorías"
                  }
                  filterFunction={(option, searchTerm) => {
                    const category = categories.find(
                      (c) => String(c.id) === option.id
                    );
                    if (!category) return false;
                    const searchText =
                      `${category.name} ${category.description}`.toLowerCase();
                    return searchText.includes(searchTerm.toLowerCase());
                  }}
                />
              </div>
              <div id="category-error" aria-live="polite" aria-atomic="true">
                {state.errors?.category &&
                  state.errors.category.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium">
                {dict.products.price}
              </label>
              <div className="relative">
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder={dict.products.pricePlaceholder}
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="price-error" aria-live="polite" aria-atomic="true">
                {state.errors?.price &&
                  state.errors.price.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            {/* Stock */}

            <div>
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-medium"
              >
                {dict.products.stock}
              </label>
              <div className="relative">
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder={dict.products.stockPlaceholder}
                  value={formData.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                  className="block w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="quantity-error" aria-live="polite" aria-atomic="true">
                {state.errors?.quantity &&
                  state.errors.quantity.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* Imagen del producto */}
          <div className="border-t pt-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                {dict.products.image}
              </label>
              {!imageUrl && (
                <CldUploadWidget
                  uploadPreset="products-images"
                  options={{ multiple: false, folder: "products" }}
                  onSuccess={(result) => {
                    const info =
                      (result?.info as {
                        secure_url?: string;
                        public_id?: string;
                      }) || {};
                    const url = info.secure_url as string | undefined;
                    if (url) {
                      setImageUrl(url);
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open?.()}
                      className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                    >
                      <CloudArrowUpIcon className="h-5 w-5" />
                      {dict.products.imagePlaceholder}
                    </button>
                  )}
                </CldUploadWidget>
              )}

              {imageUrl && (
                <div className="mt-3 relative inline-block">
                  <Image
                    src={imageUrl}
                    width={120}
                    height={120}
                    alt="Preview"
                    className="h-30 w-30 rounded-lg object-cover shadow-md"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setImageUrl("")}
                    className="absolute -top-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-white text-gray-600 shadow-lg ring-1 ring-black/10 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

              <div id="image-error" aria-live="polite" aria-atomic="true">
                {state.errors?.imageUrl?.map((e) => (
                  <p key={e} className="mt-2 text-sm text-red-500">
                    {e}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href={`/${locale}/dashboard/products`}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {dict.common.cancel}
          </Link>
          <Button type="submit">{dict.common.save}</Button>
        </div>
      </form>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleCloseModal}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <GlobalTransitionOverlay />
    </>
  );
}
