"use client";

import React from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { AlertCircle, Save, Trash } from "lucide-react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const UnsavedPromptModal: React.FC = () => {
  const {
    unsavedModal,
    activeFile,
    handleUnsavedSaveAndProceed,
    handleUnsavedDiscardAndProceed,
    handleUnsavedCancel,
  } = useWorkspace();

  if (!unsavedModal.isOpen) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && handleUnsavedCancel()}>
      <DialogOverlay onClick={handleUnsavedCancel} />
      <DialogContent onClose={handleUnsavedCancel} aria-labelledby="unsaved-modal-title">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-base font-semibold text-warning-500">
            <AlertCircle size={20} />
            <DialogTitle id="unsaved-modal-title">Unsaved Changes</DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-2">
          <p className="text-sm font-medium text-text-primary">
            You have unsaved changes in{" "}
            <strong>&quot;{activeFile?.name || "current file"}&quot;</strong>.
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            Would you like to save your edits before leaving? Unsaved changes will
            be lost if you discard them.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleUnsavedCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outlineDanger"
            onClick={handleUnsavedDiscardAndProceed}
          >
            <Trash size={14} />
            <span>Discard</span>
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleUnsavedSaveAndProceed}
            id="unsaved-save-continue-btn"
          >
            <Save size={14} />
            <span>Save &amp; Proceed</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
