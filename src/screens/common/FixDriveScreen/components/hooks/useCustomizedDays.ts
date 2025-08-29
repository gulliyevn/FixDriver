import { useState } from 'react';

export interface CustomizedMap {
  [key: string]: { there: string; back: string };
}

export const useCustomizedDays = (initial: CustomizedMap = {}) => {
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customizedDays, setCustomizedDays] = useState<CustomizedMap>(initial);
  const [selectedCustomDays, setSelectedCustomDays] = useState<string[]>([]);
  const [tempCustomizedDays, setTempCustomizedDays] = useState<CustomizedMap>({});

  const openModal = () => {
    setTempCustomizedDays({ ...customizedDays });
    setShowCustomizationModal(true);
  };

  const saveModal = () => {
    setCustomizedDays({ ...tempCustomizedDays });
    setSelectedCustomDays([]);
    setShowCustomizationModal(false);
  };

  const closeModal = () => setShowCustomizationModal(false);

  return {
    showCustomizationModal,
    customizedDays,
    setCustomizedDays,
    selectedCustomDays,
    setSelectedCustomDays,
    tempCustomizedDays,
    setTempCustomizedDays,
    openModal,
    saveModal,
    closeModal,
  };
};
