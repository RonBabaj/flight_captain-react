import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { AppIcon } from '../AppIcon';
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
  if (lower.includes('gf2_empty_upstream')) return 'no Google Flights offers for this route';
  s = s.replace(/^multisite scraper:\s*/i, '');
  const noOffers = s.match(/no offers \((.+)\)$/i);
  if (noOffers) {
    return noOffers[1]
      .replace(/skyscanner:/gi, 'Skyscanner')
      .replace(/kiwi:/gi, 'Kiwi')
      .slice(0, 120);
  }
  return s.length > 120 ? `${s.slice(0, 117)}…` : s;
}

function labelForProvider(provider: string, t: (key: string) => string): string {
  const p = provider.toLowerCase();
  if (p === 'googleflights2' || p === 'gf2') return t('source_googleflights2');
  if (p === 'multisite') return t('source_multisite');
  if (p === 'kiwi') return t('source_kiwi');
  if (p === 'skyscanner') return t('source_skyscanner');
  return provider;
}

type ProviderChip = {
  id: string;
  label: string;
  tone: 'ok' | 'warn' | 'fail';
  line: string;
};

function providerChips(stats: ProviderSearchStats[], t: (key: string) => string): ProviderChip[] {
  return stats.map((s) => {
    const label = labelForProvider(s.provider, t);
    if (s.error?.trim()) {
      const detail = formatProviderError(s.error);
      return {
        id: s.provider,
        label,
        tone: 'fail',
        line: detail || t('search_source_failed'),
      };
    }
    if ((s.results ?? 0) > 0) {
      return {
        id: s.provider,
        label,
        tone: 'ok',
        line: String(s.results),
      };
    }
    const note = s.note?.trim() ? formatProviderError(s.note) : '';
    return {
      id: s.provider,
      label,
      tone: 'warn',
      line: note || t('search_source_failed'),
    };
  });
}

interface SearchSourcesBannerProps {
  stats: ProviderSearchStats[] | null | undefined;
  loadedCount: number;
  totalCount?: number;
  /** Live breakdown from merged results (skyscanner vs kiwi cards). */
  sourceCounts?: { googleflights2: number; kiwi: number; skyscanner: number; other: number };
}

/** Compact provider status on results — warnings in a small card; pagination count stays inline. */
export function SearchSourcesBanner({
  stats,
  loadedCount,
  totalCount,
}: SearchSourcesBannerProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  const meta = useMemo(() => {
    if (!stats?.length) return null;
    const multisite = stats.find((s) => s.provider === 'multisite');
    const gf2 = stats.find((s) => s.provider === 'googleflights2');
    const gf2Only = !!(gf2 && gf2.results > 0 && multisite && multisite.results === 0);
    const otaFailed = !!(multisite?.error && multisite.results === 0);
    return {
      chips: providerChips(stats, t),
      gf2Only,
      otaFailed,
    };
  }, [stats, t]);

  if (!meta) return null;

  const hasProviderErrors = stats?.some((s) => Boolean(s.error?.trim())) ?? false;
  const showWarning = (meta.gf2Only && meta.otaFailed) || hasProviderErrors;
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
          { color: theme.textMuted, fontFamily: theme.fontBody, marginBottom: 8 },
        ]}
        accessibilityRole="text"
      >
        {countLabel}
      </Text>
    );
  }

  const warnBg = meta.gf2Only && meta.otaFailed ? theme.warningBg : theme.cardBg;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: warnBg,
          borderColor: hasProviderErrors ? theme.warning : theme.cardBorder,
        },
      ]}
      accessibilityRole="summary"
    >
      <View style={styles.headerRow}>
        {hasProviderErrors ? (
          <AppIcon name="alert-circle-outline" size={18} color={theme.warning} fallbackText="!" />
        ) : (
          <AppIcon name="information-circle-outline" size={18} color={theme.textMuted} fallbackText="i" />
        )}
        <Text style={[styles.count, { color: theme.text, fontFamily: theme.fontBody, flex: 1 }]} numberOfLines={2}>
          {countLabel}
        </Text>
      </View>

      <View style={styles.chipRow} accessibilityRole="text">
        {meta.chips.map((chip) => {
          const borderColor =
            chip.tone === 'fail' ? theme.warning : chip.tone === 'ok' ? theme.cardBorder : theme.cardBorder;
          const bg =
            chip.tone === 'fail' ? theme.warningBg : chip.tone === 'ok' ? theme.controlBg : theme.screenBg;
          const lineColor = chip.tone === 'fail' ? theme.warning : theme.textMuted;
          return (
            <View
              key={chip.id}
              style={[styles.chip, { backgroundColor: bg, borderColor }]}
            >
              <Text style={[styles.chipLabel, { color: theme.text, fontFamily: theme.fontBody }]} numberOfLines={1}>
                {chip.label}
              </Text>
              <Text style={[styles.chipLine, { color: lineColor, fontFamily: theme.fontBody }]} numberOfLines={2}>
                {chip.line}
              </Text>
            </View>
          );
        })}
      </View>

      {meta.gf2Only && meta.otaFailed ? (
        <Text style={[styles.warn, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
          {t('search_ota_unavailable')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  count: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  inlineCount: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minWidth: 108,
    maxWidth: '100%',
    flexGrow: 1,
    flexBasis: 108,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  chipLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  chipLine: { fontSize: 11, lineHeight: 14, fontWeight: '500' },
  warn: { fontSize: 11, lineHeight: 15 },
});