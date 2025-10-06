import { FixWavePage, ProgressStep } from "../types/fix-wave.types";

export const PROGRESS_STEPS: ProgressStep[] = [
  {
    id: "addresses",
    title: "Адреса",
    icon: "location",
    isCompleted: false,
    isActive: true,
  },
  {
    id: "timeSchedule",
    title: "Время",
    icon: "time",
    isCompleted: false,
    isActive: false,
  },
  {
    id: "confirmation",
    title: "Подтверждение",
    icon: "car",
    isCompleted: false,
    isActive: false,
  },
];

export const getProgressForPage = (page: FixWavePage): number => {
  switch (page) {
    case "addresses":
      return 0;
    case "timeSchedule":
      return 50;
    case "confirmation":
      return 100;
    default:
      return 0;
  }
};

export const getProgressSteps = (currentPage: FixWavePage): ProgressStep[] => {
  return PROGRESS_STEPS.map((step, index) => {
    const currentIndex = PROGRESS_STEPS.findIndex((s) => s.id === currentPage);

    return {
      ...step,
      isActive: step.id === currentPage,
      isCompleted: index < currentIndex,
    };
  });
};

export const getNextPage = (currentPage: FixWavePage): FixWavePage | null => {
  const currentIndex = PROGRESS_STEPS.findIndex(
    (step) => step.id === currentPage,
  );
  const nextStep = PROGRESS_STEPS[currentIndex + 1];
  return nextStep ? nextStep.id : null;
};

export const getPreviousPage = (
  currentPage: FixWavePage,
): FixWavePage | null => {
  const currentIndex = PROGRESS_STEPS.findIndex(
    (step) => step.id === currentPage,
  );
  const previousStep = PROGRESS_STEPS[currentIndex - 1];
  return previousStep ? previousStep.id : null;
};

export const canGoToNextPage = (
  currentPage: FixWavePage,
  data: {
    familyMemberId?: string;
    packageType?: string;
    addresses?: Array<unknown>;
    date?: unknown;
    time?: unknown;
  },
): boolean => {
  switch (currentPage) {
    case "addresses":
      return Boolean(
        data.familyMemberId && data.packageType && (data.addresses?.length ?? 0) >= 2,
      );
    case "timeSchedule":
      return Boolean(data.date && data.time);
    case "confirmation":
      return true;
    default:
      return false;
  }
};
