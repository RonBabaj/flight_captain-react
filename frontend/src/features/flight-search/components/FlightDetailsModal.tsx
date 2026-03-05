import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { getAffiliateProvider, getOutboundLink, type AffiliateProvider } from '../../../api';
import { getAirlineName } from '../../../data/airlines';
import { getDisplayPrice } from '../../../utils/exchangeRates';
import type { FlightOption, FlightSegment } from '../../../types';

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function SegmentRow({
  seg,
  theme,
}: {
  seg: FlightSegment;
  theme: import('../../../theme/ThemeContext').Theme;
}) {
  return (
    <View style={styles.segmentRow}>
      <Text style={[styles.segmentCode, { color: theme.text }]}>{seg.from.code}</Text>
      <Text style={[styles.segmentTime, { color: theme.textMuted }]}>
        {formatTime(seg.departureTime)}
      </Text>
      <Text style={styles.dash}>→</Text>
      <Text style={[styles.segmentCode, { color: theme.text }]}>{seg.to.code}</Text>
      <Text style={[styles.segmentTime, { color: theme.textMuted }]}>
        {formatTime(seg.arrivalTime)}
      </Text>
      <Text style={[styles.segmentCarrier, { color: theme.textMuted }]}>
        {seg.marketingCarrier.name || seg.marketingCarrier.code} {seg.flightNumber}
      </Text>
    </View>
  );
}

function baggageLabel(baggageClass: FlightOption['baggageClass'], t: (k: string) => string): string {
  if (!baggageClass) return t('checked_bag_unknown');
  if (baggageClass === 'BAG_OK') return `${t('checked_bag')}: ${t('not_included')}`;
  if (baggageClass === 'BAG_INCLUDED') return `${t('checked_bag')}: ${t('included')}`;
  return t('checked_bag_unknown');
}

interface FlightDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  sessionId: string;
  option: FlightOption | null;
}

export function FlightDetailsModal({
  visible,
  onClose,
  sessionId,
  option,
}: FlightDetailsModalProps) {
  const { theme } = useTheme();
  const { t, currency: displayCurrency } = useLocale();
  const [provider, setProvider] = useState<AffiliateProvider | null>(null);
  const [bookLoading, setBookLoading] = useState(false);

  useEffect(() => {
    if (!visible || !sessionId || !option?.id) return;
    let cancelled = false;
    getAffiliateProvider(sessionId, option.id)
      .then((res) => {
        if (!cancelled) setProvider(res.provider);
      })
      .catch(() => {
        if (!cancelled) setProvider(null);
      });
    return () => {
      cancelled = true;
    };
  }, [visible, sessionId, option?.id]);

  const handleBook = async () => {
    if (!option) return;
    setBookLoading(true);
    try {
      const res = await getOutboundLink(sessionId, option.id);
      const canOpen = await Linking.canOpenURL(res.redirectUrl);
      if (canOpen) {
        await Linking.openURL(res.redirectUrl);
      } else {
        Alert.alert('Cannot open link', 'Your device cannot open this booking link.');
      }
    } catch (_e) {
      const origin = option.legs[0]?.segments[0]?.from?.code ?? '';
      const destination =
        option.legs[0]?.segments[option.legs[0].segments.length - 1]?.to?.code ?? '';
      const qStr = `Flights to ${destination} from ${origin}`;
      const fallbackUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent(qStr)}`;
      try {
        const canOpenFallback = await Linking.canOpenURL(fallbackUrl);
        if (canOpenFallback) {
          await Linking.openURL(fallbackUrl);
          Alert.alert(
            'Opened Google Flights',
            'Partner link was unavailable. Your search was opened in Google Flights.'
          );
        } else {
          Alert.alert(
            'Error',
            'Partner link unavailable. Ensure the backend is running with affiliate routes.'
          );
        }
      } catch {
        Alert.alert('Error', 'Could not open booking link.');
      }
    } finally {
      setBookLoading(false);
    }
  };

  if (!option) return null;

  const validatingCode = option.validatingAirlines?.[0];
  const validatingName = getAirlineName(validatingCode) ?? validatingCode ?? 'Flight';

  const { width } = useWindowDimensions();
  const isNarrow = width < 600;
  const modalStyle = isNarrow
    ? [styles.card, styles.cardBottomSheet, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]
    : [styles.card, styles.cardCentered, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }, isNarrow && styles.overlayBottomSheet]}>
        <View style={modalStyle}>
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.title, { color: theme.text }]}>{t('flight_details')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: theme.primary }]}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.price, { color: theme.primary }]}>
              {(() => {
                const { amount, currency } = getDisplayPrice(
                  option.price.amount,
                  option.price.currency,
                  displayCurrency
                );
                return `${currency} ${amount.toFixed(2)}`;
              })()}
            </Text>
            <Text style={[styles.airline, { color: theme.text }]}>{validatingName}</Text>
            <Text style={[styles.meta, { color: theme.textMuted }]}>
              {formatDuration(option.durationMinutes)} ·{' '}
              {option.legs.reduce((a, l) => a + l.segments.length - 1, 0) === 0
                ? t('direct')
                : `${option.legs.reduce((a, l) => a + l.segments.length - 1, 0)} ${t('stops')}`}
            </Text>
            {option.baggageClass != null && (
              <View style={styles.badgeWrap}>
                <Text style={[styles.badge, { color: theme.textMuted }]}>
                  {t('cabin_bag_1')}
                </Text>
                <Text style={[styles.badge, { color: theme.textMuted }]}>
                  {baggageLabel(option.baggageClass, t)}
                </Text>
              </View>
            )}
            {option.legs.map((leg, i) => (
              <View key={i} style={styles.legBlock}>
                <Text style={[styles.legLabel, { color: theme.text }]}>
                  {option.legs.length > 1 ? (i === 0 ? t('outbound') : t('return_leg')) : t('flight_leg')}
                </Text>
                {leg.segments.map((seg, j) => (
                  <SegmentRow key={j} seg={seg} theme={theme} />
                ))}
              </View>
            ))}
          </ScrollView>
          <View style={[styles.footer, { borderTopColor: theme.cardBorder }]}>
            <TouchableOpacity
              style={[styles.bookBtn, { backgroundColor: theme.primary }]}
              onPress={handleBook}
              disabled={bookLoading}
            >
              {bookLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.bookBtnText}>
                  {t('book_on')} {provider?.name ?? t('partner_site')}
                </Text>
              )}
            </TouchableOpacity>
            <Text style={[styles.disclaimer, { color: theme.textMuted }]}>
              {t('booking_disclaimer')}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBottomSheet: {
    justifyContent: 'flex-end',
  },
  card: {
    borderWidth: 1,
  },
  cardBottomSheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  cardCentered: {
    alignSelf: 'center',
    marginVertical: 24,
    borderRadius: 16,
    maxHeight: '85%',
    maxWidth: 480,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: { fontSize: 20, fontWeight: '700' },
  closeBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  closeText: { fontSize: 16, fontWeight: '600' },
  scroll: { maxHeight: 400 },
  scrollContent: { padding: 20, paddingBottom: 24 },
  price: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  airline: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  meta: { fontSize: 15, marginBottom: 12 },
  badgeWrap: { flexDirection: 'row', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  badge: { fontSize: 13 },
  legBlock: { marginTop: 16 },
  legLabel: { fontWeight: '600', marginBottom: 8, fontSize: 16 },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    flexWrap: 'wrap',
  },
  segmentCode: { fontWeight: '700', marginRight: 10, fontSize: 15 },
  segmentTime: { marginRight: 10, fontSize: 15 },
  dash: { marginRight: 10 },
  segmentCarrier: { marginLeft: 10, fontSize: 14 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  bookBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  bookBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  disclaimer: { marginTop: 12, fontSize: 13 },
});
