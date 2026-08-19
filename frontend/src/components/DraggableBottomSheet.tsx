import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';

/** Comfortable default — matches the original ~80% bottom sheet. */
const DEFAULT_RATIO = 0.8;
/** Optional expansion when the user drags up for more room. */
const EXPANDED_RATIO = 0.96;
const DRAG_THRESHOLD_PX = 6;

export function SheetDragHandle({ color }: { color: string }) {
  return (
    <View style={styles.handleWrap} accessibilityRole="adjustable" accessibilityLabel="Drag to expand">
      <View style={styles.handleDots}>
        {Array.from({ length: 6 }, (_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  );
}

export function useDraggableSheetHeight(
  windowHeight: number,
  enabled: boolean,
  resetKey?: string | number | boolean,
) {
  const defaultH = Math.round(windowHeight * DEFAULT_RATIO);
  const expandedH = Math.round(windowHeight * EXPANDED_RATIO);
  const midH = (defaultH + expandedH) / 2;

  const heightAnim = useRef(new Animated.Value(defaultH)).current;
  const dragStart = useRef(defaultH);

  useEffect(() => {
    if (!enabled) return;
    heightAnim.setValue(defaultH);
    dragStart.current = defaultH;
  }, [enabled, defaultH, resetKey, heightAnim]);

  const panHandlers = useMemo(() => {
    if (!enabled) return {} as ViewProps;

    const pan = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > DRAG_THRESHOLD_PX,
      onPanResponderGrant: () => {
        heightAnim.stopAnimation((value) => {
          dragStart.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = Math.min(expandedH, Math.max(defaultH, dragStart.current - gesture.dy));
        heightAnim.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        heightAnim.stopAnimation((value) => {
          const flingUp = gesture.vy < -0.45;
          const flingDown = gesture.vy > 0.45;
          let target = defaultH;
          if (flingUp) {
            target = expandedH;
          } else if (flingDown) {
            target = defaultH;
          } else {
            target = value >= midH ? expandedH : defaultH;
          }
          dragStart.current = target;
          Animated.spring(heightAnim, {
            toValue: target,
            useNativeDriver: false,
            bounciness: 3,
            speed: 18,
          }).start();
        });
      },
      onPanResponderTerminationRequest: () => false,
    });

    return pan.panHandlers;
  }, [enabled, heightAnim, expandedH, midH, defaultH]);

  return { heightAnim, panHandlers, defaultH, expandedH };
}

const styles = StyleSheet.create({
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  handleDots: {
    width: 36,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    opacity: 0.55,
  },
});
