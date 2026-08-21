import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { AppIcon } from '../AppIcon';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';
import { getCurrencySymbol } from '../../utils/exchangeRates';

export interface HubRouteLeg {
  label: string;
  amount: number;
  currency: string;
}

export interface HubRouteSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  routeTitle: string;
  legs: HubRouteLeg[];
  totalAmount: number;
  totalCurrency: string;
  directAmount: number;
  directCurrency: string;
  savingsAmount: number;
  savingsCurrency: string;
  footer: React.ReactNode;
}

/** Hub positioning route breakdown — shared by search results and monthly deals. */
export function HubRouteSummaryModal({
  visible,
  onClose,
  routeTitle,
  legs,
  totalAmount,
  totalCurrency,
  directAmount,
  directCurrency,
  savingsAmount,
  savingsCurrency,
  footer,
}: HubRouteSummaryModalProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <View
          style={[s.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[s.header, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[s.title, { color: theme.text }]} numberOfLines={2}>
              {routeTitle}
            </Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} hitSlop={8}>
              <AppIcon name="close" size={22} color={theme.textMuted} fallbackText={t('close')} />
            </TouchableOpacity>
          </View>

          <View style={s.body}>
            {legs.map((leg, idx) => (
              <View key={`${leg.label}-${idx}`} style={s.legRow}>
                <Text style={[s.legLabel, { color: theme.textMuted }]} numberOfLines={2}>
                  {leg.label}
                </Text>
                <Text style={[s.legPrice, { color: theme.text }]}>
                  {getCurrencySymbol(leg.currency)} {leg.amount.toFixed(0)}
                </Text>
              </View>
            ))}

            <View style={[s.divider, { backgroundColor: theme.cardBorder }]} />

            <View style={s.summaryRow}>
              <View style={s.summaryCol}>
                <Text style={[s.summaryLabel, { color: theme.textMuted }]}>{t('total_via_hub')}</Text>
                <Text style={[s.summaryValue, { color: theme.text }]}>
                  {getCurrencySymbol(totalCurrency)} {totalAmount.toFixed(0)}
                </Text>
              </View>
              <View style={s.summaryCol}>
                <Text style={[s.summaryLabel, { color: theme.textMuted }]}>{t('direct_flight')}</Text>
                <Text style={[s.summaryValue, { color: theme.text }]}>
                  {getCurrencySymbol(directCurrency)} {directAmount.toFixed(0)}
                </Text>
              </View>
              <View style={s.summaryCol}>
                <Text style={[s.summaryLabel, { color: theme.textMuted }]}>{t('you_save')}</Text>
                <Text style={[s.summaryValue, { color: theme.primary }]}>
                  {getCurrencySymbol(savingsCurrency)} {savingsAmount.toFixed(0)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[s.footer, { borderTopColor: theme.cardBorder }]}>{footer}</View>
        </View>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 15, fontWeight: '700', flex: 1 },
  closeBtn: { padding: 4, marginLeft: 10 },
  body: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10, gap: 10 },
  legRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  legLabel: { fontSize: 13, flex: 1 },
  legPrice: { fontSize: 14, fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryCol: { alignItems: 'center', gap: 2, flex: 1 },
  summaryLabel: { fontSize: 11, textAlign: 'center' },
  summaryValue: { fontSize: 15, fontWeight: '700' },
  footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth, gap: 10 },
});
