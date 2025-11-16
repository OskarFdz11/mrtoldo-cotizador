import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchCategories } from "@/app/lib/categories-actions/categories-data";
import { Metadata } from "next";
import CreateCategoryForm from "@/app/ui/categories/create-category-form";

export const metadata: Metadata = {
  title: "Create Category",
};

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Categories", href: "/dashboard/categories" },
          {
            label: "Create Category",
            href: "/dashboard/categories/create",
            active: true,
          },
        ]}
      />
      <CreateCategoryForm categories={categories} />
    </main>
  );
}
