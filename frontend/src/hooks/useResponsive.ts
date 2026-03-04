import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    const { width } = Dimensions.get('window');
    return width < BREAKPOINT;
  });

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width < BREAKPOINT);
    });
    return () => sub?.remove();
  }, []);

  return isMobile;
}
