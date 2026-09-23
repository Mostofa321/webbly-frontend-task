import type { WorkspaceItem } from "../types/workspace";

export const INITIAL_WORKSPACE_ITEMS: WorkspaceItem[] = [
  {
    id: "folder-projects",
    name: "Projects",
    type: "folder",
    parentId: null,
    createdAt: 1711100000000,
    updatedAt: 1711100000000,
  },
  {
    id: "folder-documents",
    name: "Documents",
    type: "folder",
    parentId: null,
    createdAt: 1711100000000,
    updatedAt: 1711100000000,
  },
  {
    id: "file-readme",
    name: "README.txt",
    type: "file",
    parentId: null,
    content: `Workspace Notes
===============
Welcome! This workspace is your personal workspace for organizing project files, notes, and documentation.

Quick Tips:
- Use the sidebar to browse folders or create new ones.
- Click any file to view and edit its contents directly.
- Press Ctrl+S (Cmd+S) anytime to save your work.
- Use the top search bar to jump straight to any file or folder.`,
    createdAt: 1711100000000,
    updatedAt: 1711100000000,
  },
  {
    id: "folder-webbly",
    name: "Webbly",
    type: "folder",
    parentId: "folder-projects",
    createdAt: 1711101000000,
    updatedAt: 1711101000000,
  },
  {
    id: "folder-personal",
    name: "Personal",
    type: "folder",
    parentId: "folder-projects",
    createdAt: 1711102000000,
    updatedAt: 1711102000000,
  },
  {
    id: "file-notes",
    name: "notes.txt",
    type: "file",
    parentId: "folder-webbly",
    content: `Webbly Project Ideas & Architecture
----------------------------------
- Component hierarchy: Sidebar -> MainPanel -> FolderItemCard
- Clean Tailwind v4 theme tokens with automated dark/light mode
- Fast client-side searching with path indexing
- Local state persistence using browser localStorage`,
    createdAt: 1711103000000,
    updatedAt: 1711103000000,
  },
  {
    id: "file-tasks",
    name: "tasks.txt",
    type: "file",
    parentId: "folder-webbly",
    content: `Sprint Roadmap:
[x] Finalize sidebar tree navigation and responsive drawer
[x] Implement folder breadcrumbs and path resolution
[x] Add inline text editor with unsaved changes prompt
[x] Audit color contrast ratios for light and dark modes
[ ] Add drag and drop support for moving files
[ ] Add export workspace to zip archive`,
    createdAt: 1711104000000,
    updatedAt: 1711104000000,
  },
];
