import type {
  WorkspaceItem,
  TreeNode,
  BreadcrumbItem,
  SearchResult,
  ValidationResult,
} from "../types/workspace";

export function buildTree(
  items: WorkspaceItem[],
  parentId: string | null = null
): TreeNode[] {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    })
    .map((item) => ({
      ...item,
      children: item.type === "folder" ? buildTree(items, item.id) : [],
    }));
}

export function buildFolderTree(
  items: WorkspaceItem[],
  parentId: string | null = null
): TreeNode[] {
  return items
    .filter((item) => item.parentId === parentId && item.type === "folder")
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
    .map((folder) => ({
      ...folder,
      children: buildFolderTree(items, folder.id),
    }));
}

export function getBreadcrumbs(
  items: WorkspaceItem[],
  currentFolderId: string | null
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [{ id: null, name: "Workspace" }];

  if (!currentFolderId) {
    return breadcrumbs;
  }

  const path: BreadcrumbItem[] = [];
  let currId: string | null = currentFolderId;
  const visited = new Set<string>();

  while (currId) {
    if (visited.has(currId)) break;
    visited.add(currId);

    const folder = items.find((i) => i.id === currId);
    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.name });
    currId = folder.parentId;
  }

  return [...breadcrumbs, ...path];
}

export function getItemFullPath(
  items: WorkspaceItem[],
  item: WorkspaceItem
): string {
  const crumbs = getBreadcrumbs(items, item.parentId);
  const parts = crumbs.map((c) => c.name);
  parts.push(item.name);
  return parts.join(" / ");
}

export function getAncestorFolderIds(
  items: WorkspaceItem[],
  itemId: string | null
): string[] {
  if (!itemId) return [];
  const ancestors: string[] = [];
  let current = items.find((i) => i.id === itemId);
  const visited = new Set<string>();

  while (current?.parentId) {
    if (visited.has(current.parentId)) break;
    visited.add(current.parentId);
    ancestors.push(current.parentId);
    current = items.find((i) => i.id === current?.parentId);
  }

  return ancestors;
}

export function getAllDescendantIds(
  items: WorkspaceItem[],
  folderId: string
): string[] {
  const result: string[] = [];
  const queue = [folderId];

  while (queue.length > 0) {
    const parent = queue.shift()!;
    const children = items.filter((item) => item.parentId === parent);
    for (const child of children) {
      result.push(child.id);
      if (child.type === "folder") {
        queue.push(child.id);
      }
    }
  }

  return result;
}

export function searchWorkspace(
  items: WorkspaceItem[],
  query: string
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return items
    .filter((item) => item.name.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .map((item) => ({
      item,
      path: getItemFullPath(items, item),
    }));
}

export function validateItemName(
  name: string,
  parentId: string | null,
  items: WorkspaceItem[],
  excludeId?: string
): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: "Name cannot be empty.",
    };
  }

  const illegalChars = /[\\/:*?"<>|]/;
  if (illegalChars.test(trimmed)) {
    return {
      isValid: false,
      error: 'Name cannot contain characters: \\ / : * ? " < > |',
    };
  }

  const isDuplicate = items.some(
    (item) =>
      item.parentId === parentId &&
      item.id !== excludeId &&
      item.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return {
      isValid: false,
      error: `An item named "${trimmed}" already exists in this folder.`,
    };
  }

  return { isValid: true };
}
