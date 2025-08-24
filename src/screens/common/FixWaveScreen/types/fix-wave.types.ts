export interface FixWaveState {
  // Состояния для страницы FixWave
  isButtonLeft: boolean;
}

export interface FixWaveActions {
  // Действия для страницы FixWave
  setIsButtonLeft: (isLeft: boolean) => void;
  toggleButtonPosition: () => void;
  handleButtonPress: () => void;
  handleContainerPress: () => void;
}

export interface FixWaveHookReturn {
  state: FixWaveState;
  actions: FixWaveActions;
}
