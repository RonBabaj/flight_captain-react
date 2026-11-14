import { createSearchSessionWithRetry, getSearchSessionResults } from '../api/search';
import { getRuntimeConfig } from '../config/runtimeConfigStore';
import type { CreateSearchSessionRequest, FlightOption } from '../types';

/** European hubs tried for “cheaper via city” positioning searches. */
export const POSITIONING_HUB_AIRPORTS = [
  'ATH',
  'VIE',
  'BUD',
  'FCO',
  'MXP',
  'SOF',
  'OTP',
] as const;

export type CheapestOptionResult = {
  sessionId: string;
  option: FlightOption;
};

/**
 * Create a search session, wait until COMPLETE/FAILED (or attempt budget), return cheapest offer.
 */
export async function findCheapestOptionForParams(
  base: CreateSearchSessionRequest,
  opts?: { maxAttempts?: number; pollIntervalMs?: number }
): Promise<CheapestOptionResult | null> {
  const cfg = getRuntimeConfig();
  const maxAttempts = opts?.maxAttempts ?? 6;
  const pollIntervalMs = opts?.pollIntervalMs ?? cfg.pollIntervalMs;

  const session = await createSearchSessionWithRetry({ ...base, fastOnly: true });
  let attempts = 0;
  let lastResults: FlightOption[] = [];

  while (attempts < maxAttempts) {
    const res = await getSearchSessionResults(session.id);
    lastResults = res.results ?? [];
    const status = res.session?.status;
    if (status === 'COMPLETE' || status === 'FAILED') {
      break;
    }
    attempts += 1;
    await new Promise<void>((r) => setTimeout(r, pollIntervalMs));
  }

  if (!lastResults.length) return null;
  const best = lastResults.reduce(
    (min, opt) => (opt.price.amount < min.price.amount ? opt : min),
    lastResults[0]
  );
  return { sessionId: session.id, option: best };
}
