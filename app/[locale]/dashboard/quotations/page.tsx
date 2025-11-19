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
import { Locale } from "@/app/lib/i18n";
import { getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Quotations",
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
  const totalPages = await fetchQuotationsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {dict.quotations.title}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={dict.quotations.searchPlaceholder} />
        <CreateQuotation dict={dict} />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<QuotationsTableInlineSkeleton />}
      >
        <FlashFromQuery
          entityKey="quotations"
          clearToPath={`/${locale}/dashboard/quotations`}
        />
        <QuotationsTable query={query} currentPage={currentPage} dict={dict} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
