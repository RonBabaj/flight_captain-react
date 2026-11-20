import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLocale } from '../context/LocaleContext';

export type SearchLoadPhase = 1 | 2 | 3;

interface Props {
  phase: SearchLoadPhase;
}

const STEPS: { key: string; phase: SearchLoadPhase }[] = [
  { key: 'search_step_scan', phase: 1 },
  { key: 'search_step_compare', phase: 2 },
  { key: 'search_step_ready', phase: 3 },
];

/** Three-step progress for long-running flight searches. */
export function SearchStepIndicator({ phase }: Props) {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {STEPS.map((step, i) => {
        const active = phase >= step.phase;
        const current = phase === step.phase;
        return (
          <React.Fragment key={step.key}>
            {i > 0 ? (
              <View
                style={[
                  styles.connector,
                  { backgroundColor: phase > step.phase ? theme.primary : theme.cardBorder },
                ]}
              />
            ) : null}
            <View style={styles.step}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: active ? theme.buttonBg : theme.controlBg,
                    borderColor: current ? theme.primary : theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dotText,
                    { color: active ? theme.buttonText : theme.textMuted, fontFamily: theme.fontBody },
                  ]}
                >
                  {step.phase}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: current ? theme.text : theme.textMuted,
                    fontFamily: theme.fontBody,
                    fontWeight: current ? '700' : '500',
                  },
                ]}
                numberOfLines={2}
              >
                {t(step.key)}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  step: { flex: 1, alignItems: 'center', gap: 6, minWidth: 72 },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: { fontSize: 13, fontWeight: '800' },
  label: { fontSize: 11, lineHeight: 14, textAlign: 'center' },
  connector: {
    width: 24,
    height: 2,
    marginTop: 14,
    flexShrink: 0,
  },
});