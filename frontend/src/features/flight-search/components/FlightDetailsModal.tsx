import React, { useEffect, useState } from 'react';
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
  Share,
  useWindowDimensions,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { AppIcon } from '../../../components/AppIcon';
import { SheetDragHandle, useDraggableSheetHeight } from '../../../components/DraggableBottomSheet';
import { resolveBookingOffer } from '../../../api';
import { isSafeBookingUrl } from '../../../api/booking';
import type { BookingResolveResponse } from '../../../api/booking';
import { getAirlineName } from '../../../data/airlines';
import { getAirportNameByCode } from '../../../data/airports';
import { openUrlInNewTab } from '../../../utils/openUrl';
import { getDisplayPrice, getCurrencySymbol } from '../../../utils/exchangeRates';
import {
  bookingHopsFromOption,
  buildShareUrlWithOptionId,
  isSplitBookingItinerary,
} from '../../../utils/skyscanner';
import type { CreateSearchSessionRequest, FlightOption, FlightSegment } from '../../../types';

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
  searchParams?: Partial<CreateSearchSessionRequest> | null;
}

export function FlightDetailsModal({
  visible,
  onClose,
  sessionId,
  option,
  passengerCount,
  searchParams,
}: FlightDetailsModalProps) {
  const { theme } = useTheme();
  const { t, isRTL, language, currency: displayCurrency } = useLocale();
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveLegIndex, setResolveLegIndex] = useState<number | null>(null);
  const [bookingResolve, setBookingResolve] = useState<BookingResolveResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const { width, height: windowHeight } = useWindowDimensions();
  const isNarrow = width < 600;
  const { heightAnim, panHandlers } = useDraggableSheetHeight(
    windowHeight,
    isNarrow && visible,
    option?.id,
  );

  const splitBooking = isSplitBookingItinerary(option, searchParams);
  const hops = option ? bookingHopsFromOption(option) : [];

  useEffect(() => {
    setBookingResolve(null);
    setResolveLegIndex(null);
    setResolveLoading(false);
  }, [option?.id, sessionId]);

  const handleShare = async () => {
    if (!option) return;
    const fingerprint = (option as any).canonicalFingerprint as string | undefined;
    const href = buildShareUrlWithOptionId(option.id, fingerprint, {
      ...(searchParams ?? {}),
      sessionId,
    } as Parameters<typeof buildShareUrlWithOptionId>[2]);
    if (!href) return;

    // Build a short title: "TLV → VIE · Oct 7" if we have enough segment info
    const first = option.legs?.[0]?.segments?.[0];
    const fromCode = first?.from?.code || '';
    const toCode = option.legs?.[0]?.segments?.slice(-1)?.[0]?.to?.code || '';
    const depDate = first?.departureTime
      ? (() => {
          const d = new Date(first.departureTime);
          return Number.isFinite(d.getTime())
            ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '';
        })()
      : '';
    const titleParts = [fromCode && toCode ? `${fromCode} → ${toCode}` : '', depDate].filter(Boolean);
    const title = titleParts.length ? titleParts.join(' · ') : t('flight_details');

    try {
      // Native share sheet (mobile + modern browsers via Web Share API).
      // Pass only url — not text:title — so Telegram/WhatsApp don't glue the title
      // onto the URL ("Jan 7https://fly-fix.com/...") and break the deep link.
      const g = typeof globalThis !== 'undefined' ? (globalThis as { navigator?: { share?: (d: object) => Promise<void>; canShare?: (d: object) => boolean } }) : undefined;
      if (g?.navigator?.share) {
        await g.navigator.share({ title, url: href });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      // React Native Share fallback (works on iOS/Android) — message is URL-only.
      const result = await Share.share({ message: href, url: href, title });
      if (result.action === Share.sharedAction) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Last resort: clipboard copy
      try {
        const nav = typeof globalThis !== 'undefined' ? (globalThis as { navigator?: { clipboard?: { writeText?: (s: string) => Promise<void> } } }) : undefined;
        await nav?.navigator?.clipboard?.writeText?.(href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  const handleBookThisFlight = async (legIndex?: number) => {
    if (!option || !sessionId) return;
    const idx = legIndex ?? null;
    if (bookingResolve?.found && resolveLegIndex === idx) {
      return;
    }
    setResolveLoading(true);
    setResolveLegIndex(idx);
    setBookingResolve(null);
    try {
      const res = await resolveBookingOffer(
        sessionId,
        option.id,
        legIndex != null && legIndex >= 0 ? legIndex : undefined,
      );
      setBookingResolve(res);
    } catch {
      Alert.alert('Error', t('booking_search_unavailable'));
    } finally {
      setResolveLoading(false);
    }
  };

  const handleOpenVerifiedBooking = async () => {
    const url = bookingResolve?.offer?.url;
    if (!url || !isSafeBookingUrl(url)) {
      Alert.alert('Cannot open link', 'This booking link is not valid.');
      return;
    }
    const ok = await openUrlInNewTab(url);
    if (!ok) {
      Alert.alert('Cannot open link', 'Your device cannot open this booking link.');
    }
  };

  const renderVerifiedOfferPanel = () => {
    if (!bookingResolve) return null;
    if (bookingResolve.found && bookingResolve.offer) {
      const offer = bookingResolve.offer;
      const priceLabelKey =
        offer.priceLabel === 'cheapest_matching_offer'
          ? 'cheapest_matching_offer'
          : offer.priceLabel === 'best_matching_price'
            ? 'best_matching_price'
            : null;
      const { amount: offerAmt, currency: offerCur } =
        offer.price != null && offer.currency
          ? getDisplayPrice(offer.price, offer.currency, displayCurrency)
          : { amount: 0, currency: displayCurrency };
      const offerSym = getCurrencySymbol(offerCur);
      return (
        <View style={[s.verifyPanel, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}>
          <Text style={[s.verifyTitle, { color: theme.text }]}>{t('exact_itinerary_matched')}</Text>
          {offer.price != null ? (
            <Text style={[s.verifyPrice, { color: theme.primary }]}>
              {offerSym} {offerAmt.toFixed(0)} · {offer.provider || offer.domain}
            </Text>
          ) : (
            <Text style={[s.verifyMeta, { color: theme.text }]}>{offer.provider || offer.domain}</Text>
          )}
          {priceLabelKey ? (
            <Text style={[s.verifyMeta, { color: theme.textMuted }]}>{t(priceLabelKey)}</Text>
          ) : null}
          <TouchableOpacity
            style={[s.bookBtn, s.bookBtnSpaced, { backgroundColor: theme.primary }]}
            onPress={handleOpenVerifiedBooking}
          >
            <Text style={s.bookBtnText}>{t('open_booking_site')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!bookingResolve.found) {
      const msg =
        bookingResolve.status === 'search_unavailable' || bookingResolve.status === 'timeout'
          ? t('booking_search_unavailable')
          : bookingResolve.message || t('no_verified_booking');
      return (
        <Text style={[s.verifyError, { color: theme.textMuted }]}>{msg}</Text>
      );
    }
    return null;
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
    ? [s.card, s.cardSheet, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, height: heightAnim }]
    : [s.card, s.cardCentered, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }];

  const CardContainer = isNarrow ? Animated.View : View;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[s.overlay, isNarrow && s.overlaySheet]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <CardContainer style={containerStyle}>
          {isNarrow ? (
            <View
              {...panHandlers}
              style={[s.dragZone, Platform.OS === 'web' && s.dragZoneWeb]}
            >
              <SheetDragHandle color={theme.textMuted} />
            </View>
          ) : null}
          {/* ── Header ── */}
          <View style={[s.header, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[s.headerTitle, { color: theme.text }]}>{t('flight_details')}</Text>
            <View style={s.headerActions}>
              <TouchableOpacity
                onPress={handleShare}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={copied ? t('link_copied') : t('share')}
                style={s.shareBtn}
              >
                {copied ? (
                  <Text style={[s.sharedText, { color: theme.primary }]}>{t('link_copied')}</Text>
                ) : (
                  <AppIcon name="share-outline" size={22} color={theme.primary} fallbackText={t('share')} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <AppIcon name="close" size={24} color={theme.primary} fallbackText={t('close')} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={isNarrow ? s.scrollSheet : s.scroll}
            contentContainerStyle={s.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator
          >
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
                {option.priceIsEstimate && (
                  <View style={s.priceEstimateBlock}>
                    <View style={[s.estBadge, { backgroundColor: theme.controlBg }]}>
                      <Text style={[s.estBadgeText, { color: theme.textMuted }]}>{t('estimated_total')}</Text>
                    </View>
                    {option.originalPrice?.amount != null && option.originalPrice.currency ? (
                      <Text style={[s.summaryMuted, { color: theme.textMuted, marginTop: 4 }]}>
                        {t('provider_price')}: {(() => {
                          const { amount: conv, currency: cur2 } = getDisplayPrice(
                            option.originalPrice.amount * passengers,
                            option.originalPrice.currency,
                            displayCurrency,
                          );
                          return `${getCurrencySymbol(cur2)} ${conv.toFixed(0)}`;
                        })()}
                      </Text>
                    ) : null}
                    <Text style={[s.priceEstimateNote, { color: theme.textMuted }]}>
                      {t('price_estimate_note')}
                    </Text>
                  </View>
                )}
                {option.selfTransfer ? (
                  <Text style={[s.selfTransferWarn, { color: theme.error || '#b45309', marginTop: 8 }]}>
                    {option.selfTransferWarning || t('self_transfer_warning')}
                  </Text>
                ) : null}
                {option.source ? (
                  <Text style={[s.summaryMuted, { color: theme.textMuted, marginTop: 4 }]}>
                    {option.source === 'kiwi' ? t('source_kiwi') : option.source === 'googleflights2' ? t('source_googleflights2') : option.source}
                  </Text>
                ) : null}
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
              const lastIdx = option.legs.length - 1;
              const legLabel =
                option.legs.length > 1
                  ? legIdx === 0
                    ? t('outbound')
                    : legIdx === lastIdx
                      ? t('return_leg')
                      : `${t('dd_extra_section')} ${legIdx + 1}`
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
            {splitBooking && hops.length > 0 ? (
              <>
                <Text style={[s.splitHint, { color: theme.text }]}>{t('split_booking_hint')}</Text>
                {hops.map((hop, idx) => {
                  const legResolving = resolveLoading && resolveLegIndex === hop.legIndex;
                  const legResolved =
                    bookingResolve && resolveLegIndex === hop.legIndex ? bookingResolve : null;
                  return (
                    <View key={hop.legIndex} style={idx > 0 ? s.hopBlock : undefined}>
                      <Text style={[s.legHopLabel, { color: theme.textMuted }]}>
                        {hop.origin} → {hop.destination} · {hop.date}
                      </Text>
                      <TouchableOpacity
                        style={[s.bookBtn, { backgroundColor: theme.primary }]}
                        onPress={() => handleBookThisFlight(hop.legIndex)}
                        disabled={resolveLoading}
                      >
                        {legResolving ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={s.bookBtnText}>{t('book_this_flight')}</Text>
                        )}
                      </TouchableOpacity>
                      {legResolving ? (
                        <Text style={[s.resolveHint, { color: theme.textMuted }]}>{t('resolving_exact_booking')}</Text>
                      ) : null}
                      {legResolved ? (
                        legResolved.found && legResolved.offer ? (
                          <View style={[s.verifyPanel, { backgroundColor: theme.controlBg, borderColor: theme.cardBorder }]}>
                            <Text style={[s.verifyTitle, { color: theme.text }]}>{t('exact_itinerary_matched')}</Text>
                            <TouchableOpacity
                              style={[s.bookBtn, s.bookBtnSpaced, { backgroundColor: theme.primary }]}
                              onPress={async () => {
                                const u = legResolved.offer?.url;
                                if (u && isSafeBookingUrl(u)) await openUrlInNewTab(u);
                              }}
                            >
                              <Text style={s.bookBtnText}>{t('open_booking_site')}</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <Text style={[s.verifyError, { color: theme.textMuted }]}>
                            {legResolved.message || t('no_verified_booking')}
                          </Text>
                        )
                      ) : null}
                    </View>
                  );
                })}
              </>
            ) : (
              <>
                <Text style={[s.bookThisHint, { color: theme.textMuted }]}>{t('book_this_flight_hint')}</Text>
                <TouchableOpacity
                  style={[s.bookBtn, { backgroundColor: theme.primary }]}
                  onPress={() => handleBookThisFlight()}
                  disabled={resolveLoading}
                >
                  {resolveLoading && resolveLegIndex === null ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={s.bookBtnText}>{t('book_this_flight')}</Text>
                  )}
                </TouchableOpacity>
                {resolveLoading && resolveLegIndex === null ? (
                  <Text style={[s.resolveHint, { color: theme.textMuted }]}>{t('resolving_exact_booking')}</Text>
                ) : null}
                {renderVerifiedOfferPanel()}
              </>
            )}
            <Text style={[s.disclaimer, { color: theme.textMuted }]}>{t('booking_disclaimer')}</Text>
          </View>
        </CardContainer>
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
    flexDirection: 'column',
  },
  cardSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    alignSelf: 'stretch',
  },
  cardCentered: {
    borderRadius: 20,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 520,
  },

  dragZone: {
    alignItems: 'stretch',
  },
  dragZoneWeb: {
    cursor: 'grab',
    touchAction: 'none',
  } as object,

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', flexShrink: 1, marginRight: 8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerClose: { fontSize: 22, fontWeight: '400', lineHeight: 24 },
  shareBtn: { padding: 4 },
  sharedText: { fontSize: 13, fontWeight: '600' },

  scroll: {},
  scrollSheet: { flex: 1, minHeight: 0 },
  scrollContent: { padding: 20, paddingBottom: 8 },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  price: { fontSize: 26, fontWeight: '700' },
  priceEstimateBlock: { marginTop: 8, gap: 4, maxWidth: 220 },
  estBadge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  estBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  priceEstimateNote: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  selfTransferWarn: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
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
  bookBtnSpaced: { marginTop: 8 },
  bookBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  secondaryBtn: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600' },
  bookThisHint: { fontSize: 13, lineHeight: 18, marginBottom: 10, textAlign: 'center' },
  resolveHint: { fontSize: 13, marginTop: 8, textAlign: 'center' },
  verifyPanel: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  verifyTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  verifyPrice: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  verifyMeta: { fontSize: 13, marginBottom: 4 },
  verifyError: { fontSize: 13, marginTop: 10, textAlign: 'center', lineHeight: 18 },
  hopBlock: { marginTop: 16 },
  legHopLabel: { fontSize: 13, marginBottom: 6, fontWeight: '600' },
  splitHint: { fontSize: 13, lineHeight: 18, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  disclaimer: { marginTop: 10, fontSize: 12, textAlign: 'center' },
});
