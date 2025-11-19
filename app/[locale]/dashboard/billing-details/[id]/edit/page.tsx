import Form from "@/app/ui/billing-details/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchBillingDetailById } from "@/app/lib/billing-details-actions/billing-details-data";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Edit Billing Details",
};

export default async function Page(props: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const params = await props.params;
  const id = params.id;
  const locale = params.locale;
  const [billingDetails, dict] = await Promise.all([
    fetchBillingDetailById(id),
    getDictionary(locale ?? "es"),
  ]);
  if (!billingDetails) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Billing Details", href: "/dashboard/billing-details" },
          {
            label: "Edit Billing Details",
            href: `/dashboard/billing-details/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form billingDetails={billingDetails} dict={dict} />
    </main>
  );
}
