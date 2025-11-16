import CardWrapper from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import { GetServerSideProps, Metadata } from "next";
import { Dictionary, getDictionary } from "@/app/lib/dictionaries";

export const metadata: Metadata = {
  title: "Dashboard",
};

import { Suspense } from "react";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardSkeleton,
} from "@/app/ui/skeletons";
import { Locale } from "@/app/lib/i18n";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale || "es");

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {dict.dashboard.title}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper dict={dict} />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart dict={dict} />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices dict={dict} />
        </Suspense>
      </div>
    </main>
  );
}
