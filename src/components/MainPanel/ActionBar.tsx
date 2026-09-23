"use client";

import React from "react";
import { useWorkspace } from "../../context/useWorkspace";
import {
  FolderPlus,
  FilePlus,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const ActionBar: React.FC = () => {
  const {
    items,
    selectedFolderId,
    openCreateModal,
    openRenameModal,
    openDeleteModal,
  } = useWorkspace();

  const currentFolder = selectedFolderId
    ? items.find((i) => i.id === selectedFolderId)
    : null;

  const isRoot = selectedFolderId === null;

  const handleFocusSearch = () => {
    const input = document.getElementById("workspace-search-input") as HTMLInputElement | null;
    if (input) {
      input.focus();
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-app gap-3 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="default"
          onClick={() => openCreateModal("folder", selectedFolderId)}
          id="btn-create-folder"
        >
          <FolderPlus size={16} />
          <span>New Folder</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => openCreateModal("file", selectedFolderId)}
          id="btn-create-file"
        >
          <FilePlus size={16} />
          <span>New Text File</span>
        </Button>

        <Button
          variant="ghost"
          onClick={handleFocusSearch}
          title="Search workspace"
          id="btn-action-search"
        >
          <Search size={15} />
          <span>Search</span>
        </Button>

        {!isRoot && currentFolder && (
          <div className="flex items-center gap-1.5">
            <Separator orientation="vertical" className="h-5 mx-1" />
            <Button
              variant="ghost"
              onClick={() => openRenameModal(currentFolder)}
              title={`Rename current folder "${currentFolder.name}"`}
              id="btn-rename-current-folder"
            >
              <Edit2 size={15} />
              <span>Rename</span>
            </Button>

            <Button
              variant="ghost"
              className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
              onClick={() => openDeleteModal(currentFolder)}
              title={`Delete current folder "${currentFolder.name}"`}
              id="btn-delete-current-folder"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
