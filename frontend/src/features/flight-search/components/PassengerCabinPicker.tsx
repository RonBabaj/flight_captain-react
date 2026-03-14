import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { AppIcon } from '../../../components/AppIcon';
import type { CreateSearchSessionRequest } from '../../../types';

const CABIN_OPTIONS: Array<CreateSearchSessionRequest['cabinClass']> = [
  'ECONOMY',
  'PREMIUM_ECONOMY',
  'BUSINESS',
  'FIRST',
];

export interface PassengerCabinPickerProps {
  adults: number;
  children: number;
  cabinClass: CreateSearchSessionRequest['cabinClass'];
  onAdultsChange: (n: number) => void;
  onChildrenChange: (n: number) => void;
  onCabinChange: (c: CreateSearchSessionRequest['cabinClass']) => void;
  label?: string;
  /** When true, hide cabin class selector (e.g. for deals page) */
  passengersOnly?: boolean;
  /** Called when user taps Done; use to trigger a re-search with updated params */
  onDone?: () => void;
}

export function PassengerCabinPicker({
  adults,
  children,
  cabinClass,
  onAdultsChange,
  onChildrenChange,
  onCabinChange,
  label,
  passengersOnly = false,
  onDone,
}: PassengerCabinPickerProps) {
  const { theme } = useTheme();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const displayLabel = label ?? t('passengers_cabin');

  const cabinLabelKey =
    cabinClass === 'ECONOMY' ? 'cabin_economy' :
    cabinClass === 'PREMIUM_ECONOMY' ? 'cabin_premium_economy' :
    cabinClass === 'BUSINESS' ? 'cabin_business' :
    'cabin_first';
  const summary =
    `${adults} ${adults === 1 ? t('adult') : t('adults')}` +
    (children > 0 ? `, ${children} ${children === 1 ? t('child') : t('children')}` : '') +
    (passengersOnly ? '' : ` · ${t(cabinLabelKey)}`);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{displayLabel}</Text>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
          },
        ]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.triggerText, { color: theme.text }]} numberOfLines={1}>
          {summary}
        </Text>
        <AppIcon name="chevron-down" size={18} color={theme.textMuted} fallbackText="" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View
            style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>{passengersOnly ? t('passengers_cabin') : t('passengers_cabin')}</Text>

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{t('adults_label')}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => onAdultsChange(Math.max(1, adults - 1))}
                  style={[styles.stepperBtn, { backgroundColor: theme.controlBg }]}
                >
                  <Text style={[styles.stepperBtnText, { color: theme.text }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.stepperValue, { color: theme.text }]}>{adults}</Text>
                <TouchableOpacity
                  onPress={() => onAdultsChange(adults + 1)}
                  style={[styles.stepperBtn, { backgroundColor: theme.controlBg }]}
                >
                  <Text style={[styles.stepperBtnText, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>{t('children_label')}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => onChildrenChange(Math.max(0, children - 1))}
                  style={[styles.stepperBtn, { backgroundColor: theme.controlBg }]}
                >
                  <Text style={[styles.stepperBtnText, { color: theme.text }]}>−</Text>
                </TouchableOpacity>
                <Text style={[styles.stepperValue, { color: theme.text }]}>{children}</Text>
                <TouchableOpacity
                  onPress={() => onChildrenChange(children + 1)}
                  style={[styles.stepperBtn, { backgroundColor: theme.controlBg }]}
                >
                  <Text style={[styles.stepperBtnText, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {!passengersOnly && (
            <>
            <Text style={[styles.cabinLabel, { color: theme.text }]}>{t('cabin_class')}</Text>
            <View style={styles.cabinRow}>
              {CABIN_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.cabinBtn,
                    { backgroundColor: theme.cardBg, borderColor: theme.inputBorder },
                    cabinClass === c && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => onCabinChange(c)}
                >
                  <Text
                    style={[
                      styles.cabinBtnText,
                      { color: theme.text },
                      cabinClass === c && { color: '#fff' },
                    ]}
                  >
                    {t(c === 'ECONOMY' ? 'cabin_economy' : c === 'PREMIUM_ECONOMY' ? 'cabin_premium_economy' : c === 'BUSINESS' ? 'cabin_business' : 'cabin_first')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            </>
            )}
            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: theme.primary }]}
              onPress={() => {
                setOpen(false);
                onDone?.();
              }}
            >
              <Text style={styles.doneBtnText}>{t('done')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  trigger: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: { fontSize: 17, flex: 1 },
  chevron: { fontSize: 12, marginLeft: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  rowLabel: { fontSize: 17 },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: { fontSize: 22, fontWeight: '600' },
  stepperValue: { marginHorizontal: 16, fontSize: 18, minWidth: 28, textAlign: 'center' },
  cabinLabel: { fontSize: 17, fontWeight: '600', marginTop: 8, marginBottom: 10 },
  cabinRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cabinBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  cabinBtnText: { fontSize: 14 },
  doneBtn: { marginTop: 24, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  doneBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
