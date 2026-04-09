import { useState, useRef, useCallback } from 'react';
import type { UploadItem } from '@filekit/shared';
import { createUploadItem, revokeItemUrls, isValidImageFile, generateFileKey, MAX_FILES } from '@filekit/shared';

interface UseImageUploadOptions {
  maxFiles?: number;
  onStatusMessage?: (message: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { maxFiles = MAX_FILES, onStatusMessage } = options;
  const [items, setItems] = useState<UploadItem[]>([]);
  const itemsRef = useRef<UploadItem[]>([]);

  // Keep ref in sync with state
  const updateItems = useCallback((newItems: UploadItem[]) => {
    itemsRef.current = newItems;
    setItems(newItems);
  }, []);

  const addFiles = useCallback(
    (fileList: FileList | File[]): UploadItem[] => {
      const incoming = Array.from(fileList).filter(isValidImageFile);

      if (!incoming.length) {
        onStatusMessage?.('Please select images');
        return [];
      }

      const existingKeys = new Set(itemsRef.current.map((item) => generateFileKey(item.file)));
      const accepted = incoming.filter((file) => !existingKeys.has(generateFileKey(file)));

      if (!accepted.length) {
        onStatusMessage?.('Duplicate files detected');
        return [];
      }

      const remainingSlots = Math.max(0, maxFiles - itemsRef.current.length);
      const nextItems = accepted.slice(0, remainingSlots).map(createUploadItem);

      if (!nextItems.length) {
        onStatusMessage?.(`Limit reached (${maxFiles} files)`);
        return [];
      }

      updateItems([...itemsRef.current, ...nextItems]);
      onStatusMessage?.(`Added ${nextItems.length} file(s)`);

      return nextItems;
    },
    [maxFiles, onStatusMessage, updateItems],
  );

  const removeItem = useCallback(
    (id: string) => {
      updateItems(
        itemsRef.current.filter((item) => {
          if (item.id === id) {
            revokeItemUrls(item);
            return false;
          }
          return true;
        }),
      );
    },
    [updateItems],
  );

  const updateItem = useCallback((id: string, updates: Partial<UploadItem>) => {
    updateItems(
      itemsRef.current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item,
      ),
    );
  }, [updateItems]);

  const clearAll = useCallback(() => {
    itemsRef.current.forEach(revokeItemUrls);
    updateItems([]);
    onStatusMessage?.('Queue cleared');
  }, [updateItems, onStatusMessage]);

  const cleanupUrls = useCallback(() => {
    itemsRef.current.forEach(revokeItemUrls);
  }, []);

  return {
    items,
    itemsRef,
    addFiles,
    removeItem,
    updateItem,
    clearAll,
    cleanupUrls,
  };
}
