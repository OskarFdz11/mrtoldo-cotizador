import Form from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchCustomerById } from "@/app/lib/customer-actions/customer-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Edit Customer",
};

export default async function Page(props: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const params = await props.params;
  const id = params.id;
  const locale = params.locale;
  const [customer, dict] = await Promise.all([
    fetchCustomerById(id),
    getDictionary(locale ?? "es"),
  ]);
  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Edit Customer",
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        customer={{ ...customer, phone: customer.phone.toString() }}
        dict={dict}
      />
    </main>
  );
}
