"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

interface SearchableSelectOption {
  id: string;
  name: string;
  [key: string]: any;
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
  disabled?: boolean;
  noSearch?: boolean; // opcional si quieres un dropdown sin barra de búsqueda
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
  disabled = false,
  noSearch = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const defaultFilterFunction = (
    option: SearchableSelectOption,
    term: string
  ) => option.name.toLowerCase().includes(term.toLowerCase());

  const filteredOptions = options.filter((option) =>
    (filterFunction || defaultFilterFunction)(option, searchTerm)
  );

  const selectedOption = options.find((opt) => opt.id === value);

  const getOptionLabel = (option: SearchableSelectOption) =>
    formatOptionLabel ? formatOptionLabel(option) : option.name;

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
    setActiveIndex(null);
  };

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        isOpen &&
        buttonRef.current &&
        listRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        !listRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }
    window.addEventListener("mousedown", handleOutside);
    return () => window.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  // Enfocar el input al abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Manejo básico de teclado en el botón
  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  // Manejo de teclado dentro del input de búsqueda / lista
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
      buttonRef.current?.focus();
      return;
    }
    // Opcional: navegación con flechas
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null ? 0 : Math.min(prev + 1, filteredOptions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null ? filteredOptions.length - 1 : Math.max(prev - 1, 0)
      );
    } else if (e.key === "Enter") {
      if (activeIndex !== null && filteredOptions[activeIndex]) {
        e.preventDefault();
        onSelect(filteredOptions[activeIndex].id);
        closeDropdown();
        buttonRef.current?.focus();
      }
    }
  };

  return (
    <div className={clsx("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "searchable-select-list" : undefined}
        className={clsx(
          "relative block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-8 text-sm text-left",
          "outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
          isOpen && "ring-2 ring-blue-200 border-blue-500"
        )}
      >
        <span
          className={clsx(
            "absolute left-3 top-1/2 -translate-y-1/2",
            "text-gray-400"
          )}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
        </span>
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
        <div
          ref={listRef}
          className="absolute z-20 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200"
        >
          {!noSearch && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setActiveIndex(null);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  autoFocus
                />
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}

          <div
            id="searchable-select-list"
            role="listbox"
            aria-activedescendant={
              activeIndex !== null && filteredOptions[activeIndex]
                ? `option-${filteredOptions[activeIndex].id}`
                : undefined
            }
            className="max-h-60 overflow-auto"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = option.id === value;
                const isActive = idx === activeIndex;
                return (
                  <button
                    id={`option-${option.id}`}
                    key={option.id}
                    role="option"
                    aria-selected={isSelected}
                    type="button"
                    onClick={() => {
                      onSelect(option.id);
                      closeDropdown();
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={clsx(
                      "block w-full px-3 py-2 text-left text-sm",
                      "transition-colors",
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : isActive
                        ? "bg-gray-100"
                        : "hover:bg-gray-100",
                      "focus:bg-gray-100"
                    )}
                  >
                    {getOptionLabel(option)}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
