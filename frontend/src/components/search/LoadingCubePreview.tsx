/**
 * Placeholder 3D cube preview for search loading — web CSS 3D; native falls back to spinner.
 * Inspired by token-driven cube loaders (spinning faces → presence while results assemble).
 */
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export function LoadingCubePreview({ size = 72 }: { size?: number }) {
  const { theme } = useTheme();

  if (Platform.OS !== 'web') {
    return <ActivityIndicator size="large" color={theme.primary} />;
  }

  const half = size / 2;
  const faceBase = {
    position: 'absolute' as const,
    width: size,
    height: size,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    backgroundColor: theme.isDark ? 'rgba(61, 126, 181, 0.22)' : 'rgba(22, 58, 95, 0.12)',
    backfaceVisibility: 'hidden' as const,
  };

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      nativeID="fc-loading-cube-stage"
      style={[styles.stage, { width: size * 1.6, height: size * 1.6 }]}
    >
      <View
        nativeID="fc-loading-cube"
        style={[
          styles.cube,
          {
            width: size,
            height: size,
            // @ts-expect-error RN web transformStyle
            transformStyle: 'preserve-3d',
          },
        ]}
      >
        <View style={[faceBase, { transform: [{ translateZ: half }] }]} />
        <View
          style={[
            faceBase,
            {
              opacity: 0.85,
              transform: [{ rotateY: '180deg' }, { translateZ: half }],
            },
          ]}
        />
        <View
          style={[
            faceBase,
            {
              opacity: 0.75,
              backgroundColor: theme.isDark ? 'rgba(61, 126, 181, 0.32)' : 'rgba(22, 58, 95, 0.18)',
              transform: [{ rotateY: '90deg' }, { translateZ: half }],
            },
          ]}
        />
        <View
          style={[
            faceBase,
            {
              opacity: 0.75,
              backgroundColor: theme.isDark ? 'rgba(61, 126, 181, 0.32)' : 'rgba(22, 58, 95, 0.18)',
              transform: [{ rotateY: '-90deg' }, { translateZ: half }],
            },
          ]}
        />
        <View
          style={[
            faceBase,
            {
              opacity: 0.65,
              backgroundColor: theme.price + '33',
              transform: [{ rotateX: '90deg' }, { translateZ: half }],
            },
          ]}
        />
        <View
          style={[
            faceBase,
            {
              opacity: 0.65,
              backgroundColor: theme.price + '33',
              transform: [{ rotateX: '-90deg' }, { translateZ: half }],
            },
          ]}
        />
      </View>
      <CubeSpinStyles />
    </View>
  );
}

/** Inject keyframes once for the web cube spin (RN StyleSheet cannot define @keyframes). */
function CubeSpinStyles() {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current || typeof document === 'undefined') return;
    if (document.getElementById('fc-loading-cube-keyframes')) {
      injected.current = true;
      return;
    }
    const style = document.createElement('style');
    style.id = 'fc-loading-cube-keyframes';
    style.textContent = `
@keyframes fc-cube-spin {
  0% { transform: rotateX(-18deg) rotateY(0deg); }
  100% { transform: rotateX(-18deg) rotateY(360deg); }
}
#fc-loading-cube-stage {
  perspective: 600px;
}
#fc-loading-cube {
  animation: fc-cube-spin 2.8s linear infinite;
  transform-style: preserve-3d;
}
@media (prefers-reduced-motion: reduce) {
  #fc-loading-cube { animation: none; }
}
`;
    document.head.appendChild(style);
    injected.current = true;
  }, []);
  return null;
}

/** Soft pulse wrapper for native / reduced-motion friendly presence. */
export function LoadingCubePulse({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.55, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    // @ts-expect-error perspective is web CSS
    perspective: 600,
  },
  cube: {
    position: 'relative',
  },
});
