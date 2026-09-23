"use client";

import React from "react";
import type { WorkspaceItem } from "../../types/workspace";
import { useWorkspace } from "../../context/useWorkspace";
import {
  Folder,
  FileText,
  Edit2,
  Trash2,
} from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FolderItemCardProps {
  item: WorkspaceItem;
}

export const FolderItemCard: React.FC<FolderItemCardProps> = ({ item }) => {
  const {
    selectFolder,
    setFolderExpanded,
    openFile,
    openRenameModal,
    openDeleteModal,
  } = useWorkspace();

  const isFolder = item.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      selectFolder(item.id);
      setFolderExpanded(item.id, true);
    } else {
      openFile(item.id);
    }
  };

  return (
    <TableRow
      onClick={handleClick}
      className="group cursor-pointer select-none"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      tabIndex={0}
      role="row"
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 flex items-center justify-center">
            {isFolder ? (
              <Folder size={18} className="text-folder-500" />
            ) : (
              <FileText size={18} className="text-file-500" />
            )}
          </div>
          <span
            className="text-[13.5px] font-medium text-text-primary group-hover:text-primary-accent transition-colors truncate"
            title={item.name}
          >
            {item.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="w-[90px]">
        <Badge variant={isFolder ? "folder" : "file"}>
          {item.type}
        </Badge>
      </TableCell>

      <TableCell className="w-[80px] text-right pr-4">
        <div
          className="inline-flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghostMuted"
            size="iconSm"
            onClick={() => openRenameModal(item)}
            title={`Rename ${item.name}`}
            aria-label={`Rename ${item.name}`}
          >
            <Edit2 size={14} />
          </Button>
          <Button
            variant="ghostDanger"
            size="iconSm"
            onClick={() => openDeleteModal(item)}
            title={`Delete ${item.name}`}
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
