export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 400,
  VERY_SLOW: 600,
} as const;

export const ANIMATION_EASINGS = {
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
} as const;

export const TRANSITION_TYPES = {
  // Screen transitions
  SLIDE_RIGHT: 'slideRight',
  SLIDE_LEFT: 'slideLeft',
  SLIDE_UP: 'slideUp',
  SLIDE_DOWN: 'slideDown',
  FADE: 'fade',
  SCALE: 'scale',
  SLIDE_AND_FADE: 'slideAndFade',
  
  // Modal transitions
  MODAL_SLIDE_UP: 'modalSlideUp',
  MODAL_FADE: 'modalFade',
  MODAL_SCALE: 'modalScale',
} as const;

export const SCREEN_TRANSITIONS = {
  // Default transitions for different screen types
  AUTH: TRANSITION_TYPES.SLIDE_AND_FADE,
  MODAL: TRANSITION_TYPES.MODAL_SLIDE_UP,
  TAB: TRANSITION_TYPES.FADE,
  STACK: TRANSITION_TYPES.SLIDE_RIGHT,
} as const;
