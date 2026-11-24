import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { getCurrencySymbol } from '../../../utils/exchangeRates';
import type { MonetaryAmount } from '../../../types';

export interface CheaperCitiesOption {
  hubAirport: string;
  totalPrice: MonetaryAmount;
  savings: MonetaryAmount;
  positioningPrice?: MonetaryAmount;
  hubFlightPrice?: MonetaryAmount;
  mainTripPrice?: MonetaryAmount;
  departureDate?: string;
}

interface Props {
  loading: boolean;
  options: CheaperCitiesOption[];
  folded: boolean;
  onToggleFold: () => void;
  onView: (hub: string) => void;
  showAll?: boolean;
  onShowMore?: () => void;
  /**
   * When true (default), hide the loud "searching…" block — parent can show a quiet chip.
   * Options still render when ready.
   */
  quietLoading?: boolean;
  /** `section` = list footer; `toolbar` = inline hub pills in results toolbar (tablet/desktop). */
  variant?: 'section' | 'toolbar';
}

const MAX_VISIBLE = 5;

export function CheaperCitiesSection({
  loading,
  options,
  folded,
  onToggleFold,
  onView,
  showAll = false,
  onShowMore,
  quietLoading = true,
  variant = 'section',
}: Props) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();

  if (variant === 'toolbar') {
    if (loading || !options?.length) return null;
    const visible = options.slice(0, 8);
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.toolbarScroll}
        contentContainerStyle={[s.toolbarRow, isRTL && { flexDirection: 'row-reverse' }]}
      >
        {visible.map((opt) => {
          const savingsCurrency = (opt.savings?.currency ?? 'USD') as string;
          const savingsAmount =
            typeof opt.savings?.amount === 'number' ? opt.savings.amount : Number(opt.savings?.amount ?? 0);
          const savingsLabel = `${getCurrencySymbol(savingsCurrency)} ${
            Number.isFinite(savingsAmount) ? savingsAmount.toFixed(0) : '0'
          }`;
          return (
            <TouchableOpacity
              key={opt.hubAirport}
              style={[s.toolbarPill, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}
              onPress={() => onView(opt.hubAirport)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`${opt.hubAirport} ${t('save_label')} ${savingsLabel}`}
            >
              <Text style={[s.toolbarHub, { color: theme.text, fontFamily: theme.fontDisplay }]}>{opt.hubAirport}</Text>
              <Text style={[s.toolbarSave, { color: theme.primary, fontFamily: theme.fontBody }]}>
                {t('save_label')} {savingsLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }

  if (loading) {
    if (quietLoading) return null;
    return (
      <View style={s.section}>
        <Text style={[s.quietLoading, { color: theme.textMuted, fontFamily: theme.fontBody }]}>
          {t('searching_cheaper_cities')}
        </Text>
      </View>
    );
  }

  if (!options || options.length === 0) return null;

  const visibleOptions = showAll ? options : options.slice(0, MAX_VISIBLE);
  const hiddenCount = options.length - MAX_VISIBLE;

  return (
    <View style={[s.section, { borderTopColor: theme.cardBorder }]}>
      <TouchableOpacity
        style={[s.headerRow, isRTL && { flexDirection: 'row-reverse' }]}
        onPress={onToggleFold}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: !folded }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[s.title, { color: theme.text, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>
            {t('cheaper_departure_cities')}
          </Text>
          <Text style={[s.subtitle, { color: theme.textMuted, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>
            {t('cheaper_cities_found').replace('{n}', String(options.length))}
          </Text>
        </View>
        <Text style={[s.foldTriggerText, { color: theme.primary, fontFamily: theme.fontBody }]}>
          {folded ? t('show') : t('collapse')}
        </Text>
      </TouchableOpacity>

      {!folded && (
        <>
          {visibleOptions.map((opt) => {
            const totalCurrency = (opt.totalPrice?.currency ?? 'USD') as string;
            const savingsCurrency = (opt.savings?.currency ?? 'USD') as string;
            const totalAmount =
              typeof opt.totalPrice?.amount === 'number' ? opt.totalPrice.amount : Number(opt.totalPrice?.amount ?? 0);
            const savingsAmount =
              typeof opt.savings?.amount === 'number' ? opt.savings.amount : Number(opt.savings?.amount ?? 0);

            const savingsLabel = `${getCurrencySymbol(savingsCurrency)} ${Number.isFinite(savingsAmount) ? savingsAmount.toFixed(0) : '0'}`;
            const totalLabel = `${getCurrencySymbol(totalCurrency)} ${Number.isFinite(totalAmount) ? totalAmount.toFixed(0) : '0'}`;

            return (
              <View
                key={opt.hubAirport}
                style={[s.row, { borderColor: theme.cardBorder }, isRTL && { flexDirection: 'row-reverse' }]}
              >
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[s.hub, { color: theme.text, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>
                    {opt.hubAirport}
                  </Text>
                  <Text style={[s.meta, { color: theme.textMuted, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>
                    {totalLabel} · {t('save_label')} {savingsLabel}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[s.btn, { backgroundColor: theme.controlBg }]}
                  onPress={() => onView(opt.hubAirport)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.btnText, { color: theme.primary, fontFamily: theme.fontBody }]}>
                    {t('view_combination')}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {!showAll && hiddenCount > 0 && onShowMore && (
            <TouchableOpacity style={s.showMoreBtn} onPress={onShowMore} activeOpacity={0.7}>
              <Text style={[s.showMoreText, { color: theme.primary, fontFamily: theme.fontBody }]}>
                {t('see_more_options').replace('{n}', String(hiddenCount))}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  quietLoading: { fontSize: 12, fontWeight: '500' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4,
  },
  title: { fontSize: 14, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
  foldTriggerText: { fontSize: 13, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  hub: { fontSize: 15, fontWeight: '700' },
  meta: { fontSize: 12, marginTop: 2 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnText: { fontSize: 13, fontWeight: '600' },
  showMoreBtn: { paddingVertical: 8, alignItems: 'center' },
  showMoreText: { fontSize: 13, fontWeight: '600' },
  toolbarScroll: { flexGrow: 0, flexShrink: 1, maxWidth: '100%' },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },
  toolbarPill: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 72,
    minHeight: 44,
  },
  toolbarHub: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  toolbarSave: { fontSize: 11, fontWeight: '600', marginTop: 1 },
});
