"use client";

import { useState } from "react";
import { WorkspaceProvider } from "../context/WorkspaceContext";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { MainPanel } from "./MainPanel/MainPanel";
import { TextEditor } from "./Editor/TextEditor";
import { CreateModal } from "./Modals/CreateModal";
import { RenameModal } from "./Modals/RenameModal";
import { DeleteModal } from "./Modals/DeleteModal";
import { UnsavedPromptModal } from "./Modals/UnsavedPromptModal";

function ExplorerContent() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-app text-text-primary font-sans">
      <Header
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <MainPanel />
      </div>

      <TextEditor />
      <CreateModal />
      <RenameModal />
      <DeleteModal />
      <UnsavedPromptModal />
    </div>
  );
}

export function WorkspaceApp() {
  return (
    <WorkspaceProvider>
      <ExplorerContent />
    </WorkspaceProvider>
  );
}
