/**
 * Professional flight result card (Skyscanner/Kiwi style).
 * Row 1: times + airports + duration/stops | Row 2: airline + summary | Row 3: badges | Price + Book + Details
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { getAirlineName } from '../../../data/airlines';
import { getDisplayPrice } from '../../../utils/exchangeRates';
import type { FlightOption, FlightSegment } from '../../../types';

const SPACING = 8;

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

function baggageBadgeText(
  baggageClass: FlightOption['baggageClass'],
  t: (k: string) => string
): string {
  if (!baggageClass) return t('checked_bag_unknown');
  if (baggageClass === 'BAG_OK') return t('not_included');
  if (baggageClass === 'BAG_INCLUDED') return t('included');
  return t('checked_bag_unknown');
}

/** Layover minutes between previous segment arrival and this segment departure. */
function layoverMinutes(segments: FlightSegment[], idx: number): number {
  if (idx <= 0 || !segments?.length) return 0;
  const prev = segments[idx - 1];
  const curr = segments[idx];
  if (!prev?.arrivalTime || !curr?.departureTime) return 0;
  const prevArr = new Date(prev.arrivalTime).getTime();
  const dep = new Date(curr.departureTime).getTime();
  return Math.round((dep - prevArr) / 60000);
}

/** For a leg, return stop airport code and layover minutes for each connection. */
function getStopsWithLayovers(segments: FlightSegment[]): { airport: string; layoverMinutes: number }[] {
  const out: { airport: string; layoverMinutes: number }[] = [];
  if (!segments || segments.length < 2) return out;
  for (let i = 1; i < segments.length; i++) {
    const airport = segments[i - 1].to?.code || '';
    const mins = layoverMinutes(segments, i);
    if (airport) out.push({ airport, layoverMinutes: mins });
  }
  return out;
}

function formatLayover(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Airline + stops summary e.g. "El Al • Direct" or "ITA Airways • 1 stop" */
function getAirlineSummary(option: FlightOption, t: (k: string) => string): string {
  const code =
    option.primaryDisplayCarrier ||
    option.validatingAirlines?.[0];
  const name = code ? getAirlineName(code) || code : '';
  const stops = option.legs.reduce(
    (acc, leg) => acc + leg.segments.length - 1,
    0
  );
  const stopsStr =
    stops === 0 ? t('direct') : stops === 1 ? `1 ${t('stop')}` : `${stops} ${t('stops')}`;
  return name ? `${name} · ${stopsStr}` : stopsStr;
}

export interface FlightResultCardProps {
  option: FlightOption;
  onDetails: () => void;
  onBook: () => void;
  bookLoading?: boolean;
  bookLabel?: string;
}

export function FlightResultCard({
  option,
  onDetails,
  onBook,
  bookLoading = false,
  bookLabel,
}: FlightResultCardProps) {
  const { theme } = useTheme();
  const { t, isRTL } = useLocale();

  // Outbound leg only for card summary (roundtrip: show outbound times)
  const outboundLeg = option.legs[0];
  const firstSeg: FlightSegment | undefined = outboundLeg?.segments[0];
  const lastSeg: FlightSegment | undefined = outboundLeg?.segments?.length
    ? outboundLeg.segments[outboundLeg.segments.length - 1]
    : undefined;

  const depTime = firstSeg?.departureTime
    ? formatTime(firstSeg.departureTime)
    : '—';
  const arrTime = lastSeg?.arrivalTime
    ? formatTime(lastSeg.arrivalTime)
    : '—';
  const origin = firstSeg?.from?.code ?? '—';
  const destination = lastSeg?.to?.code ?? '—'; // outbound destination (first leg)
  const durationStr = formatDuration(option.durationMinutes);
  const stops = option.legs.reduce(
    (acc, leg) => acc + leg.segments.length - 1,
    0
  );
  const stopsBadge =
    stops === 0 ? t('direct') : stops === 1 ? `1 ${t('stop')}` : `${stops} ${t('stops')}`;
  const stopsWithLayovers = outboundLeg ? getStopsWithLayovers(outboundLeg.segments) : [];
  const stopAtLabel =
    stopsWithLayovers.length === 1
      ? `${t('stop_at')} ${stopsWithLayovers[0].airport} (${formatLayover(stopsWithLayovers[0].layoverMinutes)})`
      : stopsWithLayovers.length > 1
        ? `${t('stops_at')} ${stopsWithLayovers.map((s) => `${s.airport} (${formatLayover(s.layoverMinutes)})`).join(', ')}`
        : '';
  const airlineSummary = getAirlineSummary(option, t);

  const cabinRaw = option.legs[0]?.segments[0]?.cabinClass;
  const cabinKey =
    cabinRaw === 'PREMIUM_ECONOMY' ? 'cabin_premium_economy'
      : cabinRaw === 'BUSINESS' ? 'cabin_business'
      : cabinRaw === 'FIRST' ? 'cabin_first'
      : cabinRaw ? 'cabin_economy' : '';
  const showCabinBadge = Boolean(cabinKey);
  const showBaggageBadge =
    option.baggageClass === 'BAG_OK' || option.baggageClass === 'BAG_INCLUDED';

  const arrow = isRTL ? ' ← ' : ' → ';
  const { currency: displayCurrency } = useLocale();
  const { amount: displayAmount, currency: outCurr } = getDisplayPrice(
    option.price.amount,
    option.price.currency,
    displayCurrency
  );
  const priceStr = `${outCurr} ${displayAmount.toFixed(0)}`;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      {/* Main content row: schedule + meta | price + actions */}
      <View style={[styles.mainRow, isRTL && styles.mainRowRTL]}>
        {/* Left (or right in RTL): times, route, duration, stops */}
        <View style={[styles.scheduleBlock, isRTL && styles.scheduleBlockRTL]}>
          <View style={styles.timesRow}>
            <Text style={[styles.time, { color: theme.text }]}>{depTime}</Text>
            <Text style={[styles.arrow, { color: theme.textMuted }]}>{arrow}</Text>
            <Text style={[styles.time, { color: theme.text }]}>{arrTime}</Text>
          </View>
          <Text style={[styles.airports, { color: theme.textMuted }]}>
            {origin} {arrow.trim()} {destination}
          </Text>
          <View style={[styles.metaRow, isRTL && styles.metaRowRTL]}>
            <Text style={[styles.meta, { color: theme.textMuted }]}>{durationStr}</Text>
            <View style={[styles.stopsBadge, { backgroundColor: theme.controlBg }]}>
              <Text style={[styles.stopsBadgeText, { color: theme.text }]}>{stopsBadge}</Text>
            </View>
          </View>
          {stopAtLabel ? (
            <Text style={[styles.stopAtText, { color: theme.textMuted }]}>{stopAtLabel}</Text>
          ) : null}
        </View>

        {/* Right (or left in RTL): price, Book, Details */}
        <View style={[styles.priceBlock, isRTL && styles.priceBlockRTL]}>
          <Text style={[styles.price, { color: theme.primary }]}>{priceStr}</Text>
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: theme.primary }]}
            onPress={onBook}
            disabled={bookLoading}
          >
            <Text style={styles.bookBtnText}>
              {bookLoading ? '…' : bookLabel ?? t('book')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDetails} style={styles.detailsLink}>
            <Text style={[styles.detailsText, { color: theme.primary }]}>
              {isRTL ? `← ${t('view_details')}` : `${t('view_details')} →`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2: airline + segments summary */}
      <View style={[styles.airlineRow, isRTL && styles.airlineRowRTL, { borderTopColor: theme.cardBorder }]}>
        <Text style={[styles.airlineSummary, { color: theme.text }]}>{airlineSummary}</Text>
      </View>

      {/* Row 3: badges (cabin + baggage only when known; no provider badge) */}
      {(showCabinBadge || showBaggageBadge) && (
        <View style={[styles.badgesRow, isRTL && styles.badgesRowRTL]}>
          {showCabinBadge && (
            <View style={[styles.badge, { borderColor: theme.cardBorder }]}>
              <Text style={[styles.badgeText, { color: theme.textMuted }]}>{t(cabinKey)}</Text>
            </View>
          )}
          {showBaggageBadge && (
            <View style={[styles.badge, { borderColor: theme.cardBorder }]}>
              <Text style={[styles.badgeText, { color: theme.textMuted }]}>
                {t('checked_bag')}: {baggageBadgeText(option.baggageClass!, t)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING * 2,
    marginVertical: SPACING,
    padding: SPACING * 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING * 2,
  },
  mainRowRTL: { flexDirection: 'row-reverse' },
  scheduleBlock: { flex: 1, minWidth: 0 },
  scheduleBlockRTL: { alignItems: 'flex-end' },
  timesRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  time: { fontSize: 20, fontWeight: '700' },
  arrow: { fontSize: 14 },
  airports: { fontSize: 12, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  stopAtText: { fontSize: 12, marginTop: 4 },
  metaRowRTL: { flexDirection: 'row-reverse' },
  meta: { fontSize: 13 },
  stopsBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  stopsBadgeText: { fontSize: 12, fontWeight: '600' },
  priceBlock: { alignItems: 'flex-end', minWidth: 100 },
  priceBlockRTL: { alignItems: 'flex-start' },
  price: { fontSize: 22, fontWeight: '700' },
  bookBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  bookBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  detailsLink: { marginTop: 4 },
  detailsText: { fontSize: 13, fontWeight: '600' },
  airlineRow: { flexDirection: 'row', marginTop: SPACING, paddingTop: SPACING, borderTopWidth: StyleSheet.hairlineWidth },
  airlineRowRTL: { flexDirection: 'row-reverse' },
  airlineSummary: { fontSize: 13, fontWeight: '500' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SPACING },
  badgesRowRTL: { flexDirection: 'row-reverse' },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11 },
});
