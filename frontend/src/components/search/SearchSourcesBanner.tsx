import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import type { ProviderSearchStats } from '../../types';

/** User-visible slice of backend providerStats.error (ops detail without VPS jargon). */
function formatProviderError(raw: string): string {
  let s = raw.trim();
  if (!s) return '';
  const lower = s.toLowerCase();
  if (lower.includes('perimeterx') || lower.includes('captcha')) {
    return 'blocked by bot protection';
  }
  if (lower.includes('site time budget')) return 'timed out';
  if (lower.includes('context deadline')) return 'timed out';
  s = s.replace(/^multisite scraper:\s*/i, '');
  const noOffers = s.match(/no offers \((.+)\)$/i);
  if (noOffers) {
    return noOffers[1]
      .replace(/skyscanner:/gi, 'Skyscanner')
      .replace(/kiwi:/gi, 'Kiwi')
      .slice(0, 160);
  }
  return s.length > 160 ? `${s.slice(0, 157)}…` : s;
}

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
  /** Live breakdown from merged results (skyscanner vs kiwi cards). */
  sourceCounts?: { googleflights2: number; kiwi: number; skyscanner: number; other: number };
}

/** Shows which providers contributed to the current results session. */
export function SearchSourcesBanner({
  stats,
  loadedCount,
  totalCount,
  sourceCounts,
}: SearchSourcesBannerProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const summary = useMemo(() => {
    if (!stats?.length) return null;
    const parts = stats.map((s) => {
      const name = labelForProvider(s.provider, t);
      if (s.error) {
        const detail = formatProviderError(s.error);
        return detail ? `${name}: ${detail}` : `${name}: ${t('search_source_failed')}`;
      }
      return `${name}: ${s.results}`;
    });
    const multisite = stats.find((s) => s.provider === 'multisite');
    const gf2 = stats.find((s) => s.provider === 'googleflights2');
    const gf2Only = !!(gf2 && gf2.results > 0 && multisite && multisite.results === 0);
    const otaFailed = !!(multisite?.error && multisite.results === 0);
    return { parts: parts.join(' · '), gf2Only, otaFailed };
  }, [stats, t]);

  if (!summary) return null;

  const hasProviderErrors = stats?.some((s) => Boolean(s.error?.trim())) ?? false;
  const showWarning = (summary.gf2Only && summary.otaFailed) || hasProviderErrors;
  const showPaginationHint =
    !showWarning && totalCount != null && totalCount > loadedCount && loadedCount > 0;

  if (!showWarning && !showPaginationHint) return null;

  const countLabel =
    showPaginationHint
      ? t('results_loaded_of_total')
          .replace('{loaded}', String(loadedCount))
          .replace('{total}', String(totalCount))
      : t('results_count').replace('{n}', String(loadedCount));

  if (showPaginationHint && !showWarning) {
    return (
      <Text
        style={[
          styles.inlineCount,
          { color: theme.textMuted, fontFamily: theme.fontBody, marginHorizontal: 12, marginBottom: 8 },
        ]}
        accessibilityRole="text"
      >
        {countLabel}
      </Text>
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: summary.gf2Only && summary.otaFailed ? theme.warningBg : theme.cardBg,
          borderColor: theme.cardBorder,
        },
      ]}
      accessibilityRole="summary"
    >
      {showPaginationHint ? (
        <Text style={[styles.count, { color: theme.textMuted, fontFamily: theme.fontBody }]}>{countLabel}</Text>
      ) : null}
      {showWarning ? (
        <Text style={[styles.count, { color: theme.text, fontFamily: theme.fontBody }]}>{countLabel}</Text>
      ) : null}
      {showWarning ? (
        <Text style={[styles.sources, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
          {summary.parts}
        </Text>
      ) : null}
      {summary.gf2Only && summary.otaFailed ? (
        <Text style={[styles.warn, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
          {t('search_ota_unavailable')}
          {(() => {
            const ms = stats?.find((s) => s.provider === 'multisite')?.error;
            const detail = ms ? formatProviderError(ms) : '';
            return detail ? ` (${detail})` : '';
          })()}
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
  inlineCount: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  sources: { fontSize: 11, lineHeight: 15 },
  warn: { fontSize: 11, lineHeight: 15 },
});