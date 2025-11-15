import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchCustomers } from "@/app/lib/customer-actions/customer-data";
import { Metadata } from "next";
import CreateCustomerForm from "@/app/ui/customers/create-customer-form";

export const metadata: Metadata = {
  title: "Create Customer",
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Create Customer",
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      <CreateCustomerForm customers={customers} />
    </main>
  );
}
