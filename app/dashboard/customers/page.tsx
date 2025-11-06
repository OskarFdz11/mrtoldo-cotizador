import { fetchFilteredCustomers } from "@/app/lib/customer-actions/customer-data";
import Table from "@/app/ui/customers/table";
import { lusitana } from "@/app/ui/fonts";
import { CreateCustomer } from "@/app/ui/customers/buttons";
import Pagination from "@/app/ui/quotations/pagination";
import Search from "@/app/ui/search";
import { Metadata } from "next";
import { Suspense } from "react";
import FlashFromQuery from "@/app/ui/flash-from-query";
import { CustomersTableInlineSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Customers",
};
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const { totalPages } = await fetchFilteredCustomers(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<CustomersTableInlineSkeleton rows={8} />}
      >
        <FlashFromQuery entity="cliente" clearToPath="/dashboard/customers" />
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
