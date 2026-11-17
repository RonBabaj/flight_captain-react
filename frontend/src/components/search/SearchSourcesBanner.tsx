import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import type { ProviderSearchStats } from '../../types';

function labelForProvider(provider: string, t: (key: string) => string): string {
  const p = provider.toLowerCase();
  if (p === 'googleflights2' || p === 'gf2') return t('source_googleflights2');
  if (p === 'multisite') return t('source_multisite');
  if (p === 'kiwi') return t('source_kiwi');
  if (p === 'skyscanner') return t('source_skyscanner');
  return provider;
}

interface SearchSourcesBannerProps {
  stats: ProviderSearchStats[] | null | undefined;
  loadedCount: number;
  totalCount?: number;
}

/** Shows which providers contributed to the current results session. */
export function SearchSourcesBanner({ stats, loadedCount, totalCount }: SearchSourcesBannerProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const summary = useMemo(() => {
    if (!stats?.length) return null;
    const parts = stats.map((s) => {
      const name = labelForProvider(s.provider, t);
      if (s.error) {
        return `${name}: ${t('search_source_failed')}`;
      }
      return `${name}: ${s.results}`;
    });
    const multisite = stats.find((s) => s.provider === 'multisite');
    const gf2 = stats.find((s) => s.provider === 'googleflights2');
    const gf2Only = !!(gf2 && gf2.results > 0 && multisite && multisite.results === 0);
    return { parts: parts.join(' · '), gf2Only };
  }, [stats, t]);

  if (!summary) return null;

  const countLabel =
    totalCount != null && totalCount > loadedCount
      ? t('results_loaded_of_total')
          .replace('{loaded}', String(loadedCount))
          .replace('{total}', String(totalCount))
      : t('results_count').replace('{n}', String(loadedCount));

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: summary.gf2Only ? theme.warningBg : theme.cardBg,
          borderColor: theme.cardBorder,
        },
      ]}
      accessibilityRole="summary"
    >
      <Text style={[styles.count, { color: theme.text, fontFamily: theme.fontBody }]}>{countLabel}</Text>
      <Text style={[styles.sources, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
        {summary.parts}
      </Text>
      {summary.gf2Only ? (
        <Text style={[styles.warn, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
          {t('search_ota_unavailable')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  count: { fontSize: 13, fontWeight: '600' },
  sources: { fontSize: 11, lineHeight: 15 },
  warn: { fontSize: 11, lineHeight: 15 },
});