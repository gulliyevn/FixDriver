import { useState, useCallback } from 'react';
import { ChatSelectionState } from '../types/Chat';

export const useChatSelection = () => {
  const [selectionState, setSelectionState] = useState<ChatSelectionState>({
    isSelectionMode: false,
    selectedIds: new Set(),
    totalSelected: 0
  });

  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setSelectionState(prev => ({
      ...prev,
      isSelectionMode: !prev.isSelectionMode,
      selectedIds: new Set(),
      totalSelected: 0
    }));
  }, []);

  // Toggle individual chat selection
  const toggleSelect = useCallback((chatId: string) => {
    setSelectionState(prev => {
      const newSelectedIds = new Set(prev.selectedIds);
      if (newSelectedIds.has(chatId)) {
        newSelectedIds.delete(chatId);
      } else {
        newSelectedIds.add(chatId);
      }
      
      return {
        ...prev,
        selectedIds: newSelectedIds,
        totalSelected: newSelectedIds.size
      };
    });
  }, []);

  // Select all chats
  const selectAll = useCallback((allChatIds: string[]) => {
    setSelectionState(prev => {
      const isAllSelected = prev.selectedIds.size === allChatIds.length;
      return {
        ...prev,
        selectedIds: isAllSelected ? new Set() : new Set(allChatIds),
        totalSelected: isAllSelected ? 0 : allChatIds.length
      };
    });
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectionState(prev => ({
      ...prev,
      selectedIds: new Set(),
      totalSelected: 0
    }));
  }, []);

  // Exit selection mode
  const exitSelectionMode = useCallback(() => {
    setSelectionState({
      isSelectionMode: false,
      selectedIds: new Set(),
      totalSelected: 0
    });
  }, []);

  // Check if chat is selected
  const isSelected = useCallback((chatId: string) => {
    return selectionState.selectedIds.has(chatId);
  }, [selectionState.selectedIds]);

  // Get selected chat IDs as array
  const getSelectedIds = useCallback(() => {
    return Array.from(selectionState.selectedIds);
  }, [selectionState.selectedIds]);

  return {
    selectionState,
    toggleSelectionMode,
    toggleSelect,
    selectAll,
    clearSelection,
    exitSelectionMode,
    isSelected,
    getSelectedIds
  };
};
