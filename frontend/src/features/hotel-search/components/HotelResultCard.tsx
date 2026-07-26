import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { getCurrencySymbol, getDisplayPrice } from '../../../utils/exchangeRates';
import type { HotelOffer } from '../../../types/hotels';

export function HotelResultCard({
  offer,
  onViewDeal,
}: {
  offer: HotelOffer;
  onViewDeal: () => void;
}) {
  const { theme } = useTheme();
  const { t, currency, isRTL } = useLocale();
  const { amount, currency: cur } = getDisplayPrice(
    offer.totalPrice.amount,
    offer.totalPrice.currency || offer.currency,
    currency
  );
  const perNight = getDisplayPrice(
    offer.pricePerNight.amount,
    offer.pricePerNight.currency || offer.currency,
    currency
  );
  const symbol = getCurrencySymbol(cur);

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
      <View style={[styles.top, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
            {offer.name}
          </Text>
          {!!offer.destination && (
            <Text style={{ color: theme.textMuted, marginTop: 2 }} numberOfLines={1}>
              {offer.destination}
              {offer.address ? ` · ${offer.address}` : ''}
            </Text>
          )}
          <View style={[styles.metaRow, isRTL && { flexDirection: 'row-reverse' }]}>
            {!!offer.starRating && offer.starRating > 0 && (
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>{'★'.repeat(Math.round(offer.starRating))}</Text>
            )}
            {!!offer.guestRating && offer.guestRating > 0 && (
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>
                {t('hotel_guest_rating')}: {offer.guestRating.toFixed(1)}
                {offer.reviewCount ? ` (${offer.reviewCount})` : ''}
              </Text>
            )}
          </View>
        </View>
        <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
          <Text style={[styles.price, { color: theme.text }]}>
            {symbol} {amount.toFixed(0)}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>
            {symbol} {perNight.amount.toFixed(0)} / {t('hotel_night')}
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>
            {offer.nights} {t('hotel_nights')}
          </Text>
        </View>
      </View>

      <View style={[styles.badges, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={[styles.badge, { color: theme.tabActive, backgroundColor: theme.tabActive + '18' }]}>
          {offer.priceStatus === 'live' ? t('hotel_price_live') : t('hotel_price_estimated')}
        </Text>
        {offer.refundable && (
          <Text style={[styles.badge, { color: '#16a34a', backgroundColor: '#16a34a18' }]}>
            {t('hotel_free_cancellation')}
          </Text>
        )}
        {offer.hasBreakfast && (
          <Text style={[styles.badge, { color: theme.text, backgroundColor: theme.controlBg }]}>
            {t('hotel_breakfast')}
          </Text>
        )}
      </View>

      {!!offer.roomType && (
        <Text style={{ color: theme.textMuted, marginTop: 8 }} numberOfLines={1}>
          {offer.roomType}
          {offer.boardType ? ` · ${offer.boardType}` : ''}
        </Text>
      )}
      {!!offer.amenities?.length && (
        <Text style={{ color: theme.textMuted, marginTop: 4, fontSize: 12 }} numberOfLines={1}>
          {offer.amenities.slice(0, 4).join(' · ')}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: theme.tabActive }]}
        onPress={onViewDeal}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>{t('hotel_view_deal')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  top: { flexDirection: 'row', gap: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  metaRow: { flexDirection: 'row', gap: 10, marginTop: 6, flexWrap: 'wrap' },
  price: { fontSize: 20, fontWeight: '800' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  cta: {
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '700' },
});
