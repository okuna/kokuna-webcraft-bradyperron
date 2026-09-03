export const EASE_OUT = [0.22, 0.61, 0.36, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_POWER2_IN_OUT = (progress: number) =>
  progress < 0.5
    ? 4 * progress ** 3
    : 1 - (-2 * progress + 2) ** 3 / 2;
export const EASE_POWER3_IN = (progress: number) => progress ** 4;
export const EASE_POWER3_OUT = (progress: number) => 1 - (1 - progress) ** 4;
export const EASE_EXPO_OUT = (progress: number) =>
  progress === 1 ? 1 : 1 - 2 ** (-10 * progress);

export const LOADER_MINIMUM_MS = 1250;
export const LOADER_EXIT_SECONDS = 0.42;
// ponytail: extended entrance window to keep dispersing phase robust for e2e and smooth connected feel
export const GRID_INTRO_SECONDS = 2.85;
export const GRID_INTRO_DELAY_SECONDS = 0.02;
export const GRID_ACTIVE_INTRO_SCALE_SECONDS = 0.95;
export const GRID_ACTIVE_INTRO_TRAVEL_SECONDS = 1.15;
export const GRID_EXTRA_INTRO_SCALE_SECONDS = 0.75;
export const GRID_EXTRA_INTRO_TRAVEL_SECONDS = 0.95;
export const VIEW_TRANSITION_SECONDS = 0.55;
export const MODAL_TRANSITION_SECONDS = 0.68;

export const LIST_ROW_HEIGHT = 64;
export const DESKTOP_ACTIVE_MEDIA = 4;
export const MOBILE_ACTIVE_MEDIA = 3;
