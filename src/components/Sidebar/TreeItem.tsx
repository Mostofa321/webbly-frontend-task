"use client";

import React from "react";
import type { TreeNode } from "../../types/workspace";
import { useWorkspace } from "../../context/useWorkspace";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
} from "lucide-react";

interface TreeItemProps {
  node: TreeNode;
  depth?: number;
  onCloseMobileSidebar?: () => void;
}

export const TreeItem: React.FC<TreeItemProps> = ({
  node,
  depth = 0,
  onCloseMobileSidebar,
}) => {
  const {
    selectedFolderId,
    selectFolder,
    expandedFolderIds,
    toggleFolderExpand,
  } = useWorkspace();

  const isExpanded = expandedFolderIds.has(node.id);
  const isSelected = selectedFolderId === node.id;
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectFolder(node.id);
    if (hasChildren) {
      toggleFolderExpand(node.id);
    }
    if (onCloseMobileSidebar && window.innerWidth < 768) {
      onCloseMobileSidebar();
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      toggleFolderExpand(node.id);
    }
  };

  return (
    <div className="flex flex-col" role="treeitem" aria-expanded={isExpanded}>
      <div
        className={`flex items-center h-8 pr-2 rounded-md cursor-pointer transition-colors gap-1.5 text-[13px] relative select-none ${
          isSelected
            ? "bg-primary-50 text-primary-accent font-semibold"
            : "text-text-secondary hover:text-primary-accent hover:bg-surface-hover"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={handleRowClick}
        title={node.name}
      >
        <button
          type="button"
          className="flex items-center justify-center w-[18px] h-[18px] rounded shrink-0 text-text-muted hover:text-primary-accent transition-colors cursor-pointer"
          onClick={handleChevronClick}
          aria-label={isExpanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {isExpanded ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </button>

        <div className="shrink-0 flex items-center justify-center">
          {isExpanded ? (
            <FolderOpen size={16} className="text-folder-500" />
          ) : (
            <Folder size={16} className="text-folder-500" />
          )}
        </div>

        <span className="truncate flex-1 min-w-0">{node.name}</span>
      </div>

      {isExpanded && hasChildren && (
        <div className="flex flex-col" role="group">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onCloseMobileSidebar={onCloseMobileSidebar}
            />
          ))}
        </div>
      )}
    </div>
  );
};
