import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";

import { Metadata } from "next";
import CreateBillingDetailsForm from "@/app/ui/billing-details/create-billing-details-form";
import { fetchBillingDetailsField } from "@/app/lib/billing-details-actions/billing-details-data";

export const metadata: Metadata = {
  title: "Create Billing Details",
};

export default async function Page() {
  const billingDetails = await fetchBillingDetailsField();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Billing Details", href: "/dashboard/billing-details" },
          {
            label: "Create Billing Details",
            href: "/dashboard/billing-details/create",
            active: true,
          },
        ]}
      />
      <CreateBillingDetailsForm billingDetails={billingDetails} />
    </main>
  );
}
