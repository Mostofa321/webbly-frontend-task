"use client";

import React from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { Trash2, AlertTriangle, Folder, FileText } from "lucide-react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteModal: React.FC = () => {
  const { deleteModal, closeDeleteModal, deleteItem } = useWorkspace();
  const { isOpen, item, descendantCount } = deleteModal;

  if (!isOpen || !item) return null;

  const isFolder = item.type === "folder";

  const handleConfirm = () => {
    deleteItem(item.id);
    closeDeleteModal();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && closeDeleteModal()}>
      <DialogOverlay onClick={closeDeleteModal} />
      <DialogContent onClose={closeDeleteModal} aria-labelledby="delete-modal-title">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-base font-semibold text-danger-500">
            <AlertTriangle size={20} />
            <DialogTitle id="delete-modal-title">
              Delete {isFolder ? "Folder" : "File"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-hover/60 rounded-xl border border-border-subtle">
            <div className="shrink-0 flex items-center justify-center">
              {isFolder ? (
                <Folder size={24} className="text-folder-500" />
              ) : (
                <FileText size={24} className="text-file-500" />
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-text-primary truncate">{item.name}</span>
              <span className="text-xs text-text-muted uppercase tracking-wider">{item.type}</span>
            </div>
          </div>

          <p className="text-sm text-text-primary">
            Are you sure you want to delete this {item.type}?
          </p>

          {isFolder && descendantCount > 0 && (
            <div className="flex items-start gap-2.5 p-3.5 bg-danger-50 border border-danger-500/25 rounded-xl text-danger-600 text-xs leading-relaxed">
              <AlertTriangle size={18} className="text-danger-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">Recursive Deletion Warning:</strong>
                <p>
                  This folder contains{" "}
                  <strong>
                    {descendantCount} nested {descendantCount === 1 ? "item" : "items"}
                  </strong>
                  . Deleting this folder will permanently remove all of its nested
                  subfolders and files.
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-text-muted italic">This action cannot be undone.</p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={closeDeleteModal}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            id="confirm-delete-btn"
          >
            <Trash2 size={15} />
            <span>Delete Permanently</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
