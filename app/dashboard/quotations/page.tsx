import Pagination from "@/app/ui/quotations/pagination";
import Search from "@/app/ui/search";
import QuotationsTable from "@/app/ui/quotations/table";
import { CreateQuotation } from "@/app/ui/quotations/buttons";
import { lusitana } from "@/app/ui/fonts";
import { QuotationsTableInlineSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchQuotationsPages } from "@/app/lib/quotations-actions/quotations-data";
import { Metadata } from "next";
import FlashFromQuery from "@/app/ui/flash-from-query";

export const metadata: Metadata = {
  title: "Quotations",
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
  const totalPages = await fetchQuotationsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Quotations</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search quotations..." />
        <CreateQuotation />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<QuotationsTableInlineSkeleton />}
      >
        <FlashFromQuery
          entity="cotización"
          gender="f"
          clearToPath="/dashboard/quotations"
        />
        <QuotationsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
