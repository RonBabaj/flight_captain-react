/**
 * Exchange rates for real-time price conversion when user changes currency.
 * Fetches from Frankfurter API (free, no key). Rates: 1 USD = X foreign.
 */

const FRANKFURTER_URL = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=GBP,EUR,ILS,JPY';
const REFRESH_MS = 60 * 60 * 1000; // 1 hour

type CurrencyCode = 'USD' | 'GBP' | 'EUR' | 'ILS' | 'JPY';

// 1 unit of currency = X USD. USD = 1. Fallback when API fails.
let ratesToUSD: Record<CurrencyCode, number> = {
  USD: 1,
  GBP: 1.27,
  EUR: 1.08,
  ILS: 0.27,
  JPY: 0.0067,
};

let lastFetch = 0;

async function fetchRates(): Promise<void> {
  try {
    const res = await fetch(FRANKFURTER_URL);
    if (!res.ok) return;
    const data = await res.json() as { rates?: Record<string, number> };
    if (!data.rates) return;
    ratesToUSD.USD = 1;
    for (const [curr, perUSD] of Object.entries(data.rates)) {
      const c = curr.toUpperCase() as CurrencyCode;
      if (perUSD > 0 && (c === 'GBP' || c === 'EUR' || c === 'ILS' || c === 'JPY')) {
        ratesToUSD[c] = 1 / perUSD;
      }
    }
    lastFetch = Date.now();
  } catch {
    // keep fallback rates
  }
}

export async function ensureRates(): Promise<void> {
  if (Date.now() - lastFetch < REFRESH_MS && lastFetch > 0) return;
  await fetchRates();
}

/** Convert amount from fromCurr to toCurr. Returns original if rates unknown. */
export function convertPrice(
  amount: number,
  fromCurr: string,
  toCurr: string
): number {
  if (fromCurr === toCurr || amount <= 0) return amount;
  const from = fromCurr.toUpperCase() as CurrencyCode;
  const to = toCurr.toUpperCase() as CurrencyCode;
  const fromRate = ratesToUSD[from];
  const toRate = ratesToUSD[to];
  if (fromRate == null || toRate == null || toRate <= 0) return amount;
  const usd = amount * fromRate;
  return usd / toRate;
}

/** Get display price: amount and currency for the user's selected currency. */
export function getDisplayPrice(
  amount: number,
  fromCurrency: string,
  displayCurrency: string
): { amount: number; currency: string } {
  if (fromCurrency === displayCurrency) {
    return { amount, currency: displayCurrency };
  }
  const converted = convertPrice(amount, fromCurrency, displayCurrency);
  return { amount: converted, currency: displayCurrency };
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  ILS: '₪',
  JPY: '¥',
};

/** Map currency code to display symbol. Falls back to the code if unknown. */
export function getCurrencySymbol(code: string): string {
  const key = code.toUpperCase();
  return CURRENCY_SYMBOLS[key] ?? key;
}
