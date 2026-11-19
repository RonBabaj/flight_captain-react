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

export const motion = motionTokens;