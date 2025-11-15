import Form from "@/app/ui/categories/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchCategoryById } from "@/app/lib/categories-actions/categories-data";

export const metadata: Metadata = {
  title: "Edit Category",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [category] = await Promise.all([fetchCategoryById(id)]);
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
      <Form category={category} />
    </main>
  );
}
