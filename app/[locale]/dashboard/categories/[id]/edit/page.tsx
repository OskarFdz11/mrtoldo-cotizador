import Form from "@/app/ui/categories/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchCategoryById } from "@/app/lib/categories-actions/categories-data";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Edit Category",
};

export default async function Page(props: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const params = await props.params;
  const id = params.id;
  const locale = params.locale;
  const [category, dict] = await Promise.all([
    fetchCategoryById(id),
    getDictionary(locale ?? "es"),
  ]);
  if (!category) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Categories", href: "/dashboard/categories" },
          {
            label: "Edit Category",
            href: `/dashboard/categories/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form category={category} dict={dict} />
    </main>
  );
}
