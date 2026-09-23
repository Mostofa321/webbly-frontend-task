"use client";

import React, { useEffect, useRef } from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { getItemFullPath } from "../../utils/treeUtils";
import {
  FileText,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export const TextEditor: React.FC = () => {
  const {
    items,
    isEditorOpen,
    activeFile,
    editorContent,
    isEditorDirty,
    setEditorContent,
    saveActiveFile,
    closeEditor,
  } = useWorkspace();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditorOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditorOpen, activeFile?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditorOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveActiveFile();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeEditor();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditorOpen, saveActiveFile, closeEditor]);

  if (!isEditorOpen || !activeFile) return null;

  const fullPath = getItemFullPath(items, activeFile);

  return (
    <div
      className="fixed inset-0 bg-backdrop backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col w-full max-w-[880px] h-[82vh] bg-surface border border-border-medium rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-surface-hover/50 border-b border-border gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-file-50 text-file-500 shrink-0">
              <FileText size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-semibold text-text-primary truncate">
                  {activeFile.name}
                </span>
                {isEditorDirty ? (
                  <Badge
                    variant="warning"
                    className="gap-1 font-normal lowercase tracking-normal"
                    title="Unsaved changes"
                  >
                    <AlertCircle size={12} />
                    <span>unsaved</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="success"
                    className="gap-1 font-normal lowercase tracking-normal"
                    title="All changes saved"
                  >
                    <CheckCircle2 size={12} />
                    <span>saved</span>
                  </Badge>
                )}
              </div>
              <span className="text-xs text-text-muted truncate">{fullPath}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isEditorDirty ? "default" : "secondary"}
              onClick={saveActiveFile}
              title="Save changes (Ctrl+S)"
              id="editor-save-btn"
            >
              <Save size={15} />
              <span>Save</span>
              <kbd
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ml-0.5 ${
                  isEditorDirty
                    ? "bg-primary-700/60 text-white"
                    : "bg-surface-active text-text-muted"
                }`}
              >
                Ctrl+S
              </kbd>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => closeEditor()}
              title="Close editor (Esc)"
              aria-label="Close editor"
              id="editor-close-btn"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex p-0 bg-input overflow-hidden">
          <Textarea
            ref={textareaRef}
            id="file-content-textarea"
            className="w-full h-full p-5 border-none shadow-none rounded-none outline-none resize-none font-mono text-sm leading-relaxed text-text-primary bg-transparent select-text placeholder:text-text-muted focus-visible:ring-0 focus-visible:outline-none"
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="Type your text file content here..."
            spellCheck={false}
            aria-label={`Editing ${activeFile.name}`}
          />
        </div>
      </div>
    </div>
  );
};
