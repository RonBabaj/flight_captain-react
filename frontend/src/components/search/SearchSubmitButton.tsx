import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { AppIcon } from '../AppIcon';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { formCardStyles } from './formStyles';
import { getPhrasesForLanguage, SEARCH_BUTTON_PHRASES } from './searchLoadingPhrases';

export interface SearchSubmitButtonProps {
  label: string;
  icon?: string;
  loading: boolean;
  disabled?: boolean;
  onPress: () => void;
  compact?: boolean;
}

/** Primary search CTA with rotating loading phrases (matches regular search UX). */
export function SearchSubmitButton({
  label,
  icon = 'search',
  loading,
  disabled = false,
  onPress,
  compact = false,
}: SearchSubmitButtonProps) {
  const { theme } = useTheme();
  const { language } = useLocale();
  const phrases = getPhrasesForLanguage(SEARCH_BUTTON_PHRASES, language);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!loading) {
      setPhraseIdx(0);
      fadeAnim.setValue(1);
      return;
    }
    const cycle = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      setPhraseIdx((i) => (i + 1) % phrases.length);
    };
    const id = setInterval(cycle, 2000);
    return () => clearInterval(id);
  }, [loading, phrases.length, fadeAnim]);

  return (
    <TouchableOpacity
      style={[
        formCardStyles.searchBtn,
        compact && formCardStyles.searchBtnCompact,
        { backgroundColor: theme.buttonBg },
        (loading || disabled) && formCardStyles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <ActivityIndicator size="small" color={theme.buttonText} />
          <Animated.Text
            style={[
              formCardStyles.searchBtnText,
              compact && formCardStyles.searchBtnTextCompact,
              { color: theme.buttonText, opacity: fadeAnim },
            ]}
          >
            {phrases[phraseIdx]}
          </Animated.Text>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <AppIcon name={icon} size={16} color={theme.buttonText} fallbackText={label} />
          <Text
            style={[
              formCardStyles.searchBtnText,
              compact && formCardStyles.searchBtnTextCompact,
              { color: theme.buttonText },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
