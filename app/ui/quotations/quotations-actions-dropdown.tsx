"use client";

import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  deleteQuotation,
  duplicateQuotation,
} from "@/app/lib/quotations-actions/quotations-actions";
import { useRouter } from "next/navigation";
import SuccessModal from "@/app/ui/success-modal";
import ConfirmDeleteModal from "@/app/ui/confirm-delete-modal";
import { useI18n } from "@/app/ui/i18n-provider";
import type { Dictionary } from "@/app/lib/dictionaries";

interface QuotationActionsProps {
  quotationId: number;
  customerName: string;
  customerLastName?: string;
  dict?: Dictionary; // opcional si quieres inyectar directamente
}

export default function QuotationActions({
  quotationId,
  customerName,
  customerLastName,
  dict: dictProp,
}: QuotationActionsProps) {
  const router = useRouter();
  const { dict: contextDict, locale } = useI18n();
  const dict = dictProp || contextDict;

  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateSuccessModal, setShowDuplicateSuccessModal] =
    useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [newQuotationId, setNewQuotationId] = useState<number | null>(null);

  // Labels traducidos
  const editLabel = dict.quotations?.edit || "Editar";
  const duplicateLabel = dict.quotations?.duplicate || "Duplicar";
  const duplicatingLabel = dict.quotations?.duplicating || "Duplicando...";
  const deleteLabel = dict.quotations?.delete || "Eliminar";
  const deletingLabel = dict.quotations?.deleting || "Eliminando...";
  const confirmDeleteTitle =
    dict.quotations?.confirmDeleteTitle || "¿Eliminar cotización?";
  const confirmDeleteMessage =
    dict.quotations?.confirmDeleteMessage ||
    "Esta acción no se puede deshacer.";

  const duplicateSuccessTitle =
    dict.quotations?.duplicateSuccessTitle || "¡Cotización duplicada!";
  const duplicateSuccessMessageTemplate =
    dict.quotations?.duplicateSuccessMessage || "Nueva cotización creada: {id}";

  const deleteSuccessTitle =
    dict.quotations?.deleteSuccessTitle || "¡Cotización eliminada!";
  const deleteSuccessMessageTemplate =
    dict.quotations?.deleteSuccessMessage ||
    "La cotización {id} se eliminó correctamente.";

  const itemDisplayName = `#${quotationId} — ${customerName} ${
    customerLastName || ""
  }`.trim();

  const handleEdit = () => {
    router.push(`/${locale}/dashboard/quotations/${quotationId}/edit`);
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const response = await duplicateQuotation(quotationId);
      if (response && response.success && response.quotationId) {
        setNewQuotationId(response.quotationId);
        setShowDuplicateSuccessModal(true);
      } else {
        alert(
          response?.message ||
            dict.forms?.error ||
            "Error al duplicar la cotización"
        );
      }
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteQuotation(quotationId);
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      router.refresh();
    } catch {
      alert(dict.forms?.error || "Error al eliminar la cotización");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const duplicateSuccessMessage = newQuotationId
    ? duplicateSuccessMessageTemplate.replace("{id}", `#${newQuotationId}`)
    : duplicateSuccessMessageTemplate.replace("{id}", "");

  const deleteSuccessMessage = deleteSuccessMessageTemplate.replace(
    "{id}",
    `#${quotationId}`
  );

  return (
    <>
      <Menu as="div" className="relative inline-block">
        <MenuButton
          aria-label={dict.common?.actions || "Acciones"}
          className="rounded-md border p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-500 transition-colors"
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </MenuButton>

        <MenuItems
          anchor="bottom end"
          transition
          className="absolute right-0 z-[60] mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 border border-gray-200 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <MenuItem>
            <button
              onClick={handleEdit}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-none transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-3" />
              {editLabel}
            </button>
          </MenuItem>

          <MenuItem>
            <button
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-none disabled:opacity-50 transition-colors"
            >
              {isDuplicating ? (
                <span className="flex items-center">
                  <span className="w-4 h-4 mr-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  {duplicatingLabel}
                </span>
              ) : (
                <>
                  <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                  {duplicateLabel}
                </>
              )}
            </button>
          </MenuItem>

          <MenuItem>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 data-focus:bg-red-50 data-focus:outline-none disabled:opacity-50 transition-colors"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <span className="w-4 h-4 mr-3 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                  {deletingLabel}
                </span>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4 mr-3" />
                  {deleteLabel}
                </>
              )}
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      {/* Modal eliminar */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={confirmDeleteTitle}
        message={confirmDeleteMessage}
        itemName={itemDisplayName}
        isLoading={isDeleting}
        confirmLabel={dict.quotations?.delete || "Eliminar"}
        cancelLabel={dict.common?.cancel || "Cancelar"}
      />

      {/* Modal duplicar éxito */}
      <SuccessModal
        isOpen={showDuplicateSuccessModal}
        onClose={() => {
          setShowDuplicateSuccessModal(false);
          setNewQuotationId(null);
          router.refresh();
        }}
        title={duplicateSuccessTitle}
        message={duplicateSuccessMessage}
        autoCloseTime={3000}
      />

      {/* Modal eliminar éxito */}
      <SuccessModal
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
        title={deleteSuccessTitle}
        message={deleteSuccessMessage}
        autoCloseTime={2000}
      />
    </>
  );
}
