"use client";

import React from "react";
import { useWorkspace } from "../../context/useWorkspace";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  Sun,
  Moon,
  Menu,
} from "lucide-react";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
}) => {
  const { theme, toggleTheme } = useWorkspace();

  return (
    <header className="flex items-center justify-between h-[60px] px-3 sm:px-5 bg-header backdrop-blur-md border-b border-border z-40 gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-text-muted hover:text-primary-accent"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation sidebar"
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none">
          <div className="flex items-center justify-center w-[34px] h-[34px] rounded-lg bg-primary text-white shadow-xs shrink-0">
            <FolderGit2 size={20} />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-text-primary hidden lg:inline">
            Mini Workspace Explorer
          </span>
          <span className="font-semibold text-[15px] tracking-tight text-text-primary hidden sm:inline lg:hidden">
            Explorer
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0 max-w-[580px] relative">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="hover:border-primary-500/40 text-text-secondary hover:text-primary-accent hover:rotate-12 transition-transform"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          aria-label="Toggle color theme"
          id="theme-toggle-btn"
        >
          {theme === "dark" ? (
            <Sun size={18} className="text-warning" />
          ) : (
            <Moon size={18} className="text-primary" />
          )}
        </Button>
      </div>
    </header>
  );
};
