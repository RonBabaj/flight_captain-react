import { useState, useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';
import { layout } from '../theme/tokens';

/** Mobile-first breakpoints (logical px). */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 720,
  desktop: 1100,
} as const;

/** Narrow phones — extra-tight typography/spacing (e.g. 320px). */
export const NARROW_WIDTH = 360;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function widthToBreakpoint(width: number): Breakpoint {
  if (width >= BREAKPOINTS.desktop) return 'desktop';
  if (width >= BREAKPOINTS.tablet) return 'tablet';
  return 'mobile';
}

export function useWindowWidth(): number {
  const [width, setWidth] = useState(() => Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => sub?.remove();
  }, []);

  return width;
}

export function useBreakpoint(): Breakpoint {
  const width = useWindowWidth();
  return useMemo(() => widthToBreakpoint(width), [width]);
}

/** Legacy helper — treat tablet+phone as “compact chrome”. */
export function useIsMobile(): boolean {
  const bp = useBreakpoint();
  return bp === 'mobile';
}

/** True below desktop — useful for stacking sidebars. */
export function useIsCompactLayout(): boolean {
  const bp = useBreakpoint();
  return bp !== 'desktop';
}

export function useIsDesktop(): boolean {
  return useBreakpoint() === 'desktop';
}

/** Shared horizontal inset: 20 mobile, 24 tablet, 48 desktop (matches design tokens). */
export function useContentGutter(): number {
  const bp = useBreakpoint();
  if (bp === 'desktop') return layout.gutterDesktop;
  if (bp === 'tablet') return 24;
  return layout.gutterMobile;
}

export function useIsNarrowPhone(): boolean {
  return useWindowWidth() < NARROW_WIDTH;
}
