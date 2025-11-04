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
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useNotification } from "@/app/hooks/useNotifications";
import NotificationModal from "@/app/ui/notification-modal";
import { useRouter } from "next/navigation";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CreateProductForm({
  products,
  categories,
}: {
  products: ProductField[];
  categories: CategoryField[];
}) {
  const router = useRouter();
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
    price: string;
    brand: string;
    quantity: string;
    imageUrl: string;
  }>("create-product-form", {
    name: "",
    description: "",
    category: "",
    price: "",
    brand: "",
    quantity: "",
    imageUrl: "",
  });

  const clearCompleteForm = useCallback(() => {
    clearData();
    setImageUrl("");
    setPublicId("");
  }, [clearData]);

  useEffect(() => {
    if (state.success) {
      const productName = formData.name || "";
      // limpiar persistencia antes de navegar (para que no queden valores al volver)
      clearCompleteForm();
      // redirigir a la tabla y pasar el nombre para mostrar el modal allí
      router.replace(
        `/dashboard/products?created=${encodeURIComponent(productName)}`
      );
    } else if (state.message && state.success === false) {
      showError("Error al crear producto", state.message);
    }
  }, [state.success, state.message]);

  const handleCloseModal = () => {
    hideNotification();
    if (notification.type === "success") {
      router.push("/dashboard/products");
    }
  };

  const handleSubmit = async (formDataObj: FormData) => {
    // Agregar datos persistidos al FormData
    formDataObj.set("name", formData.name);
    formDataObj.set("description", formData.description);
    formDataObj.set("category", formData.category);
    formDataObj.set("price", formData.price);
    formDataObj.set("brand", formData.brand);
    formDataObj.set("quantity", formData.quantity);

    const finalImageUrl = imageUrl || formData.imageUrl || "";
    formDataObj.set("imageUrl", finalImageUrl);

    await formAction(formDataObj);
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
        !formData.brand;
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
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter Product Name"
              value={formData.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
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
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter Product Description"
              value={formData.description}
              onChange={(e) => updateData({ description: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <div id="description-error" aria-live="polite" aria-atomic="true">
              {state.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium"
            >
              Product Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => updateData({ category: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div id="category-error" aria-live="polite" aria-atomic="true">
              {state.errors?.category &&
                state.errors.category.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Image</label>
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
                  if (url) setImageUrl(url);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open?.()}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <CloudArrowUpIcon className="h-5 w-5" />
                    Upload Image
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

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="mb-2 block text-sm font-medium">
              Product Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="Enter Product Price"
              value={formData.price}
              onChange={(e) => updateData({ price: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <div id="price-error" aria-live="polite" aria-atomic="true">
              {state.errors?.price &&
                state.errors.price.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Brand */}
          <div className="mb-4">
            <label htmlFor="brand" className="mb-2 block text-sm font-medium">
              Product Brand
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              placeholder="Enter Product Brand"
              value={formData.brand}
              onChange={(e) => updateData({ brand: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
            <div id="brand-error" aria-live="polite" aria-atomic="true">
              {state.errors?.brand &&
                state.errors.brand.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium"
            >
              Product Stock
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              placeholder="Enter Product Stock"
              value={formData.quantity}
              onChange={(e) => updateData({ quantity: e.target.value })}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
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

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/products"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleClearForm}
            className="flex h-10 items-center rounded-lg bg-gray-500 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-600"
          >
            Clear Form
          </button>
          <Button type="submit">Create Product</Button>
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
