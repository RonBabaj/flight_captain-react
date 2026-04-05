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
  /** Optional fields for debugging / parity with main-search positioning objects. */
  positioningPrice?: MonetaryAmount;
  hubFlightPrice?: MonetaryAmount;
  mainTripPrice?: MonetaryAmount;
  /** Reference date used for the live search sessions (set by monthly deals optimizer). */
  departureDate?: string;
}

interface Props {
  loading: boolean;
  options: CheaperCitiesOption[];
  isMobile: boolean;
  folded: boolean;
  onToggleFold: () => void;
  onView: (hub: string) => void;
  /** If true, all options are shown; otherwise only the top 5 are shown. */
  showAll?: boolean;
  /** Called when the user taps "See X more options". */
  onShowMore?: () => void;
}

const MAX_VISIBLE = 5;

export function CheaperCitiesSection({ loading, options, isMobile, folded, onToggleFold, onView, showAll = false, onShowMore }: Props) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();

  if (loading) {
    return (
      <View style={s.section}>
        <Text style={[s.title, { color: theme.textMuted }]}>
          {t('searching_cheaper_cities')}
        </Text>
      </View>
    );
  }

  if (!options || options.length === 0) return null;

  const visibleOptions = showAll ? options : options.slice(0, MAX_VISIBLE);
  const hiddenCount = options.length - MAX_VISIBLE;

  return (
    <View style={s.section}>
      <TouchableOpacity
        style={s.headerRow}
        onPress={() => isMobile && onToggleFold()}
        activeOpacity={isMobile ? 0.7 : 1}
        disabled={!isMobile}
      >
        <Text style={[s.title, { color: theme.text }]}>
          {t('cheaper_departure_cities')}
        </Text>
        {isMobile && (
          <View style={s.foldTrigger}>
            <Text style={[s.foldTriggerText, { color: theme.primary }]}>
              {folded ? `Show ${options.length} cities` : 'Collapse'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {(!isMobile || !folded) && (
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
                  <Text style={[s.hub, { color: theme.text }, isRTL && { textAlign: 'right' }]}>
                    {opt.hubAirport}
                  </Text>
                  <Text style={[s.meta, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
                    {totalLabel} · {t('save_label')} {savingsLabel}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[s.btn, { backgroundColor: theme.controlBg }]}
                  onPress={() => onView(opt.hubAirport)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.btnText, { color: theme.primary }]}>
                    {t('view_combination')}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {!showAll && hiddenCount > 0 && onShowMore && (
            <TouchableOpacity style={s.showMoreBtn} onPress={onShowMore} activeOpacity={0.7}>
              <Text style={[s.showMoreText, { color: theme.primary }]}>
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
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  foldTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  foldTriggerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 4,
    gap: 6,
  },
  hub: {
    fontSize: 13,
    fontWeight: '600',
  },
  meta: {
    fontSize: 11,
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  btnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  showMoreBtn: {
    alignItems: 'center',
    paddingVertical: 6,
    marginTop: 2,
  },
  showMoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
