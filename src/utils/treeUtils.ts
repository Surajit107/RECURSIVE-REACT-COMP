import { ListItemType } from '../types/types';

export interface TreeSelection {
  path: string;
  text: string;
  type: 'folder' | 'file';
  childCount: number;
  depth: number;
}

export type ViewFilter = 'all' | 'folder' | 'file';
export type SortMode = 'name' | 'type';

export const getExtension = (name: string): string => {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

export const countNodes = (items: ListItemType[]): { folders: number; files: number } =>
  items.reduce(
    (acc, item) => {
      if (item.type === 'folder') {
        acc.folders += 1;
      } else {
        acc.files += 1;
      }
      if (item.children?.length) {
        const nested = countNodes(item.children);
        acc.folders += nested.folders;
        acc.files += nested.files;
      }
      return acc;
    },
    { folders: 0, files: 0 }
  );

export const filterTree = (
  items: ListItemType[],
  query: string,
  viewFilter: ViewFilter
): ListItemType[] => {
  const normalized = query.trim().toLowerCase();

  const walk = (nodes: ListItemType[]): ListItemType[] => {
    const result: ListItemType[] = [];

    for (const node of nodes) {
      const nameMatches = !normalized || node.text.toLowerCase().includes(normalized);
      const filteredChildren = node.children ? walk(node.children) : undefined;
      const hasMatchingChild = Boolean(filteredChildren?.length);

      if (node.type === 'folder') {
        if (viewFilter === 'file') {
          if (hasMatchingChild) {
            result.push({ ...node, children: filteredChildren });
          }
          continue;
        }

        if (nameMatches || hasMatchingChild) {
          result.push({
            ...node,
            children: hasMatchingChild ? filteredChildren : node.children,
          });
        }
        continue;
      }

      if (viewFilter === 'folder') {
        continue;
      }

      if (nameMatches) {
        result.push(node);
      }
    }

    return result;
  };

  return walk(items);
};

export const sortTree = (items: ListItemType[], mode: SortMode): ListItemType[] => {
  const sorted = [...items].sort((a, b) => {
    if (mode === 'type') {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
    }
    return a.text.localeCompare(b.text, undefined, { sensitivity: 'base' });
  });

  return sorted.map((item) =>
    item.children?.length ? { ...item, children: sortTree(item.children, mode) } : item
  );
};

/** Returns ancestor folder paths that should stay open so matches remain visible. */
export const collectOpenPathsForQuery = (
  items: ListItemType[],
  query: string,
  parentPath = ''
): Set<string> => {
  const normalized = query.trim().toLowerCase();
  const openPaths = new Set<string>();

  if (!normalized) {
    return openPaths;
  }

  const walk = (nodes: ListItemType[], currentPath: string): boolean => {
    let branchHasMatch = false;

    for (const node of nodes) {
      const path = currentPath ? `${currentPath}/${node.text}` : node.text;
      const selfMatch = node.text.toLowerCase().includes(normalized);
      const childMatch = node.children?.length ? walk(node.children, path) : false;

      if (selfMatch || childMatch) {
        branchHasMatch = true;
        if (node.type === 'folder' && (childMatch || selfMatch)) {
          openPaths.add(path);
        }
        if (currentPath) {
          openPaths.add(currentPath);
        }
      }
    }

    return branchHasMatch;
  };

  walk(items, parentPath);
  return openPaths;
};

export const maxDepth = (items: ListItemType[], depth = 0): number => {
  if (!items.length) {
    return depth;
  }
  return Math.max(...items.map((item) => maxDepth(item.children ?? [], depth + 1)));
};
