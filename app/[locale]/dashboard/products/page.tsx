import Table from "@/app/ui/products/table";
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/quotations/pagination";
import Search from "@/app/ui/search";
import { GetServerSideProps, Metadata } from "next";
import { Suspense } from "react";
import { fetchFilteredProducts } from "@/app/lib/products-actions/products-data";
import { CreateProduct } from "@/app/ui/products/buttons";
import FlashFromQuery from "@/app/ui/flash-from-query";
import { ProductsTableInlineSkeleton } from "@/app/ui/skeletons";
import { getDictionary, type Dictionary } from "@/app/lib/dictionaries";
import { Locale } from "@/app/lib/i18n";

export const metadata: Metadata = {
  title: "Products",
};
export default async function Page({
  searchParams,
  params,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);
  const dict = await getDictionary(locale ?? "es");
  const query = sp?.query ?? "";
  const currentPage = Number(sp?.page ?? "1");
  const { totalPages } = await fetchFilteredProducts(query, currentPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>
          {dict.products.title}
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={dict.products.searchPlaceholder} />
        <CreateProduct dict={dict} />
      </div>
      <Suspense
        key={query + currentPage}
        fallback={<ProductsTableInlineSkeleton />}
      >
        <FlashFromQuery
          entity="producto"
          clearToPath={`/${locale}/dashboard/products`}
        />
        <Table query={query} currentPage={currentPage} dict={dict} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
