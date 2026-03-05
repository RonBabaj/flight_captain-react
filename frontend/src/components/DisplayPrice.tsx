/**
 * Displays a price in the user's selected currency, converting in real time when currency changes.
 */

import React from 'react';
import { Text } from 'react-native';
import { useLocale } from '../context/LocaleContext';
import { getDisplayPrice } from '../utils/exchangeRates';

interface DisplayPriceProps {
  amount: number;
  currency: string;
  decimals?: number;
  style?: object;
}

export function DisplayPrice({ amount, currency, decimals = 0, style }: DisplayPriceProps) {
  const { currency: displayCurrency } = useLocale();
  const { amount: displayAmount, currency: outCurr } = getDisplayPrice(
    amount,
    currency,
    displayCurrency
  );
  const formatted = displayAmount.toFixed(decimals);
  return <Text style={style}>{outCurr} {formatted}</Text>;
}
