/**
 * useDriversSelection hook
 * Manages multi-selection functionality
 */

import { useState } from 'react';

export const useOrdersSelection = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (orderId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const selectAll = () => {
    // This will be called from parent with current drivers list
    // For now, just toggle all selected
    setSelectedIds(prev => prev.size > 0 ? new Set() : new Set());
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const startSelection = () => {
    setSelectionMode(true);
  };

  const endSelection = () => {
    setSelectionMode(false);
    clearSelection();
  };

  const isSelected = (orderId: string) => {
    return selectedIds.has(orderId);
  };

  return {
    selectionMode,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    startSelection,
    endSelection,
    isSelected
  };
};
