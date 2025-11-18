import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";

import { Metadata } from "next";

import CreateProductForm from "@/app/ui/products/create-product-form";
import { fetchProducts } from "@/app/lib/products-actions/products-data";
import { fetchCategories } from "@/app/lib/categories-actions/categories-data";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Create Product",
};
export default async function Page({ params }: { params: { locale: Locale } }) {
  const { locale } = await Promise.resolve(params);
  const dict = await getDictionary(locale ?? "es");
  const products = await fetchProducts();
  const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: dict.products.title, href: "/dashboard/products" },
          {
            label: dict.products.createProduct,
            href: "/dashboard/products/create",
            active: true,
          },
        ]}
      />
      <CreateProductForm
        products={products}
        categories={categories}
        dict={dict}
      />
    </main>
  );
}
