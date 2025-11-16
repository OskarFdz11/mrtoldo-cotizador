import { formatCurrencyCompact, generateYAxis } from "@/app/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchRevenue } from "@/app/lib/quotations-actions/quotations-data";
import { getDictionary, type Dictionary } from "@/app/lib/dictionaries";
import { useRouter } from "next/router";

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart({ dict }: { dict: Dictionary }) {
  const revenue = await fetchRevenue();

  const chartHeight = 350;

  // Filtrar datos válidos
  const validRevenue = revenue.filter(
    (item) => !isNaN(item.revenue) && item.revenue > 0
  );

  if (!validRevenue || validRevenue.length === 0) {
    return (
      <div className="w-full md:col-span-4">
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          {dict.dashboard.recentRevenue}
        </h2>
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mt-4 text-gray-400 text-center py-8">
            {dict.dashboard.noData}
          </p>
        </div>
      </div>
    );
  }

  const { yAxisLabels, topLabel } = generateYAxis(validRevenue);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        {dict.dashboard.recentRevenue}
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-end gap-4 rounded-md bg-white p-4">
          {/* Eje Y con ancho fijo y separación clara */}
          <div
            className="hidden sm:flex flex-col justify-between text-sm text-gray-400 w-12 text-right flex-shrink-0"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{formatCurrencyCompact(Number(label))}</p>
            ))}
          </div>

          {/* Contenedor de las barras con flex-grow */}
          <div
            className="flex-1 flex items-end justify-start gap-4 md:gap-3 mt-4"
            style={{ height: `${chartHeight}px` }}
          >
            {validRevenue.map((month, index) => (
              <div
                key={month.month || index}
                className="flex flex-col items-center justify-end w-10 md:w-12 pt-4"
              >
                <div
                  className="w-full rounded-md bg-blue-300"
                  style={{
                    height: `${(chartHeight / topLabel) * month.revenue}px`,
                  }}
                ></div>
                <p className="mt-1 w-full text-center text-[11px] sm:text-xs text-gray-500">
                  {month.month}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">
            {dict.dashboard.lastTwelveMonths}
          </h3>
        </div>
      </div>
    </div>
  );
}
