import { UpdateCategory } from "@/app/ui/categories/buttons"; // Solo UpdateCategory
import { fetchFilteredCategories } from "@/app/lib/categories-actions/categories-data";
import ConfirmDeleteButton from "@/app/ui/confirm-delete-button";
import { deleteCategory } from "@/app/lib/categories-actions/categories-actions";
import { Dictionary } from "@/app/lib/dictionaries";

export default async function CategoriesTable({
  query,
  currentPage,
  dict,
}: {
  query: string;
  currentPage: number;
  dict: Dictionary;
}) {
  const categories = (await fetchFilteredCategories(query, currentPage))
    .categories;

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              {/* Condición para cuando no hay categorías */}
              {!categories || categories.length === 0 ? (
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
                      {dict.categories.noCategories}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {query
                        ? dict.categories.noCategoriesFound.replace(
                            "{query}",
                            query
                          )
                        : dict.categories.noCategoriesSubtitle}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile */}
                  <div className="md:hidden">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="mb-2 w-full rounded-md bg-white p-4 border border-gray-200 shadow-sm"
                      >
                        {/* Encabezado */}
                        <div className="pb-3 border-b border-gray-200">
                          <p className="text-sm">
                            <span className="font-semibold text-blue-600">
                              #{category.id}
                            </span>
                          </p>
                        </div>
                        {/* Información */}
                        <div className="space-y-2 mt-2">
                          <p className="font-medium text-gray-900">
                            {category.name}
                          </p>
                          <p className="text-sm text-gray-500 break-words">
                            {category.description}
                          </p>
                        </div>

                        {/* Acciones abajo con separador */}
                        <div className="mt-4 border-t border-gray-200 pt-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-10 w-10 inline-flex items-center justify-center">
                              <UpdateCategory id={category.id} variant="icon" />
                            </div>
                            <div className="h-10 w-10 inline-flex items-center justify-center">
                              <ConfirmDeleteButton
                                itemId={category.id}
                                deleteAction={deleteCategory}
                                entityName="categoría"
                                itemName={category.name}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop */}
                  <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                    <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-5 font-medium min-w-[80px]"
                        >
                          ID
                        </th>
                        <th className="px-4 py-5 font-medium sm:pl-6">
                          {dict.categories.name}
                        </th>
                        <th className="px-3 py-5 font-medium">
                          {dict.categories.description}
                        </th>
                        <th className="px-3 py-5 font-medium text-right">
                          {dict.common.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-900">
                      {categories.map((category) => (
                        <tr
                          key={category.id}
                          className="group hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap bg-white py-5   text-sm font-medium sm:pl-6">
                            <span className="font-semibold text-blue-600">
                              #{category.id}
                            </span>
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm font-medium sm:pl-6">
                            {category.name}
                          </td>
                          <td className="bg-white px-4 py-5 text-sm text-gray-600">
                            <div className="max-w-xs">
                              {category.description}
                            </div>
                          </td>
                          <td className="whitespace-nowrap bg-white py-5 pl-6 pr-3 text-right">
                            <div className="flex justify-end gap-2">
                              <UpdateCategory id={category.id} variant="icon" />
                              <ConfirmDeleteButton
                                itemId={category.id}
                                deleteAction={deleteCategory}
                                entityName="categoría"
                                entityLabel={
                                  dict.categories?.singleTitle || "Categoría"
                                }
                                itemName={category.name}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
