import { UpdateProduct } from "@/app/ui/products/buttons"; // Solo UpdateProduct
import { fetchFilteredProducts } from "@/app/lib/products-actions/products-data";
import Image from "next/image";
import { formatCurrency, truncate } from "@/app/lib/utils";
import ConfirmDeleteButton from "@/app/ui/confirm-delete-button";
import { deleteProduct } from "@/app/lib/products-actions/products-actions";

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = (await fetchFilteredProducts(query, currentPage)).products;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Condición para cuando no hay productos */}
          {!products || products.length === 0 ? (
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-900">
                  No hay productos
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {query
                    ? `No se encontraron productos para "${query}"`
                    : "Comienza agregando tu primer producto"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* ========== VISTA MÓVIL ========== */}
              <div className="md:hidden space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="w-full rounded-lg bg-white p-4 shadow-sm border border-gray-200"
                  >
                    {/* Encabezado */}
                    <div className="pb-3 border-b border-gray-200">
                      <p className="text-sm">
                        <span className="font-semibold text-blue-600">
                          #{product.id}
                        </span>
                      </p>
                    </div>
                    {/* ID y título en toda la línea superior */}
                    <div className="mb-3 mt-2">
                      <p className="font-semibold text-gray-900 text-lg leading-tight">
                        {product.name}
                      </p>
                    </div>

                    {/* Marca, descripción e imagen */}
                    <div className="flex items-start gap-3 mb-4">
                      {/* Imagen a la izquierda */}
                      <div className="flex-shrink-0">
                        <Image
                          src={product.image_url}
                          alt={`${product.name}'s picture`}
                          className="rounded-lg object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                      {/* Información a la derecha */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          {product.brand}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {truncate(product.description, 80)}
                        </p>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-start">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            Precio
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(Number(product.price))}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1 ">
                            Stock
                          </p>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${
                              product.quantity > 10
                                ? "bg-green-100 text-green-800"
                                : product.quantity > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Botones en la parte inferior */}
                      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                        <UpdateProduct id={product.id} />
                        <ConfirmDeleteButton
                          itemId={product.id}
                          deleteAction={deleteProduct}
                          entityName="producto"
                          itemName={`${product.name} - ${product.brand}`}
                        />
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
                        className="px-4 py-5 font-medium sm:pl-6 min-w-[80px]"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-5 font-medium min-w-[80px]"
                      >
                        Imagen
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-5 font-medium min-w-[150px]"
                      >
                        Producto
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[120px] hidden lg:table-cell"
                      >
                        Marca
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-5 font-medium min-w-[200px] hidden xl:table-cell"
                      >
                        Descripción
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-5 font-medium min-w-[100px]"
                      >
                        Precio
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-5 font-medium min-w-[80px]"
                      >
                        Stock
                      </th>
                      <th className="px-3 py-5 font-medium text-left min-w-[120px]">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                      >
                        <td className="whitespace-nowrap px-4 py-3 sm:pl-6">
                          <span className="font-semibold text-blue-600">
                            #{product.id}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <Image
                            src={product.image_url}
                            alt={`${product.name}'s picture`}
                            className="rounded-lg object-cover"
                            width={48}
                            height={48}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-[150px]">
                            <p className="font-medium">{product.name}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden lg:table-cell">
                          <div className="max-w-[120px]">
                            <p className="truncate font-medium text-gray-600">
                              {product.brand}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 py-3 hidden xl:table-cell">
                          <div className="max-w-[200px]">
                            <p className="text-sm text-gray-500">
                              {truncate(product.description, 80)}
                            </p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="font-medium text-green-600">
                            {formatCurrency(Number(product.price))}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.quantity > 10
                                ? "bg-green-100 text-green-800"
                                : product.quantity > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-3 px-3">
                          <div className="flex items-center gap-2">
                            <UpdateProduct id={product.id} />
                            <ConfirmDeleteButton
                              itemId={product.id}
                              deleteAction={deleteProduct}
                              entityName="producto"
                              itemName={`${product.name} - ${product.brand}`}
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
