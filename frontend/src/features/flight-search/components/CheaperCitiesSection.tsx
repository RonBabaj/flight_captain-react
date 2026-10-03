import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  isMobile: boolean;
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
}

const MAX_VISIBLE = 5;

export function CheaperCitiesSection({
  loading,
  options,
  isMobile,
  folded,
  onToggleFold,
  onView,
  showAll = false,
  onShowMore,
  quietLoading = true,
}: Props) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();

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
});
