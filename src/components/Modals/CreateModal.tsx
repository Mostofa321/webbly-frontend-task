"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { getItemFullPath } from "../../utils/treeUtils";
import { FolderPlus, FilePlus, AlertCircle } from "lucide-react";
import type { ItemType, WorkspaceItem, ValidationResult } from "../../types/workspace";
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

interface CreateModalDialogProps {
  type: ItemType;
  parentId: string | null;
  items: WorkspaceItem[];
  onClose: () => void;
  onCreate: (name: string, type: ItemType, parentId: string | null) => ValidationResult;
}

const CreateModalDialog: React.FC<CreateModalDialogProps> = ({
  type,
  parentId,
  items,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState(
    type === "folder" ? "New Folder" : "new-file.txt"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      if (type === "file") {
        inputRef.current.setSelectionRange(0, 8);
      } else {
        inputRef.current.select();
      }
    }
  }, [type]);

  const parentFolder = parentId ? items.find((i) => i.id === parentId) : null;
  const parentPath = parentFolder
    ? getItemFullPath(items, parentFolder)
    : "Workspace (Root)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onCreate(name, type, parentId);
    if (!result.isValid) {
      setErrorMessage(result.error || "Invalid item name.");
    } else {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay onClick={onClose} />
      <DialogContent onClose={onClose} aria-labelledby="create-modal-title">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-base font-semibold text-text-primary">
            {type === "folder" ? (
              <FolderPlus size={20} className="text-folder-500" />
            ) : (
              <FilePlus size={20} className="text-file-500" />
            )}
            <DialogTitle id="create-modal-title">
              Create New {type === "folder" ? "Folder" : "Text File"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-hover/60 p-2.5 rounded-lg border border-border-subtle">
              <span className="font-medium text-text-secondary">Location:</span>
              <span className="truncate font-mono" title={parentPath}>
                {parentPath}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-item-name">
                {type === "folder" ? "Folder Name" : "File Name"}
              </Label>
              <Input
                ref={inputRef}
                id="create-item-name"
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
                placeholder={
                  type === "folder" ? "e.g. Components" : "e.g. notes.txt"
                }
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
              id="confirm-create-btn"
            >
              Create {type === "folder" ? "Folder" : "File"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const CreateModal: React.FC = () => {
  const { items, createModal, closeCreateModal, createItem } = useWorkspace();

  if (!createModal.isOpen) return null;

  return (
    <CreateModalDialog
      key={`${createModal.type}-${createModal.parentId ?? "root"}`}
      type={createModal.type}
      parentId={createModal.parentId}
      items={items}
      onClose={closeCreateModal}
      onCreate={createItem}
    />
  );
};
