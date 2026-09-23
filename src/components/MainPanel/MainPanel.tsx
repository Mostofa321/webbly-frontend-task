"use client";

import React, { useMemo } from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { Breadcrumbs } from "./Breadcrumbs";
import { ActionBar } from "./ActionBar";
import { FolderItemCard } from "./FolderItemCard";
import {
  FolderOpen,
  FolderPlus,
  FilePlus,
  Sparkles,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const MainPanel: React.FC = () => {
  const {
    items,
    selectedFolderId,
    openCreateModal,
  } = useWorkspace();

  const currentFolderItems = useMemo(() => {
    return items
      .filter((item) => item.parentId === selectedFolderId)
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });
  }, [items, selectedFolderId]);

  const isWorkspaceEmpty = items.length === 0;
  const isCurrentFolderEmpty = currentFolderItems.length === 0;

  return (
    <main className="flex-1 flex flex-col bg-app overflow-hidden" role="main">
      <div className="px-6 py-3 border-b border-border bg-app">
        <Breadcrumbs />
      </div>

      <ActionBar />

      <div className="flex-1 overflow-y-auto p-6">
        {isWorkspaceEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface border border-dashed border-border-medium rounded-2xl text-center max-w-[500px] mx-auto my-10 shadow-xs" id="empty-workspace-state">
            <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-primary-50 text-primary-500 mb-5">
              <Sparkles size={34} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Your Workspace is Empty</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Get started by creating your first folder or text file.
            </p>
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <Button
                variant="default"
                onClick={() => openCreateModal("folder", null)}
              >
                <FolderPlus size={16} />
                <span>Create Root Folder</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => openCreateModal("file", null)}
              >
                <FilePlus size={16} />
                <span>Create Root File</span>
              </Button>
            </div>
          </div>
        ) : isCurrentFolderEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface border border-dashed border-border-medium rounded-2xl text-center max-w-[500px] mx-auto my-10 shadow-xs" id="empty-folder-state">
            <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-folder-50 text-folder-500 mb-5">
              <FolderOpen size={34} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">This Folder is Empty</h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              There are no files or folders here yet. Use the buttons below to
              add contents to this folder.
            </p>
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <Button
                variant="default"
                onClick={() => openCreateModal("folder", selectedFolderId)}
              >
                <FolderPlus size={16} />
                <span>New Folder Here</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => openCreateModal("file", selectedFolderId)}
              >
                <FilePlus size={16} />
                <span>New Text File Here</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent cursor-default border-b border-border">
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[90px]">Type</TableHead>
                  <TableHead className="w-[80px] text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFolderItems.map((item) => (
                  <FolderItemCard key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
};
