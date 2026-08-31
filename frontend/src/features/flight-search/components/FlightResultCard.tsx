/**
 * Flight result card — Skyscanner / Kiwi inspired.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────┐
 *   │ 06:15 → 09:35                    ILS 356     │
 *   │ TLV → VIE                        Book now   │
 *   │ 3h 20m  Direct                              │
 *   │ 14:10 → 21:45                               │
 *   │ VIE → TLV                                   │
 *   │ 7h 35m  1 stop  2h 10m in FRA               │
 *   │ Jan 7 → Jan 14                              │
 *   │ Austrian Airlines · Economy      Details → │
 *   └──────────────────────────────────────────────┘
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { getAirlineName } from '../../../data/airlines';
import { getDisplayPrice, getCurrencySymbol } from '../../../utils/exchangeRates';
import { displayAirlineLabel, hasMultipleAirlines } from '../../../utils/displayAirlines';
import {
  buildLegPreviewSummary,
  formatDuration,
  formatLayoverPreview,
  formatLegStopsLabel,
  type LegPreviewSummary,
} from '../../../utils/legSummary';
import { formatFlightTime, flightTimeToMs, type FlightTimeDisplayMode } from '../../../utils/flightTimeDisplay';
import type { FlightOption, FlightSegment } from '../../../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtShortDate(iso: string | undefined | null): string {
  const ms = flightTimeToMs(iso);
  if (!Number.isFinite(ms)) return '';
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Returns every airport code in order: origin, all layovers, destination */
function buildRoutePath(segments: FlightSegment[]): string[] {
  if (!segments?.length) return [];
  const codes: string[] = [];
  const first = segments[0].from?.code;
  if (first) codes.push(first);
  for (const seg of segments) {
    const to = seg.to?.code;
    if (to) codes.push(to);
  }
  return codes;
}

function LegScheduleBlock({
  summary,
  routeStr,
  routeColor,
  showTimes,
  t,
  theme,
  isRTL,
  timeDisplay,
  locale,
}: {
  summary: LegPreviewSummary | null;
  routeStr: string;
  routeColor: string;
  showTimes: boolean;
  t: (key: string) => string;
  theme: ReturnType<typeof useTheme>['theme'];
  isRTL: boolean;
  timeDisplay: FlightTimeDisplayMode;
  locale: string;
}) {
  if (!routeStr && !summary) return null;

  const dep = formatFlightTime(summary?.departureTime, summary?.origin, timeDisplay, locale);
  const arr = formatFlightTime(summary?.arrivalTime, summary?.destination, timeDisplay, locale);
  const dur = formatDuration(summary?.durationMinutes ?? 0);
  const stopsCount = summary?.stopsCount ?? 0;
  const stopsText = formatLegStopsLabel(stopsCount, t);
  const layoverText = formatLayoverPreview(summary?.layovers ?? [], t);
  const row = (rtlStyle?: object) => (isRTL ? [{ flexDirection: 'row-reverse' as const }, rtlStyle] : []);
  const timeSep = isRTL ? ' ← ' : ' → ';

  return (
    <View style={c.legBlock}>
      {showTimes && summary ? (
        <View style={[c.timesRow, ...row()]}>
          <Text style={[c.time, { color: theme.text }]}>{dep}</Text>
          <Text style={[c.timeSep, { color: theme.textMuted, marginInline: 2 }]}>{timeSep}</Text>
          <Text style={[c.time, { color: theme.text }]}>{arr}</Text>
        </View>
      ) : null}
      {routeStr ? (
        <Text style={[c.route, { color: routeColor }, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
          {routeStr}
        </Text>
      ) : null}
      {showTimes && summary ? (
        <View style={[c.metaRow, ...row({ flexWrap: 'wrap' as const })]}>
          <Text style={[c.metaText, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>{dur}</Text>
          <View
            style={[
              c.stopsChip,
              stopsCount === 0
                ? { backgroundColor: theme.successBg }
                : { backgroundColor: theme.controlBg },
            ]}
          >
            <Text
              style={[
                c.stopsChipText,
                stopsCount === 0
                  ? { color: theme.success }
                  : { color: theme.text },
                isRTL && { textAlign: 'center' },
              ]}
            >
              {stopsText}
            </Text>
          </View>
          {layoverText ? (
            <Text style={[c.layoverHint, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
              {layoverText}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export interface FlightResultCardProps {
  option: FlightOption;
  onDetails: () => void;
  bookLoading?: boolean;
  bookLabel?: string;
  /** 'round-trip' when the search had a return date — used to show return route even when legs[1] is missing */
  tripType?: 'one-way' | 'round-trip';
  /** Return date from search params, used as fallback when legs[1] has no date */
  searchReturnDate?: string;
  /** Open-jaw / RT return endpoints from search params — shown when legs[1] is missing */
  searchReturnRoute?: { from: string; to: string };
  /** Total number of travelers in the search (adults + children + infants) */
  passengerCount?: number;
}

export function FlightResultCard({
  option,
  onDetails,
  bookLoading = false,
  bookLabel,
  tripType,
  searchReturnDate,
  searchReturnRoute,
  passengerCount,
}: FlightResultCardProps) {
  const { theme } = useTheme();
  const { t, isRTL, currency: displayCurrency, timeDisplay, locale } = useLocale();
  const segments = option.legs?.[0]?.segments ?? [];
  const outboundSummary = buildLegPreviewSummary(segments, option.outboundSummary, option.durationMinutes);

  const legCount = option.legs?.length ?? 0;
  const returnLeg = legCount > 1 ? option.legs![legCount - 1] : undefined;
  const returnSegments = returnLeg?.segments ?? [];
  const returnSummary = returnSegments.length
    ? buildLegPreviewSummary(returnSegments)
    : null;

  const sep = isRTL ? ' ← ' : ' → ';
  const legRoutes = (option.legs ?? [])
    .map((leg) => buildRoutePath(leg.segments ?? []).join(sep))
    .filter(Boolean);
  const outboundRouteStr = legRoutes[0] || '';
  const extraRouteStrs = legRoutes.slice(1, Math.max(1, legRoutes.length - 1));
  let returnRouteStr = legRoutes.length > 1 ? legRoutes[legRoutes.length - 1] : '';
  if (!returnRouteStr && searchReturnRoute?.from && searchReturnRoute?.to) {
    returnRouteStr = `${searchReturnRoute.from.toUpperCase()}${sep}${searchReturnRoute.to.toUpperCase()}`;
  }
  const missingReturnLeg = !!(searchReturnRoute && legCount < 2);

  const outboundDate = fmtShortDate(segments[0]?.departureTime);
  const returnDate =
    fmtShortDate(returnSegments[0]?.departureTime)
    || (tripType === 'round-trip' ? fmtShortDate(searchReturnDate) : '');
  const isRoundTrip = !!(returnDate || returnRouteStr);
  const airline = displayAirlineLabel(option);
  const multiAirline = hasMultipleAirlines(option);

  const allSegments = option.legs.flatMap((l) => l.segments ?? []);
  const rankCabin = (cabin: string | undefined | null): number => {
    switch (cabin) {
      case 'FIRST':
        return 3;
      case 'BUSINESS':
        return 2;
      case 'PREMIUM_ECONOMY':
        return 1;
      case 'ECONOMY':
      default:
        return 0;
    }
  };
  const bestCabinRaw =
    allSegments.reduce<string | undefined>((best, seg) => {
      const current = seg.cabinClass || best;
      if (!current) return best;
      if (!best) return current;
      return rankCabin(current) > rankCabin(best) ? current : best;
    }, undefined) || segments[0]?.cabinClass;
  const cabinKey =
    bestCabinRaw === 'PREMIUM_ECONOMY'
      ? 'cabin_premium_economy'
      : bestCabinRaw === 'BUSINESS'
        ? 'cabin_business'
        : bestCabinRaw === 'FIRST'
          ? 'cabin_first'
          : '';
  const cabinStr = cabinKey ? t(cabinKey) : '';

  const passengers = passengerCount && passengerCount > 0 ? passengerCount : 1;
  const pricePerPassenger = option.price.amount;
  const totalPriceRaw = pricePerPassenger * passengers;
  const { amount: totalAmount, currency: cur } = getDisplayPrice(totalPriceRaw, option.price.currency, displayCurrency);
  const { amount: perPassengerAmount } = getDisplayPrice(pricePerPassenger, option.price.currency, displayCurrency);
  const symbol = getCurrencySymbol(cur);
  const priceStr = `${symbol} ${totalAmount.toFixed(0)}`;
  const perPassengerStr = passengers > 1 ? `${symbol} ${perPassengerAmount.toFixed(0)} ${t('per_passenger')}` : null;

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[PRICE_CALC]', {
      apiPrice: option.price.amount,
      passengers,
      pricePerPassenger,
      totalPrice: totalPriceRaw,
    });
  }

  const hasBagBadge = option.baggageClass === 'BAG_OK' || option.baggageClass === 'BAG_INCLUDED';
  const bagStr = option.baggageClass === 'BAG_INCLUDED' ? t('included') : option.baggageClass === 'BAG_OK' ? t('not_included') : '';

  const row = (rtlStyle?: object) => (isRTL ? [{ flexDirection: 'row-reverse' as const }, rtlStyle] : []);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onDetails}
      style={[c.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
    >
      <View style={[c.row1, ...row()]}>
        <View style={[c.scheduleCol, isRTL && { alignItems: 'flex-end' }]}>
          <LegScheduleBlock
            summary={outboundSummary}
            routeStr={outboundRouteStr}
            routeColor={theme.textMuted}
            showTimes
            t={t}
            theme={theme}
            isRTL={isRTL}
            timeDisplay={timeDisplay}
            locale={locale}
          />
          {extraRouteStrs.map((routeStr, i) => (
            <Text
              key={`extra-route-${i}`}
              style={[c.route, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}
              numberOfLines={1}
            >
              {routeStr}
            </Text>
          ))}
          {isRoundTrip && returnRouteStr ? (
            returnSummary ? (
              <LegScheduleBlock
                summary={returnSummary}
                routeStr={returnRouteStr}
                routeColor={theme.textMuted}
                showTimes
                t={t}
                theme={theme}
                isRTL={isRTL}
                timeDisplay={timeDisplay}
                locale={locale}
              />
            ) : (
              <Text
                style={[
                  c.route,
                  { color: missingReturnLeg ? theme.warning : theme.textMuted },
                  isRTL && { textAlign: 'right' },
                ]}
                numberOfLines={1}
              >
                {returnRouteStr}
                {missingReturnLeg ? ` (${t('return_leg_unavailable')})` : ''}
              </Text>
            )
          ) : null}
          {outboundDate ? (
            <Text style={[c.dateStr, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]}>
              {isRoundTrip ? `${outboundDate}${sep}${returnDate}` : outboundDate}
            </Text>
          ) : null}
        </View>

        <View style={[c.priceCol, isRTL && { alignItems: 'flex-start' }]}>
          <Text style={[c.price, { color: theme.primary }, isRTL && { textAlign: 'right', alignSelf: 'stretch' }]}>
            {priceStr}
          </Text>
          {option.priceIsEstimate ? (
            <View style={[c.badgeRow, ...row()]}>
              <View style={[c.estBadge, { backgroundColor: theme.controlBg }]}>
                <Text style={[c.estBadgeText, { color: theme.textMuted }]}>{t('estimated_total')}</Text>
              </View>
              {option.originalPrice?.amount && option.originalPrice?.currency ? (
                <Text style={[c.wasPrice, { color: theme.textMuted }]}>
                  {(function () {
                    const { amount, currency } = option.originalPrice!;
                    const origTotal = amount * passengers;
                    const { amount: convTotal, currency: cur2 } = getDisplayPrice(origTotal, currency, displayCurrency);
                    const sym = getCurrencySymbol(cur2);
                    return `${t('provider_price')}: ${sym} ${convTotal.toFixed(0)}`;
                  })()}
                </Text>
              ) : null}
            </View>
          ) : null}
          {option.selfTransfer ? (
            <Text style={[c.selfTransferWarn, { color: theme.warning }, isRTL && { textAlign: 'right', alignSelf: 'stretch' }]}>
              {option.selfTransferWarning || t('self_transfer_warning')}
            </Text>
          ) : null}
          {option.source === 'kiwi' || (option.vendorName && !multiAirline) ? (
            <Text style={[c.perPerson, { color: theme.textMuted }, isRTL && { textAlign: 'right', alignSelf: 'stretch' }]}>
              {option.vendorName && !multiAirline
                ? t('via_vendor').replace('{vendor}', option.vendorName)
                : option.source === 'kiwi'
                  ? t('source_kiwi')
                  : option.vendorName}
            </Text>
          ) : null}
          {perPassengerStr ? (
            <Text style={[c.perPerson, { color: theme.textMuted }, isRTL && { textAlign: 'right', alignSelf: 'stretch' }]}>
              {perPassengerStr}
            </Text>
          ) : null}
          <TouchableOpacity
            style={[c.bookBtn, { backgroundColor: theme.primary }, isRTL && { alignSelf: 'stretch' }]}
            onPress={(e) => {
              e.stopPropagation();
              onDetails();
            }}
            disabled={bookLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={bookLabel ?? t('view_and_book')}
          >
            <Text style={[c.bookBtnText, { color: theme.onPrimary }]}>
              {bookLoading ? '…' : bookLabel ?? t('view_and_book')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[c.row2, { borderTopColor: theme.cardBorder }, ...row()]}>
        <View style={[c.airlineCol, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[c.airlineText, { color: theme.text }, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
            {[airline, cabinStr || t('cabin_economy')].filter(Boolean).join(' · ')}
          </Text>
          {option.isCodeshare && (option.primaryOperatingCarrier || (option.marketedBy && option.marketedBy.length > 0)) && (
            <Text style={[c.codeshareText, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
              {option.primaryOperatingCarrier
                ? `${t('operated_by')} ${getAirlineName(option.primaryOperatingCarrier) || option.primaryOperatingCarrier}`
                : ''}
              {option.primaryOperatingCarrier && option.marketedBy && option.marketedBy.length > 1
                ? ` · ${t('also_sold_by')} ${option.marketedBy.filter((c2) => c2 !== option.primaryOperatingCarrier).map((c2) => getAirlineName(c2) || c2).join(', ')}`
                : option.marketedBy && option.marketedBy.length > 1
                  ? `${t('also_sold_by')} ${option.marketedBy.map((c2) => getAirlineName(c2) || c2).join(', ')}`
                  : ''}
            </Text>
          )}
        </View>
        {hasBagBadge && (
          <View style={[c.bagBadge, { backgroundColor: theme.controlBg }, isRTL && { alignSelf: 'center' }]}>
            <Text style={[c.bagBadgeText, { color: theme.textMuted }, isRTL && { textAlign: 'center' }]}>🧳 {bagStr}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const c = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  scheduleCol: { flex: 1, minWidth: 0 },
  legBlock: { marginBottom: 6 },
  timesRow: { flexDirection: 'row', alignItems: 'baseline' },
  time: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  timeSep: { fontSize: 13 },
  route: { fontSize: 12, marginTop: 1, letterSpacing: 0.3 },
  dateStr: { fontSize: 12, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  metaText: { fontSize: 13, fontWeight: '500' },
  stopsChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stopsChipText: { fontSize: 12, fontWeight: '600' },
  layoverHint: { fontSize: 12, flexShrink: 1 },
  priceCol: { alignItems: 'flex-end', justifyContent: 'flex-start', minWidth: 100 },
  price: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  estBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  estBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  wasPrice: { fontSize: 11 },
  perPerson: { fontSize: 11, marginTop: 2 },
  selfTransferWarn: { fontSize: 11, marginTop: 6, fontWeight: '600', lineHeight: 15 },
  bookBtn: {
    marginTop: 8,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 96,
    alignItems: 'center',
  },
  bookBtnText: { fontSize: 14, fontWeight: '700' },

  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  airlineCol: { flex: 1, minWidth: 0 },
  airlineText: { fontSize: 13, fontWeight: '500' },
  codeshareText: { fontSize: 11, marginTop: 2 },
  bagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  bagBadgeText: { fontSize: 11 },
});
