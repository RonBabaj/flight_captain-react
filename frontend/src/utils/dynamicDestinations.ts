import type { CreateSearchSessionRequest, ExtraSearchLeg } from '../types';

export const MAX_EXTRA_DESTINATIONS = 3;

export const emptyExtraLeg = (origin = ''): ExtraSearchLeg => ({
  origin,
  destination: '',
  date: '',
});

/** True when the search uses open-jaw or multi-city dynamic routing. */
export function isDynamicDestinationsSearch(
  params?: Partial<CreateSearchSessionRequest> | null,
): boolean {
  if (!params) return false;
  const extra = (params.extraLegs ?? []).filter(
    (l) => (l.origin || '').trim() && (l.destination || '').trim(),
  );
  if (extra.length > 0) return true;
  const dest = (params.destination || '').trim().toUpperCase();
  const retOrig = (params.returnOrigin || '').trim().toUpperCase();
  return !!(retOrig && dest && retOrig !== dest);
}

export type DynamicDestinationsValidation =
  | { ok: true; payload: CreateSearchSessionRequest }
  | { ok: false; error: string };

/** Shared validation for Dynamic Destinations searches (form + results edit). */
export function validateDynamicDestinationsSearch(
  params: CreateSearchSessionRequest,
  t: (key: string) => string,
  currency: string,
  locale: string,
): DynamicDestinationsValidation {
  const origin = params.origin.trim().toUpperCase();
  const destination = params.destination.trim().toUpperCase();
  const returnOrigin = (params.returnOrigin || '').trim().toUpperCase();
  const returnDestination = (params.returnDestination || origin).trim().toUpperCase();
  const extras = params.extraLegs ?? [];

  if (!origin || !destination || !params.departureDate) {
    return { ok: false, error: t('please_fill_origin_destination') };
  }
  if (!params.returnDate) {
    return { ok: false, error: t('choose_return_date') };
  }
  if (!returnOrigin) {
    return { ok: false, error: t('dd_need_return_origin') };
  }
  if (origin === destination) {
    return { ok: false, error: t('dd_outbound_same') };
  }

  const extraLegs: ExtraSearchLeg[] = [];
  for (const raw of extras) {
    const eo = (raw.origin || '').trim().toUpperCase();
    const ed = (raw.destination || '').trim().toUpperCase();
    const date = (raw.date || '').trim();
    if (!eo && !ed && !date) continue;
    if (!eo || !ed || !date) {
      return { ok: false, error: t('dd_need_extra_fields') };
    }
    if (eo === ed) {
      return { ok: false, error: t('dd_extra_same') };
    }
    if (date < params.departureDate || date > params.returnDate) {
      return { ok: false, error: t('dd_extra_date_order') };
    }
    extraLegs.push({ origin: eo, destination: ed, date });
  }

  if (extraLegs.length === 0 && returnOrigin === destination) {
    return { ok: false, error: t('dd_return_must_differ') };
  }

  return {
    ok: true,
    payload: {
      ...params,
      origin,
      destination,
      returnOrigin,
      returnDestination,
      extraLegs,
      returnDate: params.returnDate,
      currency,
      locale,
      cabinPreference:
        (params.cabinClass as CreateSearchSessionRequest['cabinPreference']) || 'ECONOMY',
    },
  };
}

export function patchDynamicDestinationsParams<K extends keyof CreateSearchSessionRequest>(
  prev: CreateSearchSessionRequest,
  key: K,
  value: CreateSearchSessionRequest[K],
): CreateSearchSessionRequest {
  const next = { ...prev, [key]: value };
  if (key === 'origin' && typeof value === 'string') {
    const home = value.trim().toUpperCase();
    const prevHome = (prev.origin || '').trim().toUpperCase();
    const retDest = (prev.returnDestination || '').trim().toUpperCase();
    if (!retDest || retDest === prevHome) {
      next.returnDestination = home;
    }
  }
  if (key === 'destination' && typeof value === 'string') {
    const dest = value.trim().toUpperCase();
    const prevDest = (prev.destination || '').trim().toUpperCase();
    const list = [...(prev.extraLegs ?? [])];
    if (list[0] && (!list[0].origin || list[0].origin.toUpperCase() === prevDest)) {
      list[0] = { ...list[0], origin: dest };
      next.extraLegs = list;
    }
  }
  return next;
}

export function patchExtraLeg(
  prev: CreateSearchSessionRequest,
  index: number,
  patch: Partial<ExtraSearchLeg>,
): CreateSearchSessionRequest {
  const list = [...(prev.extraLegs ?? [])];
  const old = list[index] ?? emptyExtraLeg();
  const nextLeg = { ...old, ...patch };
  list[index] = nextLeg;
  if (patch.destination !== undefined && list[index + 1]) {
    const prevDest = (old.destination || '').trim().toUpperCase();
    const chained = (list[index + 1].origin || '').trim().toUpperCase();
    if (!chained || chained === prevDest) {
      list[index + 1] = {
        ...list[index + 1],
        origin: String(patch.destination).trim().toUpperCase(),
      };
    }
  }
  return { ...prev, extraLegs: list };
}

export function addExtraDestinationLeg(prev: CreateSearchSessionRequest): CreateSearchSessionRequest {
  const extras = prev.extraLegs ?? [];
  if (extras.length >= MAX_EXTRA_DESTINATIONS) return prev;
  const prevTo = extras.length > 0 ? extras[extras.length - 1].destination : prev.destination;
  return {
    ...prev,
    extraLegs: [...extras, emptyExtraLeg((prevTo || '').trim().toUpperCase())],
  };
}

export function removeExtraDestinationLeg(
  prev: CreateSearchSessionRequest,
  index: number,
): CreateSearchSessionRequest {
  return {
    ...prev,
    extraLegs: (prev.extraLegs ?? []).filter((_, i) => i !== index),
  };
}
