// app/ui/searchable-select.tsx
"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

interface SearchableSelectOption {
  id: string;
  name: string;
  [key: string]: any; // Para campos adicionales como email, company, etc.
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onSelect: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  className?: string;
  formatOptionLabel?: (option: SearchableSelectOption) => string;
  filterFunction?: (
    option: SearchableSelectOption,
    searchTerm: string
  ) => boolean;
}

export default function SearchableSelect({
  options,
  value,
  onSelect,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
  formatOptionLabel,
  filterFunction,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Función de filtrado personalizable o por defecto
  const defaultFilterFunction = (
    option: SearchableSelectOption,
    searchTerm: string
  ) => option.name.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredOptions = options.filter((option) =>
    (filterFunction || defaultFilterFunction)(option, searchTerm)
  );

  const selectedOption = options.find((opt) => opt.id === value);

  // Función de formato de label personalizable o por defecto
  const getOptionLabel = (option: SearchableSelectOption) =>
    formatOptionLabel ? formatOptionLabel(option) : option.name;

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "block w-full rounded-md border border-gray-200 py-2 pl-10 pr-8 text-sm text-left outline-2 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          className
        )}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <ChevronDownIcon
          className={clsx(
            "absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div className="fixed inset-0 z-10" onClick={closeDropdown} />

          {/* Dropdown */}
          <div className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
            <div className="p-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded border border-gray-200 py-1 pl-8 pr-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onSelect(option.id);
                      closeDropdown();
                    }}
                    className={clsx(
                      "block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100",
                      option.id === value && "bg-blue-50 text-blue-700"
                    )}
                  >
                    {getOptionLabel(option)}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
