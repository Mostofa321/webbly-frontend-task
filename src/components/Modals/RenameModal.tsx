"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { Edit2, AlertCircle } from "lucide-react";
import type { WorkspaceItem, ValidationResult } from "../../types/workspace";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface RenameModalDialogProps {
  item: WorkspaceItem;
  onClose: () => void;
  onRename: (id: string, newName: string) => ValidationResult;
}

const RenameModalDialog: React.FC<RenameModalDialogProps> = ({
  item,
  onClose,
  onRename,
}) => {
  const [name, setName] = useState(item.name);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const dotIndex = item.name.lastIndexOf(".");
      if (item.type === "file" && dotIndex > 0) {
        inputRef.current.setSelectionRange(0, dotIndex);
      } else {
        inputRef.current.select();
      }
    }
  }, [item.name, item.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === item.name) {
      onClose();
      return;
    }

    const result = onRename(item.id, name);
    if (!result.isValid) {
      setErrorMessage(result.error || "Invalid name.");
    } else {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay onClick={onClose} />
      <DialogContent onClose={onClose} aria-labelledby="rename-modal-title">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-base font-semibold text-text-primary">
            <Edit2 size={20} className="text-primary-500" />
            <DialogTitle id="rename-modal-title">
              Rename {item.type === "folder" ? "Folder" : "File"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="rename-item-name">
                New Name
              </Label>
              <Input
                ref={inputRef}
                id="rename-item-name"
                type="text"
                className={
                  errorMessage
                    ? "border-danger-500 ring-2 ring-danger-500/20 focus-visible:border-danger-500 focus-visible:ring-danger-500/20"
                    : ""
                }
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                autoComplete="off"
              />
              {errorMessage && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-danger-500 font-medium">
                  <AlertCircle size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              id="confirm-rename-btn"
            >
              Save Name
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const RenameModal: React.FC = () => {
  const { renameModal, closeRenameModal, renameItem } = useWorkspace();

  if (!renameModal.isOpen || !renameModal.item) return null;

  return (
    <RenameModalDialog
      key={renameModal.item.id}
      item={renameModal.item}
      onClose={closeRenameModal}
      onRename={renameItem}
    />
  );
};
