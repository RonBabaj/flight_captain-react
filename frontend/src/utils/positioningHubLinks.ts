import type { CheaperCitiesOption } from '../features/flight-search/components/CheaperCitiesSection';
import type { CreateSearchSessionRequest } from '../types';
import {
  openFlyFixLegSearchInNewTab,
  openFlyFixSavedResultsInNewTab,
  type FlyFixLegSearchParams,
} from './searchRouteUrl';

type StoreParams = Partial<CreateSearchSessionRequest> | null | undefined;

function legBase(storeParams: StoreParams, currencyFallback: string): Omit<FlyFixLegSearchParams, 'origin' | 'destination'> {
  const dep = (storeParams?.departureDate || '').trim();
  return {
    departureDate: dep,
    adults: storeParams?.adults ?? 1,
    children: storeParams?.children ?? 0,
    currency: storeParams?.currency || currencyFallback,
    cabinClass: storeParams?.cabinClass,
  };
}

/** Open the priced origin → hub leg (saved session when the optimizer captured it). */
export async function openHubPositioningLeg(
  hub: CheaperCitiesOption,
  storeParams: StoreParams,
  currencyFallback: string,
): Promise<boolean> {
  const origin = (storeParams?.origin || '').trim().toUpperCase();
  const destination = hub.hubAirport.trim().toUpperCase();
  const base = legBase(storeParams, currencyFallback);
  if (!origin || !destination || !base.departureDate) return false;

  if (hub.positioningSessionId && hub.positioningOptionId) {
    return openFlyFixSavedResultsInNewTab({
      origin,
      destination,
      ...base,
      sessionId: hub.positioningSessionId,
      optionId: hub.positioningOptionId,
    });
  }
  const dep = hub.departureDate?.trim() || base.departureDate;
  return openFlyFixLegSearchInNewTab({ origin, destination, ...base, departureDate: dep });
}

/** Open the priced hub → destination leg. */
export async function openHubMainLeg(
  hub: CheaperCitiesOption,
  storeParams: StoreParams,
  currencyFallback: string,
): Promise<boolean> {
  const origin = hub.hubAirport.trim().toUpperCase();
  const destination = (storeParams?.destination || '').trim().toUpperCase();
  const base = legBase(storeParams, currencyFallback);
  if (!origin || !destination || !base.departureDate) return false;

  if (hub.hubSessionId && hub.hubOptionId) {
    return openFlyFixSavedResultsInNewTab({
      origin,
      destination,
      ...base,
      sessionId: hub.hubSessionId,
      optionId: hub.hubOptionId,
    });
  }
  const dep = hub.departureDate?.trim() || base.departureDate;
  return openFlyFixLegSearchInNewTab({ origin, destination, ...base, departureDate: dep });
}