// app/ui/customers/table.tsx
import { UpdateCustomer } from "@/app/ui/customers/buttons";
import { fetchFilteredCustomers } from "@/app/lib/customer-actions/customer-data";
import ConfirmDeleteButton from "@/app/ui/confirm-delete-button";
import { deleteCustomer } from "@/app/lib/customer-actions/customer-actions";
import { Dictionary } from "@/app/lib/dictionaries";

export default async function CustomersTable({
  query,
  currentPage,
  dict,
}: {
  query: string;
  currentPage: number;
  dict: Dictionary;
}) {
  const customers = (await fetchFilteredCustomers(query, currentPage))
    .customers;


  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Condición para cuando no hay customers */}
          {!customers || customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
              <div className="text-gray-400 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"
                  />
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-900">
                  {dict.customers.noCustomers}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {query
                    ? `No se encontraron clientes para "${query}"`
                    : dict.customers.noCustomersSubtitle}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ========== VISTA MÓVIL ========== */}
              <div className="md:hidden space-y-3">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="w-full rounded-lg bg-white p-4 shadow-sm border border-gray-200"
                  >
                    {/* Encabezado */}
                    <div className="pb-3 border-b border-gray-200">
                      <p className="text-sm">
                        <span className="font-semibold text-blue-600">
                          #{customer.id}
                        </span>
                      </p>
                    </div>
                    {/* Información principal */}
                    <div className="space-y-3 mt-3">
                      {/* Nombre con ID */}
                      <div className="pb-2 ">
                        <p className="font-semibold text-gray-900 text-lg leading-tight">
                          {customer.name} {customer.lastname}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            {dict.customers.email}
                          </p>
                          <p className="text-sm text-gray-700 break-all">
                            {customer.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            {dict.customers.company}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {customer.company}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                              {dict.customers.rfc}
                            </p>
                            <p className="text-sm text-gray-700 break-all">
                              {customer.rfc}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                              {dict.customers.phone}
                            </p>
                            <p className="text-sm text-gray-700">
                              {String(customer.phone) === "0" ? "" : String(customer.phone)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Acciones abajo con separador */}
                    <div className="mt-4 border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-10 w-10 inline-flex items-center justify-center">
                          <UpdateCustomer id={customer.id} variant="icon" />
                        </div>
                        <div className="h-10 w-10 inline-flex items-center justify-center">
                          <ConfirmDeleteButton
                            itemId={customer.id}
                            deleteAction={deleteCustomer}
                            entityName="cliente"
                            itemName={`${customer.name} ${customer.lastname}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ========== VISTA TABLET/DESKTOP ========== */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-gray-900">
                  <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[80px]"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px]"
                      >
                        {dict.customers.name}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px]"
                      >
                        {dict.customers.lastname}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[200px]"
                      >
                        {dict.customers.email}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[150px] hidden lg:table-cell"
                      >
                        {dict.customers.company}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px] hidden xl:table-cell"
                      >
                        {dict.customers.rfc}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px] hidden xl:table-cell"
                      >
                        {dict.customers.phone}
                      </th>
                      <th className="px-3 py-5 font-medium text-left min-w-[120px]">
                        {dict.common.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td className="whitespace-nowrap px-3 py-3">
                          <span className="font-semibold text-blue-600">
                            #{customer.id}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <p className="font-medium">{customer.name}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          <p className="font-medium">{customer.lastname}</p>
                        </td>
                        <td className="px-3 py-3">
                          <div className="max-w-[200px]">
                            <p className="truncate text-gray-700">
                              {customer.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <div className="max-w-[150px]">
                            <p className="truncate font-medium">
                              {customer.company}
                            </p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 hidden xl:table-cell">
                          <p className="text-gray-700">{customer.rfc}</p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 hidden xl:table-cell">
                          <p className="text-gray-700">{customer.phone}</p>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3">
                          <div className="flex items-center gap-2">
                            <UpdateCustomer id={customer.id} variant="icon" />
                            <ConfirmDeleteButton
                              itemId={customer.id}
                              deleteAction={deleteCustomer}
                              entityName="cliente"
                              entityLabel={
                                dict.customers?.singleTitle || "Cliente"
                              }
                              itemName={`${customer.name} ${customer.lastname}`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
