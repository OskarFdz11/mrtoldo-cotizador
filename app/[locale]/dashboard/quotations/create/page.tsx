import Form from "@/app/ui/quotations/create-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchCustomers } from "@/app/lib/customer-actions/customer-data";
import { fetchProducts } from "@/app/lib/products-actions/products-data";
import { fetchBillingDetailsField } from "@/app/lib/billing-details-actions/billing-details-data";
import { Metadata } from "next";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Create Quotation",
};

export default async function Page({ params }: { params: { locale: Locale } }) {
  const [customers, products, billingDetails, locale] = await Promise.all([
    fetchCustomers(),
    fetchProducts(),
    fetchBillingDetailsField(),
    Promise.resolve(params.locale),
  ]);
  const dict = await getDictionary(locale ?? "es");

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: dict.quotations.title, href: "/dashboard/quotations" },
          {
            label: dict.quotations.createQuotation,
            href: "/dashboard/quotations/create",
            active: true,
          },
        ]}
      />
      <Form
        customers={customers}
        products={products}
        billingDetails={billingDetails}
        dict={dict}
      />
    </main>
  );
}
