import { FixDrivePage, ProgressStep } from '../types/fix-drive.types';

export const PROGRESS_STEPS: ProgressStep[] = [
  {
    id: 'timeSchedule',
    title: 'Время',
    icon: 'time',
    isCompleted: false,
    isActive: true,
  },
  {
    id: 'addresses',
    title: 'Адреса',
    icon: 'location',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 'confirmation',
    title: 'Подтверждение',
    icon: 'car',
    isCompleted: false,
    isActive: false,
  },
];

export const getProgressSteps = (currentPage: FixDrivePage): ProgressStep[] => {
  return PROGRESS_STEPS.map((step, index) => {
    const currentIndex = PROGRESS_STEPS.findIndex(s => s.id === currentPage);
    
    return {
      ...step,
      isActive: step.id === currentPage,
      isCompleted: index < currentIndex,
    };
  });
};
