import EditQuotationForm from "@/app/ui/quotations/edit-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchQuotationById } from "@/app/lib/quotations-actions/quotations-data";
import { fetchCustomers } from "@/app/lib/customer-actions/customer-data";
import { fetchProducts } from "@/app/lib/products-actions/products-data";
import { fetchBillingDetailsField } from "@/app/lib/billing-details-actions/billing-details-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Quotation",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [quotation, customers, products, billingDetails] = await Promise.all([
    fetchQuotationById(id),
    fetchCustomers(),
    fetchProducts(),
    fetchBillingDetailsField(),
  ]);

  if (!quotation) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Quotations", href: "/dashboard/quotations" },
          {
            label: "Edit Quotation",
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
      />
    </main>
  );
}
