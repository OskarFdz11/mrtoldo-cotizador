import Breadcrumbs from "@/app/ui/quotations/breadcrumbs";
import { fetchCustomers } from "@/app/lib/customer-actions/customer-data";
import { Metadata } from "next";
import CreateCustomerForm from "@/app/ui/customers/create-customer-form";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Create Customer",
};

export default async function Page({ params }: { params: { locale: Locale } }) {
  const { locale } = await Promise.resolve(params);
  const dict = await getDictionary(locale ?? "es");
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: dict.customers.title, href: "/dashboard/customers" },
          {
            label: dict.customers.createCustomer,
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      <CreateCustomerForm customers={customers} dict={dict} />
    </main>
  );
}
