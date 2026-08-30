import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { AppIcon } from './AppIcon';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';

export interface ClearableTextInputProps extends TextInputProps {
  /** Show clear control when the field has text (default true). */
  clearable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onClear?: () => void;
}

export function ClearableTextInput({
  clearable = true,
  containerStyle,
  style,
  value,
  onChangeText,
  onClear,
  editable = true,
  ...rest
}: ClearableTextInputProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();
  const text = typeof value === 'string' ? value : '';
  const showClear = clearable && editable !== false && text.length > 0;

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <View style={[styles.wrap, containerStyle]}>
      <TextInput
        style={[
          showClear && (isRTL ? styles.inputWithClearRtl : styles.inputWithClear),
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        {...rest}
      />
      {showClear ? (
        <TouchableOpacity
          style={[styles.clearBtn, isRTL ? styles.clearBtnRtl : styles.clearBtnLtr]}
          onPress={handleClear}
          hitSlop={8}
          accessibilityLabel={t('clear_field')}
          accessibilityRole="button"
        >
          <AppIcon name="close" size={18} color={theme.textMuted} fallbackText="×" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  inputWithClear: { paddingRight: 44 },
  inputWithClearRtl: { paddingLeft: 44 },
  clearBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  clearBtnLtr: { right: 0 },
  clearBtnRtl: { left: 0 },
});
