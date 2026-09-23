"use client";

import React from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { getBreadcrumbs } from "../../utils/treeUtils";
import { ChevronRight, Home, Folder } from "lucide-react";

export const Breadcrumbs: React.FC = () => {
  const { items, selectedFolderId, selectFolder, setFolderExpanded } = useWorkspace();

  const breadcrumbs = getBreadcrumbs(items, selectedFolderId);

  return (
    <nav className="flex items-center" aria-label="Folder Breadcrumb Path">
      <ol className="flex items-center list-none flex-wrap gap-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isRoot = crumb.id === null;

          return (
            <li key={crumb.id ?? "root"} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight size={14} className="text-text-muted shrink-0" />
              )}

              <button
                type="button"
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[13.5px] transition-colors cursor-pointer ${
                  isLast
                    ? "font-semibold text-text-primary bg-surface-hover"
                    : "font-normal text-text-secondary hover:text-primary-accent hover:bg-surface-hover"
                }`}
                onClick={() => {
                  selectFolder(crumb.id);
                  if (crumb.id) setFolderExpanded(crumb.id, true);
                }}
                aria-current={isLast ? "page" : undefined}
                title={`Go to ${crumb.name}`}
              >
                {isRoot ? (
                  <Home size={14} className="text-primary-500" />
                ) : (
                  <Folder size={14} className="text-folder-500" />
                )}
                <span>{crumb.name}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
