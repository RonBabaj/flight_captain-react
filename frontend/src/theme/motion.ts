import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { motion as motionTokens } from './tokens';

/** Respect OS reduced-motion (web). Native always animates unless caller checks. */
export function prefersReducedMotion(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** Duration in ms — 0 when user prefers reduced motion. */
export function useMotionDuration(ms: number): number {
  const reduced = useReducedMotion();
  return reduced ? 0 : ms;
}

export function motionDuration(ms: number, reduced: boolean): number {
  return reduced ? 0 : ms;
}

export const motion = motionTokens;