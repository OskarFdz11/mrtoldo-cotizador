import EditQuotationForm from "@/app/ui/quotations/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchQuotationById } from "@/app/lib/quotations-actions/quotations-data";
import { fetchCustomers } from "@/app/lib/customer-actions/customer-data";
import { fetchProducts } from "@/app/lib/products-actions/products-data";
import { fetchBillingDetailsField } from "@/app/lib/billing-details-actions/billing-details-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Edit Quotation",
};

export default async function Page(props: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const params = await props.params;
  const id = params.id;
  const locale = params.locale;

  const [quotation, customers, products, billingDetails, dict] =
    await Promise.all([
      fetchQuotationById(id),
      fetchCustomers(),
      fetchProducts(),
      fetchBillingDetailsField(),
      getDictionary(locale ?? "es"),
    ]);

  if (!quotation) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: dict.quotations.title, href: "/dashboard/quotations" },
          {
            label: dict.quotations.editQuotation,
            href: `/dashboard/quotations/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditQuotationForm
        quotation={quotation}
        customers={customers}
        products={products}
        billingDetails={billingDetails}
        dict={dict}
      />
    </main>
  );
}
