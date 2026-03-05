import { useEffect, useState } from 'react';
import { ensureRates } from '../utils/exchangeRates';

/** Ensures exchange rates are loaded. Call once at app root. */
export function useExchangeRates(): { ready: boolean } {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    ensureRates().then(() => setReady(true));
  }, []);
  return { ready };
}
