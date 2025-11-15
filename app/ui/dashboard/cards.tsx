import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/quotations-actions/quotations-data";
import { formatCurrency, formatNumber } from "@/app/lib/utils";
import { getDictionary, type Dictionary } from "@/app/lib/dictionaries";

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper({ lang }: { lang: string }) {
  const {
    totalPaidQuotations,
    totalPendingQuotations,
    numberOfQuotations,
    numberOfCustomers,
  } = await fetchCardData();

  const dict: Dictionary = await getDictionary(lang as "es" | "en");
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      <Card
        title={dict.dashboard.totalCollected}
        value={formatCurrency(totalPaidQuotations)}
        type="collected"
      />
      <Card
        title={dict.dashboard.totalPending}
        value={formatCurrency(totalPendingQuotations)}
        type="pending"
      />
      <Card
        title={dict.dashboard.totalQuotations}
        value={formatNumber(numberOfQuotations)}
        type="invoices"
      />
      <Card
        title={dict.dashboard.totalCustomers}
        value={formatNumber(numberOfCustomers)}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
