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
}

export function PassengerCabinPicker({
  adults,
  children,
  cabinClass,
  onAdultsChange,
  onChildrenChange,
  onCabinChange,
  label = 'Passengers & cabin',
}: PassengerCabinPickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const summary =
    `${adults} adult${adults !== 1 ? 's' : ''}` +
    (children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : '') +
    ` · ${cabinClass.replace('_', ' ')}`;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
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
        <Text style={[styles.chevron, { color: theme.textMuted }]}>▼</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View
            style={[styles.modalCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>Passengers & cabin</Text>

            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Adults</Text>
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
              <Text style={[styles.rowLabel, { color: theme.text }]}>Children</Text>
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
            <Text style={[styles.cabinLabel, { color: theme.text }]}>Cabin class</Text>
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
                    {c.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.doneBtn, { backgroundColor: theme.primary }]}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.doneBtnText}>Done</Text>
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
