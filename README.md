# Mini Workspace Explorer

A browser-based file manager built with Next.js, React, TypeScript, and Tailwind CSS for the Webbly Media frontend assessment task.

It supports creating, renaming, editing, and deleting folders and files with nested hierarchy, search, and localStorage persistence.

## How to Run the Project

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

3. To create a production build:
```bash
npm run build
npm start
```

## Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   └── error.tsx
├── components/
│   ├── WorkspaceApp.tsx
│   ├── Header/
│   ├── Sidebar/
│   ├── MainPanel/
│   ├── Editor/
│   ├── Modals/
│   └── ui/
├── context/
│   ├── WorkspaceContext.tsx
│   └── useWorkspace.ts
├── types/
│   └── workspace.ts
└── utils/
    ├── initialData.ts
    └── treeUtils.ts
```

- `components/`: UI components broken down by section (Sidebar tree view, MainPanel grid/table, Header search, Text Editor, and dialog modals).
- `context/`: Global workspace state and localStorage persistence.
- `utils/`: Helper functions for building the folder tree, searching, and validating names.

## State Management Approach

I used React Context (`WorkspaceContext`) to manage the state across the application. Since all components (sidebar, main panel, search bar, modals, and editor) need access to the files and current folder, having a centralized context makes it easy to share state without prop drilling.

The state holds:
- The list of files and folders (`items`)
- Currently selected folder (`selectedFolderId`)
- Active file being edited
- Open/closed folders in the sidebar tree
- Dark/light theme

All changes (add, rename, delete, update file content) automatically save to `localStorage`, so your files stay saved even after refreshing the page.

## File-System Data Structure

Each folder and file uses this simple interface:

```typescript
export interface WorkspaceItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  content?: string;
}
```

Instead of storing files as a deeply nested tree object, I decided to keep them in a flat array where each item has a `parentId`.
- Root items have `parentId: null`.
- Items inside a folder have `parentId` set to that folder's `id`.

I chose this flat structure because it is much simpler to add, rename, and delete items with standard array methods (`filter`, `map`, `find`) rather than having to write complex recursive functions every time something updates. When the sidebar needs a nested tree view, a helper function (`buildFolderTree`) converts the flat list into nested children for rendering.

## Important Implementation Decisions & Edge Cases

Here are a few things I made sure to handle:

- **Cascade Delete**: When a folder is deleted, all nested subfolders and files inside it are also deleted so nothing gets orphaned. The delete confirmation dialog shows how many items will be deleted.
- **Deleting the Active Folder**: If you delete the folder you're currently viewing, the app automatically switches selection back to its parent folder or the root workspace so the view doesn't break.
- **Name Validation & Duplicates**: File and folder names can't be empty, and you can't have duplicate names in the same folder. However, files with the same name can exist in different folders.
- **Unsaved Changes Warning**: If you edit a file and try to close the editor or switch files without saving, a prompt asks if you want to save, discard changes, or cancel. You can also press `Ctrl+S` (or `Cmd+S`) to quickly save.
- **Workspace Search**: The search bar in the header filters through all folders and files across the entire workspace. Clicking a search result takes you directly to that file and opens its parent folder in the sidebar.
- **Empty States**: Clear empty states are shown when a folder has no items or when the entire workspace is cleared, with quick buttons to create new items.
