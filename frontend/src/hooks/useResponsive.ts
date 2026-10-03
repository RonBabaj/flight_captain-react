import { useState, useEffect, useMemo } from 'react';
import { Dimensions } from 'react-native';

/** Mobile-first breakpoints (logical px). */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 720,
  desktop: 1100,
} as const;

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
