"use client";

import React, { useMemo } from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { TreeItem } from "./TreeItem";
import { buildFolderTree } from "../../utils/treeUtils";
import {
  FolderTree,
  Home,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    items,
    selectedFolderId,
    selectFolder,
  } = useWorkspace();

  const folderTree = useMemo(() => {
    return buildFolderTree(items, null);
  }, [items]);

  const isRootSelected = selectedFolderId === null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-backdrop backdrop-blur-xs z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[280px] shrink-0 bg-surface border-r border-border flex flex-col overflow-hidden transition-transform duration-200 z-30 fixed md:static inset-y-0 left-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        role="navigation"
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <FolderTree size={16} className="text-primary-500" />
            <span>Folders</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-7 h-7 rounded text-text-muted hover:text-primary-accent hover:bg-surface-hover transition-colors cursor-pointer"
              onClick={onClose}
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 select-none" role="tree">
          <div
            className={`flex items-center h-8 px-3 rounded-md cursor-pointer transition-colors gap-2 text-[13px] mb-1.5 ${
              isRootSelected
                ? "bg-primary-50 text-primary-accent font-semibold"
                : "text-text-secondary hover:text-primary-accent hover:bg-surface-hover"
            }`}
            onClick={() => {
              selectFolder(null);
              if (window.innerWidth < 768) onClose();
            }}
          >
            <div className="shrink-0 flex items-center justify-center">
              <Home size={15} className="text-primary-500" />
            </div>
            <span className="truncate flex-1">Workspace (Root)</span>
          </div>

          {folderTree.length > 0 ? (
            folderTree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                depth={0}
                onCloseMobileSidebar={onClose}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-text-muted text-xs">
              <p>No folders in workspace</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
