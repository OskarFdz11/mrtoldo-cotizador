// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="rounded-xl bg-gray-100 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
        <div className="bg-white px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function MobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

function RowDivider() {
  return <div className="col-span-full h-px bg-gray-100" />;
}
function Pill({ w = "w-12" }: { w?: string }) {
  return <div className={`h-5 ${w} rounded-full bg-gray-200`} />;
}

export function QuotationsTableInlineSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      {/* Header */}
      <div className="grid grid-cols-[44px,2fr,1.4fr,1fr,1fr,70px,1.4fr,110px,120px] items-center gap-3 border-b px-4 py-3">
        {[
          "w-6", // ID
          "w-28 md:w-40", // Cliente
          "w-28 md:w-40", // Empresa
          "w-16 md:w-20", // Subtotal
          "w-16 md:w-20", // Total
          "w-10", // IVA
          "w-20 md:w-28", // Fecha
          "w-16", // Estado
          "w-20", // Acciones
        ].map((w, i) => (
          <div key={i} className={`h-4 rounded bg-gray-100 ${w}`} />
        ))}
      </div>

      {/* Rows */}
      <ul className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[44px,2fr,1.4fr,1fr,1fr,70px,1.4fr,110px,120px] items-center gap-3 px-4 py-3"
          >
            {/* ID */}
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />

            {/* Cliente (nombre + email) */}
            <div className="min-w-0">
              <div className="h-4 w-28 md:w-44 animate-pulse rounded bg-gray-200" />
              <div className="mt-1 h-3 w-32 md:w-56 animate-pulse rounded bg-gray-100" />
            </div>

            {/* Empresa */}
            <div className="h-4 w-28 md:w-48 animate-pulse rounded bg-gray-200" />

            {/* Subtotal */}
            <div className="h-4 w-16 md:w-20 animate-pulse rounded bg-gray-200" />

            {/* Total */}
            <div className="h-4 w-16 md:w-20 animate-pulse rounded bg-gray-200" />

            {/* IVA (pill) */}
            <div className="flex items-center">
              <Pill w="w-12" />
            </div>

            {/* Fecha */}
            <div className="h-4 w-24 md:w-28 animate-pulse rounded bg-gray-200" />

            {/* Estado (pill) */}
            <div className="flex items-center justify-start">
              <Pill w="w-14" />
            </div>

            {/* Acciones (botón principal simulado) */}
            <div className="ml-auto flex items-center gap-2">
              <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200" />
              <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const CustomersTableInlineSkeleton = ({
  rows = 8,
}: {
  rows?: number;
}) => {
  const headerCols = [
    "w-12", // ID
    "w-36 md:w-44", // Nombre
    "w-36 md:w-44", // Apellido
    "w-40 md:w-60", // Email
    "w-40 md:w-60", // Empresa
    "w-28 md:w-36", // RFC
    "w-24 md:w-28", // Teléfono
    "w-24", // Acciones
  ];

  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="mt-4 overflow-hidden rounded-lg bg-white">
        {/* Header */}
        <div className="grid grid-cols-[44px,1.3fr,1.3fr,2fr,2fr,1.2fr,1.2fr,110px] items-center gap-3 border-b px-4 py-3">
          {headerCols.map((w, i) => (
            <div key={i} className={`h-4 rounded bg-gray-100 ${w}`} />
          ))}
        </div>

        {/* Rows */}
        <ul className="divide-y">
          {Array.from({ length: rows }).map((_, idx) => (
            <li
              key={idx}
              className="grid grid-cols-[44px,1.3fr,1.3fr,2fr,2fr,1.2fr,1.2fr,110px] items-center gap-3 px-4 py-3"
            >
              {/* ID */}
              <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
              {/* Nombre */}
              <div className="h-4 w-28 md:w-36 animate-pulse rounded bg-gray-200" />
              {/* Apellido */}
              <div className="h-4 w-28 md:w-36 animate-pulse rounded bg-gray-200" />
              {/* Email */}
              <div className="h-4 w-40 md:w-64 animate-pulse rounded bg-gray-200" />
              {/* Empresa */}
              <div className="h-4 w-40 md:w-64 animate-pulse rounded bg-gray-200" />
              {/* RFC */}
              <div className="h-4 w-24 md:w-36 animate-pulse rounded bg-gray-200" />
              {/* Teléfono */}
              <div className="h-4 w-20 md:w-28 animate-pulse rounded bg-gray-200" />
              {/* Estado */}
              <div className="h-4 w-20 md:w-28 animate-pulse rounded bg-gray-200" />
              {/* Acciones */}
              <div className="flex items-center justify-end gap-2">
                <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
                <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export function ProductsTableInlineSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      {/* Header */}
      <div className="grid grid-cols-[44px,72px,2fr,1fr,2fr,1fr,90px,110px] items-center gap-3 border-b px-4 py-3">
        {["w-6", "w-10", "w-32", "w-20", "w-32", "w-16", "w-10", "w-16"].map(
          (w, i) => (
            <div key={i} className={`h-4 rounded bg-gray-100 ${w}`} />
          )
        )}
      </div>

      {/* Rows */}
      <ul className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[44px,72px,2fr,1fr,2fr,1fr,90px,110px] items-center gap-3 px-4 py-3"
          >
            {/* ID */}
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />

            {/* Imagen */}
            <div className="h-10 w-10 animate-pulse rounded-md bg-gray-200" />

            {/* Producto */}
            <div className="h-4 w-40 md:w-64 animate-pulse rounded bg-gray-200" />

            {/* Marca */}
            <div className="h-4 w-24 md:w-28 animate-pulse rounded bg-gray-200" />

            {/* Descripción */}
            <div className="h-4 w-48 md:w-80 animate-pulse rounded bg-gray-200" />

            {/* Precio */}
            <div className="h-4 w-16 md:w-24 animate-pulse rounded bg-gray-200" />

            {/* Stock (pill) */}
            <div className="flex items-center">
              <Pill w="w-10" />
            </div>

            {/* Acciones */}
            <div className="ml-auto flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
              <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoriesTableInlineSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <div className="grid grid-cols-[44px,2fr,3fr,110px] items-center gap-3 border-b px-4 py-3">
        {["w-6", "w-28 md:w-44", "w-40 md:w-80", "w-16"].map((w, i) => (
          <div key={i} className={`h-4 rounded bg-gray-100 ${w}`} />
        ))}
      </div>

      <ul className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[44px,2fr,3fr,110px] items-center gap-3 px-4 py-3"
          >
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-40 md:w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-60 md:w-[28rem] animate-pulse rounded bg-gray-200" />
            <div className="ml-auto flex items-center gap-2">
              <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
              <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BillingDetailsTableInlineSkeleton({
  rows = 4,
}: {
  rows?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <div className="grid grid-cols-[44px,1.2fr,1.2fr,1.6fr,1.2fr,2fr,1.2fr,1.4fr,1.6fr,1.6fr,110px] items-center gap-3 border-b px-4 py-3">
        {[
          "w-6", // ID
          "w-24", // Nombre
          "w-24", // Apellido
          "w-32", // Empresa
          "w-24", // RFC
          "w-40", // Email
          "w-28", // Teléfono
          "w-36", // Num tarjeta
          "w-40", // CLABE
          "w-36", // Cuenta cheques
          "w-16", // Acciones
        ].map((w, i) => (
          <div key={i} className={`h-4 rounded bg-gray-100 ${w}`} />
        ))}
      </div>

      <ul className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <li
            key={i}
            className="grid grid-cols-[44px,1.2fr,1.2fr,1.6fr,1.2fr,2fr,1.2fr,1.4fr,1.6fr,1.6fr,110px] items-center gap-3 px-4 py-3"
          >
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-44 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
            <div className="ml-auto flex items-center gap-2">
              <div className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
              <div className="h-8 w-8 animate-pulse rounded-md bg-gray-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function QuotationsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
            <MobileSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
