/**
 * Flight result card — Skyscanner / Kiwi inspired.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────┐
 *   │ 06:15 ────── 3h 20m ────── 09:35   ILS 356  │
 *   │ TLV            Direct           NAP  Book now│
 *   │ Wizz Air · Economy                 Details → │
 *   │ [🧳 Not included]                            │
 *   └──────────────────────────────────────────────┘
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { getAirlineName } from '../../../data/airlines';
import { getDisplayPrice } from '../../../utils/exchangeRates';
import type { FlightOption, FlightSegment } from '../../../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function toValidMs(iso: string | undefined | null): number {
  if (!iso) return NaN;
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return NaN;
  if (new Date(ms).getUTCFullYear() < 2000) return NaN;
  return ms;
}

function fmtTime(iso: string | undefined | null): string {
  if (!Number.isFinite(toValidMs(iso))) return '';
  return new Date(iso!).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function fmtDuration(min: number): string {
  if (min <= 0) return '—';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Summary builder ────────────────────────────────────────────────────────

function buildSummary(option: FlightOption) {
  const bs = option.outboundSummary;
  const segments = option.legs?.[0]?.segments;
  if (!segments?.length) return null;

  const first = segments[0];
  const last = segments[segments.length - 1];

  const departureTime =
    (Number.isFinite(toValidMs(first.departureTime)) ? first.departureTime : null)
    ?? (Number.isFinite(toValidMs(bs?.departureTime)) ? bs!.departureTime : null)
    ?? '';
  const arrivalTime =
    (Number.isFinite(toValidMs(last.arrivalTime)) ? last.arrivalTime : null)
    ?? (Number.isFinite(toValidMs(bs?.arrivalTime)) ? bs!.arrivalTime : null)
    ?? '';

  let durationMinutes = 0;
  if ((bs?.durationMinutes ?? 0) > 0) durationMinutes = bs!.durationMinutes;
  if (durationMinutes <= 0 && option.durationMinutes > 0) durationMinutes = option.durationMinutes;
  if (durationMinutes <= 0) {
    const d = toValidMs(departureTime), a = toValidMs(arrivalTime);
    if (Number.isFinite(d) && Number.isFinite(a) && a > d) durationMinutes = Math.round((a - d) / 60000);
  }
  if (durationMinutes <= 0) durationMinutes = segments.reduce((s, seg) => s + Math.max(0, seg.durationMinutes || 0), 0);

  const stopsCount = Math.max(0, segments.length - 1);
  return { departureTime, arrivalTime, durationMinutes, stopsCount, origin: first.from?.code || '', destination: last.to?.code || '' };
}

function getLayovers(segments: FlightSegment[]): { airport: string; minutes: number }[] {
  if (!segments || segments.length < 2) return [];
  const dest = segments[segments.length - 1].to?.code || '';
  const out: { airport: string; minutes: number }[] = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const ap = segments[i].to?.code || '';
    if (!ap || ap === dest) continue;
    const a = toValidMs(segments[i].arrivalTime), d = toValidMs(segments[i + 1].departureTime);
    const mins = Number.isFinite(a) && Number.isFinite(d) && d > a ? Math.round((d - a) / 60000) : 0;
    out.push({ airport: ap, minutes: mins });
  }
  return out;
}

function airlineName(option: FlightOption): string {
  const code =
    option.primaryDisplayCarrier
    || option.validatingAirlines?.[0]
    || option.legs?.[0]?.segments?.find((s) => s.marketingCarrier?.code)?.marketingCarrier?.code
    || '';
  return code ? (getAirlineName(code) || code) : '';
}

// ─── Component ──────────────────────────────────────────────────────────────

export interface FlightResultCardProps {
  option: FlightOption;
  onDetails: () => void;
  onBook: () => void;
  bookLoading?: boolean;
  bookLabel?: string;
}

export function FlightResultCard({ option, onDetails, onBook, bookLoading = false, bookLabel }: FlightResultCardProps) {
  const { theme } = useTheme();
  const { t, isRTL, currency: displayCurrency } = useLocale();
  const summary = buildSummary(option);
  const segments = option.legs?.[0]?.segments ?? [];

  const dep = fmtTime(summary?.departureTime) || '—';
  const arr = fmtTime(summary?.arrivalTime) || '—';
  const origin = summary?.origin || '';
  const dest = summary?.destination || '';
  const dur = fmtDuration(summary?.durationMinutes ?? 0);
  const stops = summary?.stopsCount ?? Math.max(0, segments.length - 1);
  const stopsText = stops === 0 ? t('direct') : stops === 1 ? `1 ${t('stop')}` : `${stops} ${t('stops')}`;
  const layovers = getLayovers(segments);
  const layoverStr = layovers.map((l) => `${l.airport}${l.minutes > 0 ? ` (${fmtDuration(l.minutes)})` : ''}`).join(', ');
  const airline = airlineName(option);

  const cabinRaw = segments[0]?.cabinClass;
  const cabinKey = cabinRaw === 'PREMIUM_ECONOMY' ? 'cabin_premium_economy' : cabinRaw === 'BUSINESS' ? 'cabin_business' : cabinRaw === 'FIRST' ? 'cabin_first' : '';
  const cabinStr = cabinKey ? t(cabinKey) : '';

  const { amount, currency: cur } = getDisplayPrice(option.price.amount, option.price.currency, displayCurrency);
  const priceStr = `${cur} ${amount.toFixed(0)}`;

  const hasBagBadge = option.baggageClass === 'BAG_OK' || option.baggageClass === 'BAG_INCLUDED';
  const bagStr = option.baggageClass === 'BAG_INCLUDED' ? t('included') : option.baggageClass === 'BAG_OK' ? t('not_included') : '';

  const row = (rtlStyle?: object) => isRTL ? [{ flexDirection: 'row-reverse' as const }, rtlStyle] : [];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onDetails}
      style={[c.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
    >
      {/* ── Row 1: Times — Duration/Stops line — Price ── */}
      <View style={[c.row1, ...row()]}>
        {/* Schedule column */}
        <View style={[c.scheduleCol, isRTL && { alignItems: 'flex-end' }]}>
          {/* Times */}
          <View style={[c.timesRow, ...row()]}>
            <Text style={[c.time, { color: theme.text }]}>{dep}</Text>
            <Text style={[c.timeSep, { color: theme.textMuted }]}>{isRTL ? ' ← ' : ' → '}</Text>
            <Text style={[c.time, { color: theme.text }]}>{arr}</Text>
          </View>
          {/* Route codes */}
          <Text style={[c.route, { color: theme.textMuted }]}>{origin}{origin && dest ? (isRTL ? ' ← ' : ' → ') : ''}{dest}</Text>
          {/* Duration + Stops */}
          <View style={[c.metaRow, ...row()]}>
            <Text style={[c.metaText, { color: theme.textMuted }]}>{dur}</Text>
            <View style={[c.stopsChip, stops === 0 ? { backgroundColor: theme.isDark ? '#064e3b' : '#d1fae5' } : { backgroundColor: theme.controlBg }]}>
              <Text style={[c.stopsChipText, stops === 0 ? { color: theme.isDark ? '#6ee7b7' : '#065f46' } : { color: theme.text }]}>{stopsText}</Text>
            </View>
          </View>
          {/* Layover detail */}
          {layoverStr ? (
            <Text style={[c.layoverText, { color: theme.textMuted }]} numberOfLines={1}>
              {layovers.length === 1 ? t('stop_at') : t('stops_at')} {layoverStr}
            </Text>
          ) : null}
        </View>

        {/* Price + actions column */}
        <View style={[c.priceCol, isRTL && { alignItems: 'flex-start' }]}>
          <Text style={[c.price, { color: theme.primary }]}>{priceStr}</Text>
          <TouchableOpacity
            style={[c.bookBtn, { backgroundColor: theme.primary }]}
            onPress={(e) => { e.stopPropagation(); onBook(); }}
            disabled={bookLoading}
            activeOpacity={0.8}
          >
            <Text style={c.bookBtnText}>{bookLoading ? '…' : bookLabel ?? t('book_now')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); onDetails(); }}
            style={c.detailsBtn}
            hitSlop={6}
          >
            <Text style={[c.detailsBtnText, { color: theme.primary }]}>
              {isRTL ? `← ${t('view_details')}` : `${t('view_details')} →`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Row 2: Airline · cabin ── */}
      <View style={[c.row2, { borderTopColor: theme.cardBorder }, ...row()]}>
        <Text style={[c.airlineText, { color: theme.text }]} numberOfLines={1}>
          {[airline, cabinStr || t('cabin_economy')].filter(Boolean).join(' · ')}
        </Text>
        {hasBagBadge && (
          <View style={[c.bagBadge, { backgroundColor: theme.controlBg }]}>
            <Text style={[c.bagBadgeText, { color: theme.textMuted }]}>🧳 {bagStr}</Text>
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
  timesRow: { flexDirection: 'row', alignItems: 'baseline' },
  time: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  timeSep: { fontSize: 13, marginHorizontal: 2 },
  route: { fontSize: 12, marginTop: 1, letterSpacing: 0.5 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  metaText: { fontSize: 13, fontWeight: '500' },
  stopsChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  stopsChipText: { fontSize: 12, fontWeight: '600' },
  layoverText: { fontSize: 11, marginTop: 3 },

  priceCol: { alignItems: 'flex-end', justifyContent: 'flex-start', minWidth: 100 },
  price: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  bookBtn: {
    marginTop: 8,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 96,
    alignItems: 'center',
  },
  bookBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  detailsBtn: { marginTop: 6 },
  detailsBtnText: { fontSize: 13, fontWeight: '600' },

  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  airlineText: { fontSize: 13, fontWeight: '500', flex: 1 },
  bagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  bagBadgeText: { fontSize: 11 },
});
