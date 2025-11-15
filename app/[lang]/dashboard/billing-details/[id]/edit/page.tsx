import Form from "@/app/ui/billing-details/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchBillingDetailById } from "@/app/lib/billing-details-actions/billing-details-data";

export const metadata: Metadata = {
  title: "Edit Billing Details",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [billingDetails] = await Promise.all([fetchBillingDetailById(id)]);
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
      <Form billingDetails={billingDetails} />
    </main>
  );
}
