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
import { getUniformBookingRedirectUrl } from '../../../api';
import { getAirlineName } from '../../../data/airlines';
import { getDisplayPrice } from '../../../utils/exchangeRates';
import type { FlightOption, FlightSegment } from '../../../types';

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

/** Time for segment display (e.g. "08:00 AM") – same as monthly deals modal. */
function formatSegmentTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Leg date from first segment departure (YYYY-MM-DD). */
function legDate(segments: FlightSegment[]): string {
  if (!segments?.length) return '';
  const iso = segments[0].departureTime;
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 10);
}

/** Layover minutes between previous segment arrival and this segment departure. */
function layoverMinutes(segments: FlightSegment[], idx: number): number {
  if (idx <= 0) return 0;
  const prevArr = new Date(segments[idx - 1].arrivalTime).getTime();
  const dep = new Date(segments[idx].departureTime).getTime();
  return Math.round((dep - prevArr) / 60000);
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
  const [bookLoading, setBookLoading] = useState(false);

  const handleBook = async () => {
    if (!option) return;
    setBookLoading(true);
    try {
      const url = getUniformBookingRedirectUrl(sessionId, option.id);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open link', 'Your device cannot open this booking link.');
      }
    } catch {
      const origin = option.legs[0]?.segments[0]?.from?.code ?? '';
      const destination =
        option.legs[0]?.segments[option.legs[0].segments.length - 1]?.to?.code ?? '';
      const qStr = `Flights to ${destination} from ${origin}`;
      const fallbackUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent(qStr)}`;
      try {
        if (await Linking.canOpenURL(fallbackUrl)) {
          await Linking.openURL(fallbackUrl);
        } else {
          Alert.alert('Error', 'Could not open booking link.');
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
            {option.baggageClass === 'BAG_OK' || option.baggageClass === 'BAG_INCLUDED' ? (
              <View style={styles.badgeWrap}>
                <Text style={[styles.badge, { color: theme.textMuted }]}>
                  {baggageLabel(option.baggageClass, t)}
                </Text>
              </View>
            ) : null}
            {option.legs.map((leg, legIdx) => {
              const legDateStr = legDate(leg.segments);
              const legLabel =
                option.legs.length > 1
                  ? legIdx === 0
                    ? t('outbound')
                    : t('return_leg')
                  : t('flight_leg');
              return (
                <View key={legIdx} style={styles.legBlock}>
                  <Text style={[styles.legLabel, { color: theme.textMuted }]}>
                    {legLabel}{legDateStr ? ` · ${legDateStr}` : ''}
                  </Text>
                  {leg.segments.map((seg, segIdx) => {
                    const layover = layoverMinutes(leg.segments, segIdx);
                    const depTime = formatSegmentTime(seg.departureTime);
                    const arrTime = formatSegmentTime(seg.arrivalTime);
                    const carrier = seg.marketingCarrier?.code || seg.marketingCarrier?.name || '';
                    return (
                      <View key={segIdx} style={styles.segmentBlock}>
                        {segIdx > 0 && layover > 0 && (
                          <Text style={[styles.layoverText, { color: theme.textMuted }]}>
                            {t('layover_in')} {leg.segments[segIdx - 1].to.code} · {Math.floor(layover / 60)}h {layover % 60}m
                          </Text>
                        )}
                        <Text style={[styles.segmentLine, { color: theme.text }]}>
                          {seg.from.code} {depTime} → {seg.to.code} {arrTime} · {carrier} {seg.flightNumber}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
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
                  {t('book')}
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
  segmentBlock: { marginBottom: 4 },
  layoverText: { fontSize: 13, marginBottom: 4 },
  segmentLine: { fontSize: 15 },
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
