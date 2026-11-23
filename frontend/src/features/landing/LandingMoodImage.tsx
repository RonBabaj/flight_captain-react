import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  AIRPORT_FALLBACK_IMAGE,
  moodImageUrlForVariant,
} from '../../data/destinationMood';

export function LandingMoodImage({ uri, label }: { uri: string; label: string }) {
  const sized = moodImageUrlForVariant(uri, 'card');
  const [src, setSrc] = useState(sized);
  useEffect(() => {
    setSrc(sized);
  }, [sized]);
  return (
    <Image
      source={{ uri: src }}
      style={StyleSheet.absoluteFillObject}
      resizeMode="cover"
      accessibilityLabel={label}
      accessible
      onError={() => {
        setSrc((cur) =>
          cur === AIRPORT_FALLBACK_IMAGE
            ? cur
            : moodImageUrlForVariant(AIRPORT_FALLBACK_IMAGE, 'card'),
        );
      }}
    />
  );
}