import Table from "@/app/ui/products/table";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/quotations/pagination";
import Search from "@/app/ui/search";
import { Metadata } from "next";
import { Suspense } from "react";
import { fetchFilteredProducts } from "@/app/lib/products-actions/products-data";
import { CreateProduct } from "@/app/ui/products/buttons";
import FlashFromQuery from "@/app/ui/flash-from-query";
import { ProductsTableInlineSkeleton } from "@/app/ui/skeletons";
import { getDictionary, type Dictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Products",
};
export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  params: { lang: string };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const { totalPages } = await fetchFilteredProducts(query, currentPage);
  const dict: Dictionary = await getDictionary(params.lang as "es" | "en");

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {dict.products.title}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search products..." />
        <CreateProduct lang={params.lang} />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<ProductsTableInlineSkeleton />}
      >
        <FlashFromQuery entity="producto" clearToPath="/dashboard/products" />
        <Table query={query} currentPage={currentPage} lang={params.lang} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
