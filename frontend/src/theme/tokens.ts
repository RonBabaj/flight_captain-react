/**
 * Fly-Fix design tokens (Phase 1).
 * Premium travel utility — evolved boarding-pass + signal coral CTAs.
 */

export const palette = {
  aviationNavy: '#172A40',
  cloudPaper: '#F6F5F1',
  signalCoral: '#FF735C',
  mist: '#DFE8E8',
  deepEvergreen: '#263B37',
  white: '#FFFFFF',
} as const;

export const radius = {
  md: 12,
  lg: 16,
} as const;

/** 4px-based spacing scale */
export const space = {
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 16,
  spaceLg: 24,
  spaceXl: 32,
  space2Xl: 48,
  space3Xl: 64,
  space4Xl: 96,
} as const;

export const motion = {
  fastMs: 180,
  standardMs: 220,
  slowMs: 320,
} as const;

export const layout = {
  maxContentWidth: 1280,
  gutterMobile: 20,
  gutterDesktop: 48,
  /** Results chrome — slightly tighter than marketing pages so cards breathe horizontally. */
  resultsGutterDesktop: 28,
  resultsSearchColumnWidth: 272,
  resultsSearchColumnWidthTablet: 228,
  resultsFilterSidebarWidth: 224,
} as const;