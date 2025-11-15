import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";

import { Metadata } from "next";

import CreateProductForm from "@/app/ui/products/create-product-form";
import { fetchProducts } from "@/app/lib/products-actions/products-data";
import { fetchCategories } from "@/app/lib/categories-actions/categories-data";

export const metadata: Metadata = {
  title: "Create Product",
};
export default async function Page() {
  const products = await fetchProducts();
  const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/dashboard/products" },
          {
            label: "Create Product",
            href: "/dashboard/products/create",
            active: true,
          },
        ]}
      />
      <CreateProductForm products={products} categories={categories} />
    </main>
  );
}
