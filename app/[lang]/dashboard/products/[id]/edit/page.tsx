import Form from "@/app/ui/products/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchProductById } from "@/app/lib/products-actions/products-data";
import { categories } from "@/app/lib/placeholder-data";
import {
  fetchCategories,
  fetchCategoryById,
} from "@/app/lib/categories-actions/categories-data";
export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [product, categories] = await Promise.all([
    fetchProductById(id),
    fetchCategories(),
  ]);
  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/dashboard/products" },
          {
            label: "Edit Product",
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form product={product} categories={categories} />
    </main>
  );
}
