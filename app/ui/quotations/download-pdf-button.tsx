"use client";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

interface DownloadPDFButtonProps {
  quotationId: number;
  customerName: string;
  hideText?: boolean;
  dict?: Dictionary; // opcional si quieres inyectar dict directamente
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
}

export default function DownloadPDFButton({
  quotationId,
  customerName,
  hideText = false,
  dict: dictProp,
}: DownloadPDFButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { dict: contextDict, locale } = useI18n();
  const dict = dictProp || contextDict;

  // Labels traducidos
  const tDownload = dict.quotations?.download || "Descargar";
  const tDownloading = dict.quotations?.downloadingPdf || "Descargando...";
  const tGenerating = dict.quotations?.generating || "Generando...";
  const tTitleReady = dict.quotations?.downloadPdf || "Descargar PDF";
  const tTitleGenerating = dict.quotations?.generatingPdf || "Generando PDF...";
  const tErrorNotPdf =
    dict.quotations?.notValidPdf || "La respuesta no es un PDF válido";
  const tErrorDownload =
    dict.quotations?.downloadError || "Error al descargar el PDF";

  // Prefijo del archivo: usa singular de cotización si existe, si no, filePrefix o fallback por idioma
  const filePrefix =
    dict.quotations?.quotation ||
    dict.quotations?.filePrefix ||
    (locale === "en" ? "quotation" : "cotizacion");

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(`/api/quotations/${quotationId}/pdf`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/pdf")) {
        throw new Error(tErrorNotPdf);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filePrefix}-${quotationId}-${slugify(customerName)}.pdf`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert(tErrorDownload);
    } finally {
      setIsDownloading(false);
    }
  };

  const title = isDownloading ? tTitleGenerating : tTitleReady;

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title={title}
      aria-busy={isDownloading}
      aria-label={isDownloading ? tTitleGenerating : tTitleReady}
    >
      {isDownloading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {tGenerating}
        </>
      ) : (
        <>
          <DocumentArrowDownIcon className="h-4 w-4" />
          {!hideText && (
            <span className="hidden sm:block ml-2">{tDownload}</span>
          )}
        </>
      )}
    </button>
  );
}
