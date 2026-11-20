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
import { AppIcon } from '../../../components/AppIcon';
import { useTheme } from '../../../theme/ThemeContext';
import { useWindowWidth } from '../../../hooks/useResponsive';
import { useLocale } from '../../../context/LocaleContext';
import { getDisplayPrice, getCurrencySymbol } from '../../../utils/exchangeRates';
import { displayAirlineLabel, hasMultipleAirlines, labelForCarrierCode } from '../../../utils/displayAirlines';
import {
  buildLegPreviewSummary,
  formatDuration,
  formatLegStopsLabel,
  type LegPreviewSummary,
} from '../../../utils/legSummary';
import { formatFlightTime, formatFlightShortDate, type FlightTimeDisplayMode } from '../../../utils/flightTimeDisplay';
import type { FlightOption, FlightSegment } from '../../../types';
import { TicketStub } from '../../../ui/TicketStub';
import { AirportRouteTimeline, LayoverChips } from '../../../ui';

// ─── Helpers ────────────────────────────────────────────────────────────────

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
  routeCodes,
  legLabel,
  showTimes,
  selfTransfer,
  t,
  theme,
  isRTL,
  timeDisplay,
  locale,
}: {
  summary: LegPreviewSummary | null;
  /** Ordered airport codes for this leg (for timeline). */
  routeCodes: string[];
  /** Short section title: Outbound / Return */
  legLabel?: string;
  showTimes: boolean;
  selfTransfer?: boolean;
  t: (key: string) => string;
  theme: ReturnType<typeof useTheme>['theme'];
  isRTL: boolean;
  timeDisplay: FlightTimeDisplayMode;
  locale: string;
}) {
  if (!routeCodes.length && !summary) return null;

  const dep = formatFlightTime(summary?.departureTime, summary?.origin, timeDisplay, locale);
  const arr = formatFlightTime(summary?.arrivalTime, summary?.destination, timeDisplay, locale);
  const dur = formatDuration(summary?.durationMinutes ?? 0);
  const stopsCount = summary?.stopsCount ?? 0;
  const stopsText = formatLegStopsLabel(stopsCount, t, { selfTransfer });
  const row = (rtlStyle?: object) => (isRTL ? [{ flexDirection: 'row-reverse' as const }, rtlStyle] : []);
  const timeSep = isRTL ? ' ← ' : ' → ';

  return (
    <View style={c.legBlock}>
      {legLabel ? (
        <Text style={[c.legLabel, { color: theme.textMuted, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>
          {legLabel}
        </Text>
      ) : null}
      {showTimes && summary ? (
        <View style={[c.timesRow, ...row()]}>
          <Text style={[c.time, { color: theme.text, fontFamily: theme.fontDisplay }]}>{dep}</Text>
          <Text style={[c.timeSep, { color: theme.textMuted, marginInline: 2 }]}>{timeSep}</Text>
          <Text style={[c.time, { color: theme.text, fontFamily: theme.fontDisplay }]}>{arr}</Text>
        </View>
      ) : null}
      {routeCodes.length > 0 ? (
        <AirportRouteTimeline codes={routeCodes} theme={theme} isRTL={isRTL} />
      ) : null}
      {showTimes && summary ? (
        <View style={[c.metaRow, ...row({ flexWrap: 'wrap' as const })]}>
          <Text style={[c.metaText, { color: theme.textMuted, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]}>{dur}</Text>
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
        </View>
      ) : null}
      {summary && summary.layovers.length > 0 ? (
        <LayoverChips layovers={summary.layovers} theme={theme} isRTL={isRTL} t={t} />
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
  const stackPrice = useWindowWidth() < 400;
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
  const outboundRouteCodes = buildRoutePath(segments);
  const returnRouteCodes = returnSegments.length ? buildRoutePath(returnSegments) : [];
  const outboundRouteStr = legRoutes[0] || '';
  const extraRouteStrs = legRoutes.slice(1, Math.max(1, legRoutes.length - 1));
  let returnRouteStr = legRoutes.length > 1 ? legRoutes[legRoutes.length - 1] : '';
  if (!returnRouteStr && searchReturnRoute?.from && searchReturnRoute?.to) {
    returnRouteStr = `${searchReturnRoute.from.toUpperCase()}${sep}${searchReturnRoute.to.toUpperCase()}`;
  }
  const missingReturnLeg = !!(searchReturnRoute && legCount < 2);

  const outboundDate = formatFlightShortDate(
    segments[0]?.departureTime,
    segments[0]?.from?.code,
    timeDisplay,
    locale,
  );
  const returnDate =
    formatFlightShortDate(
      returnSegments[0]?.departureTime,
      returnSegments[0]?.from?.code,
      timeDisplay,
      locale,
    )
    || (tripType === 'round-trip'
      ? formatFlightShortDate(searchReturnDate, searchReturnRoute?.from, timeDisplay, locale)
      : '');
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
    <TouchableOpacity activeOpacity={0.7} onPress={onDetails} style={c.cardWrap}>
      <TicketStub
        innerStyle={{
          paddingVertical: 12,
          paddingHorizontal: 14,
        }}
      >
      <View style={[c.row1, stackPrice && c.row1Stacked, ...row(stackPrice ? { alignItems: 'stretch' as const } : undefined)]}>
        <View style={[c.scheduleCol, isRTL && { alignItems: 'flex-end' }]}>
          <LegScheduleBlock
            summary={outboundSummary}
            routeCodes={outboundRouteCodes}
            legLabel={isRoundTrip ? t('outbound') : undefined}
            showTimes
            selfTransfer={option.selfTransfer}
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
                routeCodes={returnRouteCodes}
                legLabel={t('return_leg')}
                showTimes
                selfTransfer={option.selfTransfer}
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

        <View style={[c.priceCol, stackPrice && c.priceColStacked, isRTL && !stackPrice && { alignItems: 'flex-start' }]}>
          <Text style={[c.price, { color: theme.price, fontFamily: theme.fontDisplay }, isRTL && { textAlign: 'right', alignSelf: 'stretch' }]}>
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
          {perPassengerStr ? (
            <Text style={[c.perPerson, { color: theme.textMuted }, isRTL && { textAlign: 'right', alignSelf: 'stretch' }]}>
              {perPassengerStr}
            </Text>
          ) : null}
          <TouchableOpacity
            style={[c.bookBtn, { backgroundColor: theme.buttonBg, borderRadius: theme.radiusMd }, isRTL && { alignSelf: 'stretch' }]}
            onPress={(e) => {
              e.stopPropagation();
              onDetails();
            }}
            disabled={bookLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={bookLabel ?? t('select_flight')}
          >
            <Text style={[c.bookBtnText, { color: theme.buttonText, fontFamily: theme.fontBody }]}>
              {bookLoading ? '…' : bookLabel ?? t('select_flight')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[c.row2, { borderTopColor: theme.cardBorder }, ...row()]}>
        <View style={[c.airlineCol, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[c.airlineText, { color: theme.text, fontFamily: theme.fontBody }, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
            {[airline, cabinStr || t('cabin_economy')].filter(Boolean).join(' · ')}
          </Text>
          {option.isCodeshare && (option.primaryOperatingCarrier || (option.marketedBy && option.marketedBy.length > 0)) && (
            <Text style={[c.codeshareText, { color: theme.textMuted }, isRTL && { textAlign: 'right' }]} numberOfLines={1}>
              {option.primaryOperatingCarrier
                ? `${t('operated_by')} ${labelForCarrierCode(option, option.primaryOperatingCarrier)}`
                : ''}
              {option.primaryOperatingCarrier && option.marketedBy && option.marketedBy.length > 1
                ? ` · ${t('also_sold_by')} ${option.marketedBy.filter((c2) => c2 !== option.primaryOperatingCarrier).map((c2) => labelForCarrierCode(option, c2)).join(', ')}`
                : option.marketedBy && option.marketedBy.length > 1
                  ? `${t('also_sold_by')} ${option.marketedBy.map((c2) => labelForCarrierCode(option, c2)).join(', ')}`
                  : ''}
            </Text>
          )}
        </View>
        <View style={[c.footerActions, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDetails();
            }}
            style={c.detailsLink}
            accessibilityRole="button"
            accessibilityLabel={t('view_details')}
          >
            <Text style={[c.detailsLinkText, { color: theme.primary, fontFamily: theme.fontBody }]}>{t('view_details')}</Text>
            <AppIcon name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={theme.primary} fallbackText="›" />
          </TouchableOpacity>
          {hasBagBadge ? (
            <View style={[c.bagBadge, { backgroundColor: theme.controlBg }]}>
              <AppIcon name="bag-outline" size={14} color={theme.textMuted} />
              <Text style={[c.bagBadgeText, { color: theme.textMuted }, isRTL && { textAlign: 'center' }]}>{bagStr}</Text>
            </View>
          ) : null}
        </View>
      </View>
      </TicketStub>
    </TouchableOpacity>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const c = StyleSheet.create({
  cardWrap: {
    marginHorizontal: 0,
    marginVertical: 6,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  row1Stacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  scheduleCol: { flex: 1, minWidth: 0 },
  legBlock: { marginBottom: 10 },
  legLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  timesRow: { flexDirection: 'row', alignItems: 'baseline' },
  time: { fontSize: 20, fontWeight: '700', letterSpacing: -0.15, fontVariant: ['tabular-nums'] as any },
  timeSep: { fontSize: 12 },
  route: { fontSize: 12, marginTop: 2, letterSpacing: 0.35 },
  dateStr: { fontSize: 12, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  metaText: { fontSize: 12, fontWeight: '500' },
  stopsChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  stopsChipText: { fontSize: 12, fontWeight: '600' },
  priceCol: { alignItems: 'flex-end', justifyContent: 'flex-start', minWidth: 96 },
  priceColStacked: { alignItems: 'stretch', width: '100%', minWidth: 0, marginTop: 4 },
  price: { fontSize: 22, fontWeight: '700', letterSpacing: -0.1, fontVariant: ['tabular-nums'] as any },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  estBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  estBadgeText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  wasPrice: { fontSize: 12 },
  perPerson: { fontSize: 12, marginTop: 2 },
  selfTransferWarn: { fontSize: 12, marginTop: 6, fontWeight: '600', lineHeight: 17 },
  bookBtn: {
    marginTop: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 96,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: { fontSize: 14, fontWeight: '700' },

  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  airlineCol: { flex: 1, minWidth: 0 },
  airlineText: { fontSize: 12, fontWeight: '500' },
  codeshareText: { fontSize: 12, marginTop: 2 },
  footerActions: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 0 },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 36,
  },
  detailsLinkText: { fontSize: 13, fontWeight: '600' },
  bagBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  bagBadgeText: { fontSize: 12 },
});
