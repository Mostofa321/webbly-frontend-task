"use client";

import React, { useState, useRef, useEffect } from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { Search, Folder, FileText, X } from "lucide-react";
import type { SearchResult } from "../../types/workspace";
import { Badge } from "@/components/ui/badge";

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, searchResults, navigateFromSearch } =
    useWorkspace();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelectResult = (result: SearchResult) => {
    navigateFromSearch(result.item);
    setIsFocused(false);
  };

  const showDropdown = isFocused && searchQuery.trim().length > 0;

  return (
    <div className="w-full min-w-0 relative" ref={containerRef}>
      <div
        className={`flex items-center w-full h-9 sm:h-[38px] px-2.5 sm:px-3 bg-surface border border-border rounded-xl gap-2 transition-all text-text-primary ${
          isFocused ? "border-primary-500 ring-2 ring-primary-500/20" : "hover:border-border-medium"
        }`}
      >
        <Search size={16} className="text-text-muted shrink-0" />
        <input
          id="workspace-search-input"
          type="text"
          placeholder="Search workspace..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsFocused(false);
              setSearchQuery("");
            }
          }}
          aria-label="Search workspace items"
          autoComplete="off"
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] sm:text-[13.5px] text-text-primary placeholder:text-text-muted placeholder:truncate"
        />
        {searchQuery && (
          <button
            type="button"
            className="flex items-center justify-center p-1 rounded-full text-text-muted hover:text-primary-accent hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search query"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute top-[calc(100%+6px)] inset-x-0 bg-surface border border-border-medium rounded-xl shadow-xl max-h-[400px] overflow-y-auto z-50 divide-y divide-border-subtle"
          role="listbox"
        >
          <div className="px-3.5 py-2.5 text-xs text-text-muted bg-surface-hover/60">
            <span>
              Search results for <strong className="text-text-primary">&quot;{searchQuery}&quot;</strong> ({searchResults.length})
            </span>
          </div>

          <div className="p-1.5 space-y-0.5">
            {searchResults.length === 0 ? (
              <div className="py-7 px-4 text-center text-text-muted flex flex-col items-center gap-1.5">
                <Search size={22} className="opacity-50 mb-1" />
                <p className="text-sm font-medium text-text-secondary">No matching files or folders found</p>
                <span className="text-xs">Try searching by another filename or folder</span>
              </div>
            ) : (
              searchResults.map(({ item, path }) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex items-center w-full p-2.5 gap-3 rounded-lg text-left hover:bg-surface-hover transition-colors cursor-pointer group"
                  onClick={() => handleSelectResult({ item, path })}
                >
                  <div className="shrink-0 flex items-center justify-center">
                    {item.type === "folder" ? (
                      <Folder size={18} className="text-folder-500" />
                    ) : (
                      <FileText size={18} className="text-file-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-text-primary flex items-center gap-2">
                      <span className="truncate group-hover:text-primary-accent transition-colors">{item.name}</span>
                      <Badge variant="secondary">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="text-[11.5px] text-text-muted truncate mt-0.5">{path}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
