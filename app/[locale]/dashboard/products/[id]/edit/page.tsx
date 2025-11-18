import Form from "@/app/ui/products/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchProductById } from "@/app/lib/products-actions/products-data";
import { fetchCategories } from "@/app/lib/categories-actions/categories-data";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function Page(props: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const params = await props.params;
  const id = params.id;
  const locale = params.locale;
  const [product, categories, dict] = await Promise.all([
    fetchProductById(id),
    fetchCategories(),
    getDictionary(locale ?? "es"),
  ]);
  if (!product) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: dict.products.title, href: "/dashboard/products" },
          {
            label: dict.products.editProduct,
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form product={product} categories={categories} dict={dict} />
    </main>
  );
}
