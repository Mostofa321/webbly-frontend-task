export type ItemType = "folder" | "file";

export interface WorkspaceItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface TreeNode extends WorkspaceItem {
  children: TreeNode[];
}

export interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export interface SearchResult {
  item: WorkspaceItem;
  path: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
