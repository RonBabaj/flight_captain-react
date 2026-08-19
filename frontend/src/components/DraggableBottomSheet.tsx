import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native';

const COLLAPSED_RATIO = 0.42;
const EXPANDED_RATIO = 0.92;
const DRAG_THRESHOLD_PX = 6;

export function SheetDragHandle({ color }: { color: string }) {
  return (
    <View style={styles.handleWrap} accessibilityRole="adjustable" accessibilityLabel="Drag to resize">
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
  const minH = Math.round(windowHeight * COLLAPSED_RATIO);
  const maxH = Math.round(windowHeight * EXPANDED_RATIO);
  const midH = (minH + maxH) / 2;

  const heightAnim = useRef(new Animated.Value(minH)).current;
  const dragStart = useRef(minH);

  useEffect(() => {
    if (!enabled) return;
    heightAnim.setValue(minH);
    dragStart.current = minH;
  }, [enabled, minH, resetKey, heightAnim]);

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
        const next = Math.min(maxH, Math.max(minH, dragStart.current - gesture.dy));
        heightAnim.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => {
        heightAnim.stopAnimation((value) => {
          const flingUp = gesture.vy < -0.45;
          const flingDown = gesture.vy > 0.45;
          let target = minH;
          if (flingUp) {
            target = maxH;
          } else if (flingDown) {
            target = minH;
          } else {
            target = value >= midH ? maxH : minH;
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
  }, [enabled, heightAnim, maxH, midH, minH]);

  return { heightAnim, panHandlers, minH, maxH };
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
