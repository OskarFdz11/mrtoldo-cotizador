import Table from "@/app/ui/billing-details/table";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/quotations/pagination";
import Search from "@/app/ui/search";
import { BillingDetailsTableInlineSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchFilteredBillingDetails } from "@/app/lib/billing-details-actions/billing-details-data";
import { CreateBillingDetails } from "@/app/ui/billing-details/buttons";
import FlashFromQuery from "@/app/ui/flash-from-query";
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Billing Details",
};
export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
  params: Promise<{ locale: Locale }>;
}) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const dict = await getDictionary(locale ?? "es");
  const query = sp?.query || "";
  const currentPage = Number(sp?.page) || 1;
  const { totalPages } = await fetchFilteredBillingDetails(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {dict.billingDetails.title}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={dict.billingDetails.searchPlaceholder} />
        <CreateBillingDetails dict={dict} />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<BillingDetailsTableInlineSkeleton />}
      >
        <FlashFromQuery
          entity="detalles de pago"
          clearToPath="/dashboard/billing-details"
        />
        <Table query={query} currentPage={currentPage} dict={dict} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
