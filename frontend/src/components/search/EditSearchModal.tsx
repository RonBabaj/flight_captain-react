import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { AppIcon } from '../AppIcon';
import { useTheme } from '../../theme/ThemeContext';
import { useLocale } from '../../context/LocaleContext';

export interface EditSearchModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Taller scroll area for multi-leg dynamic destinations forms */
  tall?: boolean;
}

/** Shared fade modal shell for editing search parameters on results screens. */
export function EditSearchModal({ visible, onClose, title, children, tall = false }: EditSearchModalProps) {
  const { theme } = useTheme();
  const { t } = useLocale();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[s.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <View style={[s.header, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[s.title, { color: theme.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <AppIcon name="close" size={24} color={theme.textMuted} fallbackText={t('close')} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={[s.scroll, tall ? s.scrollTall : null]}
            contentContainerStyle={s.content}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    flexShrink: 0,
  },
  title: { fontSize: 18, fontWeight: '700', flex: 1 },
  closeBtn: { padding: 6 },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 480,
  },
  scrollTall: {
    maxHeight: 560,
  },
  content: {
    padding: 18,
    paddingBottom: 28,
    flexGrow: 1,
  },
});
