"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type {
  WorkspaceItem,
  ItemType,
  SearchResult,
  ValidationResult,
} from "../types/workspace";
import { INITIAL_WORKSPACE_ITEMS } from "../utils/initialData";
import {
  getAllDescendantIds,
  getAncestorFolderIds,
  searchWorkspace,
  validateItemName,
} from "../utils/treeUtils";

const STORAGE_KEY = "webbly_workspace_items_v1";
const EXPANDED_KEY = "webbly_expanded_folders_v1";
const THEME_KEY = "webbly_theme_v1";

export interface WorkspaceContextType {
  items: WorkspaceItem[];
  selectedFolderId: string | null;
  activeFileId: string | null;
  activeFile: WorkspaceItem | null;
  expandedFolderIds: Set<string>;
  searchQuery: string;
  searchResults: SearchResult[];
  theme: "dark" | "light";

  isEditorOpen: boolean;
  editorContent: string;
  isEditorDirty: boolean;

  createModal: { isOpen: boolean; type: ItemType; parentId: string | null };
  renameModal: { isOpen: boolean; item: WorkspaceItem | null };
  deleteModal: {
    isOpen: boolean;
    item: WorkspaceItem | null;
    descendantCount: number;
  };
  unsavedModal: { isOpen: boolean; pendingAction: (() => void) | null };

  toggleTheme: () => void;

  selectFolder: (folderId: string | null) => void;
  toggleFolderExpand: (folderId: string) => void;
  setFolderExpanded: (folderId: string, expand: boolean) => void;
  setSearchQuery: (query: string) => void;

  openCreateModal: (type: ItemType, parentId?: string | null) => void;
  closeCreateModal: () => void;
  createItem: (
    name: string,
    type: ItemType,
    parentId: string | null
  ) => ValidationResult;

  openRenameModal: (item: WorkspaceItem) => void;
  closeRenameModal: () => void;
  renameItem: (id: string, newName: string) => ValidationResult;

  openDeleteModal: (item: WorkspaceItem) => void;
  closeDeleteModal: () => void;
  deleteItem: (id: string) => void;

  openFile: (fileId: string) => void;
  closeEditor: (force?: boolean) => void;
  setEditorContent: (content: string) => void;
  saveActiveFile: () => void;
  handleUnsavedSaveAndProceed: () => void;
  handleUnsavedDiscardAndProceed: () => void;
  handleUnsavedCancel: () => void;

  navigateFromSearch: (item: WorkspaceItem) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isHydratedRef = useRef(false);

  const [items, setItems] = useState<WorkspaceItem[]>(INITIAL_WORKSPACE_ITEMS);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    () => new Set(["folder-projects", "folder-webbly"])
  );
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
      const savedExpanded = localStorage.getItem(EXPANDED_KEY);
      if (savedExpanded) {
        const parsed = JSON.parse(savedExpanded);
        if (Array.isArray(parsed)) {
          setExpandedFolderIds(new Set(parsed));
        }
      }
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } catch {
      /* storage read fallback */
    }
    isHydratedRef.current = true;
  }, []);

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorContent, setEditorContentState] = useState("");
  const [isEditorDirty, setIsEditorDirty] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [createModal, setCreateModal] = useState<{
    isOpen: boolean;
    type: ItemType;
    parentId: string | null;
  }>({
    isOpen: false,
    type: "folder",
    parentId: null,
  });

  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    item: WorkspaceItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: WorkspaceItem | null;
    descendantCount: number;
  }>({
    isOpen: false,
    item: null,
    descendantCount: 0,
  });

  const [unsavedModal, setUnsavedModal] = useState<{
    isOpen: boolean;
    pendingAction: (() => void) | null;
  }>({
    isOpen: false,
    pendingAction: null,
  });

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore storage quota exceptions */
    }
  }, [items]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem(
        EXPANDED_KEY,
        JSON.stringify(Array.from(expandedFolderIds))
      );
    } catch {
      // ignore quota limits
    }
  }, [expandedFolderIds]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const activeFile = useMemo(() => {
    if (!activeFileId) return null;
    return items.find((i) => i.id === activeFileId && i.type === "file") || null;
  }, [items, activeFileId]);

  const searchResults = useMemo(() => {
    return searchWorkspace(items, searchQuery);
  }, [items, searchQuery]);

  const expandAncestors = useCallback(
    (itemId: string | null) => {
      if (!itemId) return;
      const ancestors = getAncestorFolderIds(items, itemId);
      if (ancestors.length > 0) {
        setExpandedFolderIds((prev) => {
          const next = new Set(prev);
          ancestors.forEach((id) => next.add(id));
          return next;
        });
      }
    },
    [items]
  );

  const toggleFolderExpand = useCallback((folderId: string) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const setFolderExpanded = useCallback((folderId: string, expand: boolean) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (expand) next.add(folderId);
      else next.delete(folderId);
      return next;
    });
  }, []);

  const executeWithDirtyCheck = useCallback(
    (action: () => void) => {
      if (isEditorDirty) {
        setUnsavedModal({
          isOpen: true,
          pendingAction: action,
        });
      } else {
        action();
      }
    },
    [isEditorDirty]
  );

  const selectFolder = useCallback(
    (folderId: string | null) => {
      executeWithDirtyCheck(() => {
        setSelectedFolderId(folderId);
        if (folderId) {
          expandAncestors(folderId);
        }
      });
    },
    [executeWithDirtyCheck, expandAncestors]
  );

  const openFile = useCallback(
    (fileId: string) => {
      const targetFile = items.find((i) => i.id === fileId && i.type === "file");
      if (!targetFile) return;

      const doOpen = () => {
        setActiveFileId(fileId);
        setEditorContentState(targetFile.content ?? "");
        setIsEditorDirty(false);
        setIsEditorOpen(true);
        if (targetFile.parentId) {
          setSelectedFolderId(targetFile.parentId);
          expandAncestors(targetFile.parentId);
        }
      };

      if (activeFileId === fileId && isEditorOpen) return;
      executeWithDirtyCheck(doOpen);
    },
    [items, activeFileId, isEditorOpen, executeWithDirtyCheck, expandAncestors]
  );

  const closeEditor = useCallback(
    (force = false) => {
      if (!force && isEditorDirty) {
        setUnsavedModal({
          isOpen: true,
          pendingAction: () => {
            setActiveFileId(null);
            setIsEditorOpen(false);
            setIsEditorDirty(false);
            setEditorContentState("");
          },
        });
      } else {
        setActiveFileId(null);
        setIsEditorOpen(false);
        setIsEditorDirty(false);
        setEditorContentState("");
      }
    },
    [isEditorDirty]
  );

  const setEditorContent = useCallback(
    (content: string) => {
      setEditorContentState(content);
      const original = activeFile?.content ?? "";
      setIsEditorDirty(content !== original);
    },
    [activeFile]
  );

  const saveActiveFile = useCallback(() => {
    if (!activeFileId) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === activeFileId
          ? { ...item, content: editorContent, updatedAt: Date.now() }
          : item
      )
    );
    setIsEditorDirty(false);
  }, [activeFileId, editorContent]);

  const handleUnsavedSaveAndProceed = useCallback(() => {
    saveActiveFile();
    const action = unsavedModal.pendingAction;
    setUnsavedModal({ isOpen: false, pendingAction: null });
    if (action) action();
  }, [saveActiveFile, unsavedModal.pendingAction]);

  const handleUnsavedDiscardAndProceed = useCallback(() => {
    setIsEditorDirty(false);
    const action = unsavedModal.pendingAction;
    setUnsavedModal({ isOpen: false, pendingAction: null });
    if (action) action();
  }, [unsavedModal.pendingAction]);

  const handleUnsavedCancel = useCallback(() => {
    setUnsavedModal({ isOpen: false, pendingAction: null });
  }, []);

  const openCreateModal = useCallback(
    (type: ItemType, parentId: string | null = selectedFolderId) => {
      setCreateModal({
        isOpen: true,
        type,
        parentId: parentId ?? selectedFolderId,
      });
    },
    [selectedFolderId]
  );

  const closeCreateModal = useCallback(() => {
    setCreateModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const createItem = useCallback(
    (
      name: string,
      type: ItemType,
      parentId: string | null
    ): ValidationResult => {
      const validation = validateItemName(name, parentId, items);
      if (!validation.isValid) return validation;

      const trimmedName = name.trim();
      const newItem: WorkspaceItem = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: trimmedName,
        type,
        parentId,
        content: type === "file" ? "" : undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setItems((prev) => [...prev, newItem]);

      if (parentId) {
        setFolderExpanded(parentId, true);
      }

      if (type === "file") {
        openFile(newItem.id);
      }

      return { isValid: true };
    },
    [items, setFolderExpanded, openFile]
  );

  const openRenameModal = useCallback((item: WorkspaceItem) => {
    setRenameModal({ isOpen: true, item });
  }, []);

  const closeRenameModal = useCallback(() => {
    setRenameModal({ isOpen: false, item: null });
  }, []);

  const renameItem = useCallback(
    (id: string, newName: string): ValidationResult => {
      const target = items.find((i) => i.id === id);
      if (!target) return { isValid: false, error: "Item not found." };

      const validation = validateItemName(newName, target.parentId, items, id);
      if (!validation.isValid) return validation;

      const trimmedName = newName.trim();
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, name: trimmedName, updatedAt: Date.now() } : i
        )
      );

      return { isValid: true };
    },
    [items]
  );

  const openDeleteModal = useCallback(
    (item: WorkspaceItem) => {
      const descendantIds =
        item.type === "folder" ? getAllDescendantIds(items, item.id) : [];
      setDeleteModal({
        isOpen: true,
        item,
        descendantCount: descendantIds.length,
      });
    },
    [items]
  );

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, item: null, descendantCount: 0 });
  }, []);

  const deleteItem = useCallback(
    (id: string) => {
      const itemToDelete = items.find((i) => i.id === id);
      if (!itemToDelete) return;

      const descendantIds =
        itemToDelete.type === "folder" ? getAllDescendantIds(items, id) : [];
      const allIdsToDelete = new Set([id, ...descendantIds]);

      if (activeFileId && allIdsToDelete.has(activeFileId)) {
        setActiveFileId(null);
        setIsEditorOpen(false);
        setIsEditorDirty(false);
      }

      if (
        selectedFolderId === id ||
        (selectedFolderId && allIdsToDelete.has(selectedFolderId))
      ) {
        const fallback = itemToDelete.parentId;
        const fallbackExists =
          fallback &&
          items.some((i) => i.id === fallback && !allIdsToDelete.has(i.id));
        setSelectedFolderId(fallbackExists ? fallback : null);
      }

      setItems((prev) => prev.filter((i) => !allIdsToDelete.has(i.id)));
      setExpandedFolderIds((prev) => {
        const next = new Set(prev);
        allIdsToDelete.forEach((deletedId) => next.delete(deletedId));
        return next;
      });

    },
    [items, selectedFolderId, activeFileId]
  );

  const navigateFromSearch = useCallback(
    (item: WorkspaceItem) => {
      setSearchQuery("");
      if (item.type === "folder") {
        selectFolder(item.id);
        setFolderExpanded(item.id, true);
      } else {
        openFile(item.id);
      }
    },
    [selectFolder, setFolderExpanded, openFile]
  );

  const value = useMemo(
    () => ({
      items,
      selectedFolderId,
      activeFileId,
      activeFile,
      expandedFolderIds,
      searchQuery,
      searchResults,
      theme,
      isEditorOpen,
      editorContent,
      isEditorDirty,
      createModal,
      renameModal,
      deleteModal,
      unsavedModal,
      toggleTheme,
      selectFolder,
      toggleFolderExpand,
      setFolderExpanded,
      setSearchQuery,
      openCreateModal,
      closeCreateModal,
      createItem,
      openRenameModal,
      closeRenameModal,
      renameItem,
      openDeleteModal,
      closeDeleteModal,
      deleteItem,
      openFile,
      closeEditor,
      setEditorContent,
      saveActiveFile,
      handleUnsavedSaveAndProceed,
      handleUnsavedDiscardAndProceed,
      handleUnsavedCancel,
      navigateFromSearch,
    }),
    [
      items,
      selectedFolderId,
      activeFileId,
      activeFile,
      expandedFolderIds,
      searchQuery,
      searchResults,
      theme,
      isEditorOpen,
      editorContent,
      isEditorDirty,
      createModal,
      renameModal,
      deleteModal,
      unsavedModal,
      toggleTheme,
      selectFolder,
      toggleFolderExpand,
      setFolderExpanded,
      setSearchQuery,
      openCreateModal,
      closeCreateModal,
      createItem,
      openRenameModal,
      closeRenameModal,
      renameItem,
      openDeleteModal,
      closeDeleteModal,
      deleteItem,
      openFile,
      closeEditor,
      setEditorContent,
      saveActiveFile,
      handleUnsavedSaveAndProceed,
      handleUnsavedDiscardAndProceed,
      handleUnsavedCancel,
      navigateFromSearch,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
