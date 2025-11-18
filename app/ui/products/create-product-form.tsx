"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { useFormPersistence } from "@/app/hooks/useFormPersisence";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createProduct,
  ProductFormState,
} from "@/app/lib/products-actions/products-actions";
import { CategoryField, ProductField } from "@/app/lib/definitions";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useNotification } from "@/app/hooks/useNotifications";
import NotificationModal from "@/app/ui/notification-modal";
import {
  ArchiveBoxIcon,
  BuildingStorefrontIcon,
  CloudArrowUpIcon,
  CubeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTransitionOverlay } from "@/app/ui/global-transition-overlay";
import { useLocaleRouter } from "@/app/hooks/useLocaleRouter";
import { useI18n } from "@/app/ui/i18n-provider";
import { Dictionary } from "@/app/lib/dictionaries";
import SearchableSelect from "@/app/ui/searchable-select";

export default function CreateProductForm({
  products,
  categories,
  dict,
}: {
  products: ProductField[];
  categories: CategoryField[];
  dict: Dictionary;
}) {
  const localeRouter = useLocaleRouter();
  const { locale } = useI18n();
  const initialState: ProductFormState = {
    message: null,
    success: false,
    errors: {},
  };
  const [state, formAction] = useActionState(createProduct, initialState);
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const [publicId, setPublicId] = useState<string | null>("");
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const {
    data: formData,
    updateData,
    clearData,
    isLoaded,
  } = useFormPersistence<{
    name: string;
    description: string;
    category: string;
    categoryId: string;
    price: string;
    brand: string;
    quantity: string;
    imageUrl: string;
  }>("create-product-form", {
    name: "",
    description: "",
    category: "",
    categoryId: "",
    price: "",
    brand: "",
    quantity: "",
    imageUrl: "",
  });

  const { show, hide } = useTransitionOverlay();

  const clearCompleteForm = useCallback(() => {
    clearData();
    setImageUrl("");
    setPublicId("");
    updateData({ imageUrl: "" });
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
      const productName = formData.name || "";
      // limpiar persistencia antes de navegar (para que no queden valores al volver)
      clearCompleteForm();
      // redirigir a la tabla y pasar el nombre para mostrar el modal allí
      localeRouter.replace(
        `/dashboard/products?created=${encodeURIComponent(productName)}`
      );
    } else if (state.message && state.success === false) {
      showError("Error al crear producto", state.message);
    }
  }, [state.success, state.message]);

  const handleCloseModal = () => {
    hideNotification();
    if (notification.type === "success") {
      localeRouter.push("/dashboard/products");
    }
  };

  const handleSubmit = async (fd: FormData) => {
    try {
      show(dict.products.creating);
      await formAction(fd);
    } finally {
    }
  };

  const handleClearForm = () => {
    clearData();
    setImageUrl("");
    setPublicId("");
  };

  useEffect(() => {
    // Solo limpiar cuando el componente se monta y no hay datos válidos
    if (isLoaded) {
      const isEmpty =
        !formData.name &&
        !formData.description &&
        !formData.price &&
        !formData.brand &&
        !formData.imageUrl;
      if (isEmpty) {
        clearCompleteForm();
      }
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }

  return (
    <>
      <form action={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Name */}
          <div className="mb-4">
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
                onChange={(e) => updateData({ name: e.target.value })}
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
          <div className="mb-4">
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
                onChange={(e) => updateData({ brand: e.target.value })}
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
          {/* Description */}
          <div className="mb-4">
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
                onChange={(e) => updateData({ description: e.target.value })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  onSelect={(value) => updateData({ categoryId: value })}
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
              <input
                type="hidden"
                name="categoryId"
                value={formData.categoryId}
              />
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
                  onChange={(e) => updateData({ price: e.target.value })}
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
          </div>

          {/* Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  onChange={(e) => updateData({ quantity: e.target.value })}
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

          {/* Image Upload */}
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
                    updateData({ imageUrl: url });
                  }
                  console.log("Upload success, info:", info);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open?.()}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                  width={96}
                  height={96}
                  alt="Preview"
                  className="h-24 w-24 rounded object-cover"
                />
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setImageUrl("")}
                  className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full bg-white text-gray-600 shadow ring-1 ring-black/10 hover:bg-red-50 hover:text-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
            {/* <input type="hidden" name="imagePublicId" value={publicId ?? ""} /> */}

            <div id="image-error" aria-live="polite" aria-atomic="true">
              {state.errors?.imageUrl?.map((e) => (
                <p key={e} className="mt-2 text-sm text-red-500">
                  {e}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href={`/${locale}/dashboard/products`}
            onClick={clearCompleteForm}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {dict.common.cancel}
          </Link>
          {/* <button
              type="button"
              onClick={handleClearForm}
              className="flex h-10 items-center rounded-lg bg-gray-500 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600"
            >
              Clear Form
            </button> */}
          <Button type="submit">
            {dict.common.create} {dict.products.product}
          </Button>
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
