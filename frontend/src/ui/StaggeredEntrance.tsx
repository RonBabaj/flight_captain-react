import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { motion, useReducedMotion } from '../theme/motion';

const MAX_STAGGER = 6;
const STAGGER_MS = 55;

/** Fade/slide-in for list items (results). */
export function StaggeredEntrance({
  index,
  children,
  style,
}: {
  index: number;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : 10)).current;

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    const delay = Math.min(index, MAX_STAGGER) * STAGGER_MS;
    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.standardMs,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.standardMs,
        delay,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [index, opacity, translateY, reducedMotion]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}