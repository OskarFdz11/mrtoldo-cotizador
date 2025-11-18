import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";

import { Metadata } from "next";
import CreateBillingDetailsForm from "@/app/ui/billing-details/create-billing-details-form";
import { fetchBillingDetailsField } from "@/app/lib/billing-details-actions/billing-details-data";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Create Billing Details",
};

export default async function Page({ params }: { params: { locale: Locale } }) {
  const { locale } = await Promise.resolve(params);
  const dict = await getDictionary(locale ?? "es");
  const billingDetails = await fetchBillingDetailsField();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: dict.billingDetails.title,
            href: "/dashboard/billing-details",
          },
          {
            label: dict.billingDetails.createBillingDetail,
            href: "/dashboard/billing-details/create",
            active: true,
          },
        ]}
      />
      <CreateBillingDetailsForm billingDetails={billingDetails} dict={dict} />
    </main>
  );
}
