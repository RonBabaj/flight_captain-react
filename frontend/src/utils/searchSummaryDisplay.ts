import type { CreateSearchSessionRequest } from '../types';
import type { LanguageCode } from '../data/translations';
import { destinationLabelForCode } from './placeSearch';

function formatTripDate(ymd: string | undefined, locale: string): string {
  if (!ymd?.trim()) return '';
  const parts = ymd.trim().split('-').map((x) => parseInt(x, 10));
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return ymd;
  const [y, m, d] = parts;
  try {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(y, m - 1, d)));
  } catch {
    return ymd;
  }
}

export type ResultsSearchSummary = {
  headline: string;
  subtitle: string;
  /** Flat fallback for accessibility / sharing */
  plain: string;
};

/** Two-line Results header — route title + trip meta (no ISO dot soup). */
export function buildResultsSearchSummary(
  params: Partial<CreateSearchSessionRequest> | null | undefined,
  language: LanguageCode,
  locale: string,
  t: (key: string) => string,
): ResultsSearchSummary {
  if (!params?.origin?.trim() || !params?.destination?.trim()) {
    const plain = t('search_results');
    return { headline: plain, subtitle: '', plain };
  }

  const arrow = ' → ';
  const extraLegs = (params.extraLegs ?? []).filter(
    (l) => (l.origin || '').trim() && (l.destination || '').trim(),
  );
  const isOpenJaw = !!(
    params.returnOrigin &&
    params.returnOrigin.toUpperCase() !== (params.destination || '').toUpperCase()
  );

  let headline: string;
  if (isOpenJaw || extraLegs.length > 0) {
    const parts: string[] = [];
    parts.push(
      `${destinationLabelForCode(params.origin, language, t)}${arrow}${destinationLabelForCode(params.destination, language, t)}`,
    );
    extraLegs.forEach((l) => {
      parts.push(
        `${destinationLabelForCode(l.origin, language, t)}${arrow}${destinationLabelForCode(l.destination, language, t)}`,
      );
    });
    const retFrom = (params.returnOrigin || params.destination).toUpperCase();
    const retTo = (params.returnDestination || params.origin).toUpperCase();
    parts.push(`${destinationLabelForCode(retFrom, language, t)}${arrow}${destinationLabelForCode(retTo, language, t)}`);
    headline = parts.join(' · ');
  } else {
    headline = `${destinationLabelForCode(params.origin, language, t)}${arrow}${destinationLabelForCode(params.destination, language, t)}`;
  }

  const meta: string[] = [];
  const dep = formatTripDate(params.departureDate, locale);
  const ret = formatTripDate(params.returnDate, locale);
  if (dep && ret) meta.push(`${dep} – ${ret}`);
  else if (dep) meta.push(dep);

  if (params.adults != null && params.adults > 0) {
    meta.push(`${params.adults} ${params.adults === 1 ? t('adult') : t('adults')}`);
  }
  if (params.cabinClass && params.cabinClass !== 'ECONOMY') {
    const cabinKey =
      params.cabinClass === 'PREMIUM_ECONOMY'
        ? 'cabin_premium_economy'
        : params.cabinClass === 'BUSINESS'
          ? 'cabin_business'
          : params.cabinClass === 'FIRST'
            ? 'cabin_first'
            : 'cabin_economy';
    meta.push(t(cabinKey));
  }

  const subtitle = meta.join(' · ');
  const plain = subtitle ? `${headline} · ${subtitle}` : headline;
  return { headline, subtitle, plain };
}