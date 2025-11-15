import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { lusitana } from "@/app/ui/fonts";
import { fetchLatestQuotations } from "@/app/lib/quotations-actions/quotations-data";
import { formatCurrency } from "@/app/lib/utils";
import { getDictionary, type Dictionary } from "@/app/lib/dictionaries";

export default async function LatestInvoices({ lang }: { lang: string }) {
  const latestInvoices = await fetchLatestQuotations();
  const dict: Dictionary = await getDictionary(lang as "es" | "en");
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {dict.dashboard.lastQuotations}
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white px-6">
          {latestInvoices.map((quotation, i) => {
            const total = quotation.total;

            return (
              <div
                key={quotation.id}
                className={clsx(
                  "grid grid-cols-[44px,1fr,auto] items-center gap-3 sm:gap-6 py-3 sm:py-4",
                  { "border-t": i !== 0 }
                )}
              >
                <span className="text-xs font-medium text-gray-500 shrink-0">
                  #{quotation.id}
                </span>

                {/* Nombre + empresa (+ email en lg+) */}
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {quotation.customer.name} {quotation.customer.lastname}
                  </p>
                  <p className="truncate text-xs text-gray-500 md:text-sm">
                    {quotation.customer.company}
                  </p>
                  <p className="truncate text-xs text-gray-500 hidden lg:block">
                    {quotation.customer.email}
                  </p>
                </div>

                <p
                  className={`${lusitana.className} text-sm md:text-base text-right whitespace-nowrap shrink-0`}
                >
                  {formatCurrency(total)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">
            {dict.dashboard.updatedAt}
          </h3>
        </div>
      </div>
    </div>
  );
}
