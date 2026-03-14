import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { AppIcon } from '../../../components/AppIcon';
import { getUniformBookingRedirectUrl } from '../../../api';
import { getAirlineName } from '../../../data/airlines';
import { getAirportNameByCode } from '../../../data/airports';
import { getDisplayPrice, getCurrencySymbol } from '../../../utils/exchangeRates';
import type { FlightOption, FlightSegment } from '../../../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function toValidMs(iso: string | undefined | null): number {
  if (!iso) return NaN;
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return NaN;
  if (new Date(ms).getUTCFullYear() < 2000) return NaN;
  return ms;
}

function safeTime(iso: string | undefined | null): string {
  const ms = toValidMs(iso);
  if (!Number.isFinite(ms)) return '—';
  return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function safeDate(iso: string | undefined | null): string {
  const ms = toValidMs(iso);
  if (!Number.isFinite(ms)) return '';
  const d = new Date(ms);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatDuration(min: number): string {
  if (min <= 0) return '—';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function layoverBetween(segments: FlightSegment[], idx: number): number {
  if (idx <= 0 || idx >= segments.length) return 0;
  const finalDest = segments[segments.length - 1].to?.code || '';
  const connectAirport = segments[idx - 1].to?.code || '';
  if (connectAirport && connectAirport === finalDest) return 0;
  const prevArr = toValidMs(segments[idx - 1].arrivalTime);
  const dep = toValidMs(segments[idx].departureTime);
  if (!Number.isFinite(prevArr) || !Number.isFinite(dep) || dep <= prevArr) return 0;
  return Math.round((dep - prevArr) / 60000);
}

function cabinLabel(raw: string | undefined, t: (k: string) => string): string {
  if (!raw) return '';
  switch (raw) {
    case 'PREMIUM_ECONOMY': return t('cabin_premium_economy');
    case 'BUSINESS': return t('cabin_business');
    case 'FIRST': return t('cabin_first');
    default: return t('cabin_economy');
  }
}

function legDuration(segments: FlightSegment[]): number {
  if (!segments?.length) return 0;
  const depMs = toValidMs(segments[0].departureTime);
  const arrMs = toValidMs(segments[segments.length - 1].arrivalTime);
  if (Number.isFinite(depMs) && Number.isFinite(arrMs) && arrMs > depMs) {
    return Math.round((arrMs - depMs) / 60000);
  }
  return segments.reduce((sum, s) => sum + Math.max(0, s.durationMinutes || 0), 0);
}

// ─── Component ──────────────────────────────────────────────────────────────

interface FlightDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  sessionId: string;
  option: FlightOption | null;
  passengerCount?: number;
}

export function FlightDetailsModal({ visible, onClose, sessionId, option, passengerCount }: FlightDetailsModalProps) {
  const { theme } = useTheme();
  const { t, isRTL, language, currency: displayCurrency } = useLocale();
  const [bookLoading, setBookLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isNarrow = width < 600;

  const handleBook = async () => {
    if (!option) return;
    setBookLoading(true);
    try {
      const url = getUniformBookingRedirectUrl(sessionId, option.id, option);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open link', 'Your device cannot open this booking link.');
      }
    } catch {
      Alert.alert('Error', 'Could not open booking link.');
    } finally {
      setBookLoading(false);
    }
  };

  if (!option) return null;

  const carrierCode =
    option.primaryDisplayCarrier
    || option.validatingAirlines?.[0]
    || option.legs?.[0]?.segments?.find((s) => s.marketingCarrier?.code)?.marketingCarrier?.code
    || '';
  const airlineName = (carrierCode ? getAirlineName(carrierCode) : '') || carrierCode || '';

  const passengers = passengerCount && passengerCount > 0 ? passengerCount : 1;
  // API price is per passenger. Total = pricePerPassenger * passengerCount.
  const pricePerPassenger = option.price.amount;
  const totalPriceRaw = pricePerPassenger * passengers;
  const { amount: totalAmount, currency: priceCurrency } = getDisplayPrice(totalPriceRaw, option.price.currency, displayCurrency);
  const { amount: perPassengerAmount } = getDisplayPrice(pricePerPassenger, option.price.currency, displayCurrency);
  const priceSymbol = getCurrencySymbol(priceCurrency);

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[PRICE_CALC]', {
      apiPrice: option.price.amount,
      passengers,
      pricePerPassenger: pricePerPassenger,
      totalPrice: totalPriceRaw,
    });
  }

  const fare = option.fare;
  const breakdownParts: string[] = [];
  if (fare?.adultsTotal && fare.adultsCount) {
    const { amount: aAmt } = getDisplayPrice(fare.adultsTotal, fare.currency, displayCurrency);
    breakdownParts.push(
      `${fare.adultsCount} ${fare.adultsCount === 1 ? t('adult') : t('adults')}: ${priceSymbol} ${aAmt.toFixed(0)}`,
    );
  }
  if (fare?.childrenTotal && fare.childrenCount) {
    const { amount: cAmt } = getDisplayPrice(fare.childrenTotal, fare.currency, displayCurrency);
    breakdownParts.push(
      `${fare.childrenCount} ${fare.childrenCount === 1 ? t('child') : t('children')}: ${priceSymbol} ${cAmt.toFixed(0)}`,
    );
  }
  if (fare?.infantsTotal && fare.infantsCount) {
    const { amount: iAmt } = getDisplayPrice(fare.infantsTotal, fare.currency, displayCurrency);
    breakdownParts.push(
      `${fare.infantsCount} ${fare.infantsCount === 1 ? t('infant') : t('infants')}: ${priceSymbol} ${iAmt.toFixed(0)}`,
    );
  }

  const totalStops = option.legs.reduce(
    (acc, leg) => acc + Math.max(0, (leg.segments?.length ?? 1) - 1),
    0,
  );
  const stopsLabel =
    totalStops === 0 ? t('direct') : totalStops === 1 ? `1 ${t('stop')}` : `${totalStops} ${t('stops')}`;

  const totalDur =
    (option.outboundSummary?.durationMinutes ?? 0) > 0
      ? option.outboundSummary!.durationMinutes
      : option.durationMinutes > 0
        ? option.durationMinutes
        : option.legs.reduce((sum, leg) => sum + legDuration(leg.segments), 0);

  const hasBaggage = option.baggageClass === 'BAG_OK' || option.baggageClass === 'BAG_INCLUDED';
  const baggageStr = option.baggageClass === 'BAG_INCLUDED'
    ? `${t('checked_bag')}: ${t('included')}`
    : option.baggageClass === 'BAG_OK'
      ? `${t('checked_bag')}: ${t('not_included')}`
      : '';

  const firstSegCabin = option.legs?.[0]?.segments?.[0]?.cabinClass;
  const cabinStr = cabinLabel(firstSegCabin, t);

  const containerStyle = isNarrow
    ? [s.card, s.cardSheet, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]
    : [s.card, s.cardCentered, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[s.overlay, isNarrow && s.overlaySheet]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={containerStyle}>
          {/* ── Header ── */}
          <View style={[s.header, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[s.headerTitle, { color: theme.text }]}>{t('flight_details')}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <AppIcon name="close" size={24} color={theme.primary} fallbackText={t('close')} />
            </TouchableOpacity>
          </View>

          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} bounces={false}>
            {/* ── Summary row (price + meta; RTL swaps sides) ── */}
            <View style={[s.summaryRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <View>
                <Text style={[s.price, { color: theme.primary }]}>
                  {priceSymbol} {totalAmount.toFixed(0)}
                </Text>
                {passengers > 1 && (
                  <Text style={[s.summaryMuted, { color: theme.textMuted, marginTop: 2 }]}>
                    {priceSymbol} {perPassengerAmount.toFixed(0)} {t('per_passenger')}
                  </Text>
                )}
                {breakdownParts.length > 0 && (
                  <Text style={[s.summaryMuted, { color: theme.textMuted, marginTop: 2 }]}>
                    {breakdownParts.join('   ')}
                  </Text>
                )}
              </View>
              <View style={s.summaryMeta}>
                {airlineName ? (
                  <Text style={[s.summaryText, { color: theme.text }]}>{airlineName}</Text>
                ) : null}
                <Text style={[s.summaryMuted, { color: theme.textMuted }]}>
                  {formatDuration(totalDur)} · {stopsLabel}
                </Text>
              </View>
            </View>

            {/* ── Badges ── */}
            {(cabinStr || hasBaggage) && (
              <View style={s.badges}>
                {cabinStr ? (
                  <View style={[s.badge, { borderColor: theme.cardBorder }]}>
                    <Text style={[s.badgeText, { color: theme.textMuted }]}>{cabinStr}</Text>
                  </View>
                ) : null}
                {hasBaggage ? (
                  <View style={[s.badge, { borderColor: theme.cardBorder }]}>
                    <Text style={[s.badgeText, { color: theme.textMuted }]}>{baggageStr}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* ── Legs ── */}
            {option.legs.map((leg, legIdx) => {
              const segs = leg.segments ?? [];
              if (!segs.length) return null;
              const legLabel =
                option.legs.length > 1
                  ? legIdx === 0 ? t('outbound') : t('return_leg')
                  : t('flight_leg');
              const dateStr = safeDate(segs[0].departureTime);
              const legStops = Math.max(0, segs.length - 1);
              const legStopsLabel =
                legStops === 0 ? t('direct') : legStops === 1 ? `1 ${t('stop')}` : `${legStops} ${t('stops')}`;
              const dur = legDuration(segs);

              return (
                <View key={legIdx} style={[s.legBlock, { borderTopColor: theme.cardBorder }]}>
                  {/* Leg header */}
                  <View style={s.legHeader}>
                    <Text style={[s.legTitle, { color: theme.text }]}>
                      {legLabel}
                    </Text>
                    <Text style={[s.legMeta, { color: theme.textMuted }]}>
                      {dateStr ? `${dateStr} · ` : ''}{formatDuration(dur)} · {legStopsLabel}
                    </Text>
                  </View>

                  {/* Segments */}
                  {segs.map((seg, segIdx) => {
                    const lo = layoverBetween(segs, segIdx);
                    const carrier = seg.marketingCarrier?.code || '';
                    const carrierName = carrier ? (getAirlineName(carrier) || carrier) : '';
                    const segCabin = cabinLabel(seg.cabinClass, t);

                    return (
                      <View key={segIdx}>
                        {/* Layover divider */}
                        {segIdx > 0 && lo > 0 && (
                          <View style={[s.layoverRow, { backgroundColor: theme.controlBg }]}>
                            <Text style={[s.layoverText, { color: theme.textMuted }]}>
                              {t('layover_in')} {getAirportNameByCode(segs[segIdx - 1].to?.code, language)} · {formatDuration(lo)}
                            </Text>
                          </View>
                        )}

                        {/* Segment card */}
                        <View style={s.segRow}>
                          {/* Departure */}
                          <View style={s.segEndpoint}>
                            <Text style={[s.segTime, { color: theme.text }]}>
                              {safeTime(seg.departureTime)}
                            </Text>
                            <Text style={[s.segAirport, { color: theme.textMuted }]}>
                              {getAirportNameByCode(seg.from?.code, language)}
                            </Text>
                          </View>

                          {/* Middle: line + duration */}
                          <View style={s.segMiddle}>
                            <View style={[s.segLine, { backgroundColor: theme.cardBorder }]} />
                            <Text style={[s.segDuration, { color: theme.textMuted }]}>
                              {formatDuration(seg.durationMinutes || 0)}
                            </Text>
                            <View style={[s.segLine, { backgroundColor: theme.cardBorder }]} />
                          </View>

                          {/* Arrival */}
                          <View style={[s.segEndpoint, s.segEndpointRight]}>
                            <Text style={[s.segTime, { color: theme.text }]}>
                              {safeTime(seg.arrivalTime)}
                            </Text>
                            <Text style={[s.segAirport, { color: theme.textMuted }]}>
                              {getAirportNameByCode(seg.to?.code, language)}
                            </Text>
                          </View>
                        </View>

                        {/* Segment details line */}
                        <View style={s.segDetails}>
                          <Text style={[s.segDetailText, { color: theme.textMuted }]}>
                            {[
                              carrierName,
                              seg.flightNumber ? `${carrier} ${seg.flightNumber}` : '',
                              segCabin,
                            ].filter(Boolean).join(' · ')}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>

          {/* ── Available sellers (same flight, other carriers/providers) ── */}
          {option.sellerOptions && option.sellerOptions.length > 0 && (
            <View style={[s.sellersBlock, { borderTopColor: theme.cardBorder }]}>
              <Text style={[s.sellersTitle, { color: theme.text }]}>{t('available_sellers')}</Text>
              {option.sellerOptions.map((seller, idx) => (
                <View key={idx} style={[s.sellerRow, { borderColor: theme.cardBorder }]}>
                  <View style={s.sellerInfo}>
                    <Text style={[s.sellerCarrier, { color: theme.text }]}>
                      {seller.carrierCode ? (getAirlineName(seller.carrierCode) || seller.carrierCode) : seller.provider || seller.vendorName || '—'}
                    </Text>
                    <Text style={[s.sellerMeta, { color: theme.textMuted }]}>
                      {getCurrencySymbol(seller.price.currency)} {seller.price.amount.toFixed(0)}
                      {seller.vendorName ? ` · ${seller.vendorName}` : ''}
                    </Text>
                  </View>
                  {seller.bookingUrl ? (
                    <TouchableOpacity
                      style={[s.sellerBookBtn, { backgroundColor: theme.controlBg }]}
                      onPress={() => Linking.openURL(seller.bookingUrl!)}
                      activeOpacity={0.8}
                    >
                      <Text style={[s.sellerBookText, { color: theme.primary }]}>{t('book_now')}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {/* ── Footer ── */}
          <View style={[s.footer, { borderTopColor: theme.cardBorder }]}>
            <TouchableOpacity
              style={[s.bookBtn, { backgroundColor: theme.primary }]}
              onPress={handleBook}
              disabled={bookLoading}
            >
              {bookLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={s.bookBtnText}>{t('book_now')}</Text>
              )}
            </TouchableOpacity>
            <Text style={[s.disclaimer, { color: theme.textMuted }]}>{t('booking_disclaimer')}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  overlaySheet: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingHorizontal: 0,
    paddingTop: 24,
    paddingBottom: 0,
  },
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    width: '100%',
    alignSelf: 'stretch',
  },
  cardCentered: {
    borderRadius: 20,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 520,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerClose: { fontSize: 22, fontWeight: '400', lineHeight: 24 },

  scroll: {},
  scrollContent: { padding: 20, paddingBottom: 8 },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  price: { fontSize: 26, fontWeight: '700' },
  summaryMeta: { alignItems: 'flex-end', flexShrink: 1 },
  summaryText: { fontSize: 15, fontWeight: '600' },
  summaryMuted: { fontSize: 14, marginTop: 2 },

  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  badge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 12 },

  legBlock: { borderTopWidth: 1, paddingTop: 16, marginTop: 8 },
  legHeader: { marginBottom: 12 },
  legTitle: { fontSize: 16, fontWeight: '700' },
  legMeta: { fontSize: 13, marginTop: 2 },

  layoverRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  layoverText: { fontSize: 13 },

  segRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  segEndpoint: { alignItems: 'center', width: 56 },
  segEndpointRight: { alignItems: 'center' },
  segTime: { fontSize: 18, fontWeight: '700' },
  segAirport: { fontSize: 12, marginTop: 2 },
  segMiddle: { flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  segLine: { flex: 1, height: 1 },
  segDuration: { fontSize: 12, marginHorizontal: 6 },
  segDetails: { alignItems: 'center', marginBottom: 8 },
  segDetailText: { fontSize: 12, textAlign: 'center' },

  sellersBlock: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sellersTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  sellerInfo: { flex: 1, minWidth: 0 },
  sellerCarrier: { fontSize: 14, fontWeight: '600' },
  sellerMeta: { fontSize: 12, marginTop: 2 },
  sellerBookBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  sellerBookText: { fontSize: 14, fontWeight: '600' },

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
  disclaimer: { marginTop: 10, fontSize: 12, textAlign: 'center' },
});
