import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchCategories } from "@/app/lib/categories-actions/categories-data";
import { Metadata } from "next";
import CreateCategoryForm from "@/app/ui/categories/create-category-form";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Create Category",
};

export default async function Page({ params }: { params: { locale: Locale } }) {
  const categories = await fetchCategories();
  const { locale } = await Promise.resolve(params);
  const dict = await getDictionary(locale ?? "es");

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: dict.categories.title, href: "/dashboard/categories" },
          {
            label: dict.categories.createCategory,
            href: "/dashboard/categories/create",
            active: true,
          },
        ]}
      />
      <CreateCategoryForm categories={categories} dict={dict} />
    </main>
  );
}
