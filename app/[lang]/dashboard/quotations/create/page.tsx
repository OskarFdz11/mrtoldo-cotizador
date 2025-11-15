import Form from "@/app/ui/quotations/create-form";
import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchCustomers } from "@/app/lib/customer-actions/customer-data";
import { fetchProducts } from "@/app/lib/products-actions/products-data";
import { fetchBillingDetailsField } from "@/app/lib/billing-details-actions/billing-details-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Quotation",
};

export default async function Page() {
  const [customers, products, billingDetails] = await Promise.all([
    fetchCustomers(),
    fetchProducts(),
    fetchBillingDetailsField(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Quotations", href: "/dashboard/quotations" },
          {
            label: "Create Quotation",
            href: "/dashboard/quotations/create",
            active: true,
          },
        ]}
      />
      <Form
        customers={customers}
        products={products}
        billingDetails={billingDetails}
      />
    </main>
  );
}
