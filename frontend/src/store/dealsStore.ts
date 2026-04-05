import { create } from 'zustand';
import type { DayDeal, MonthDealsResponse } from '../types';

export type DealsSortField = 'price' | 'duration' | 'best';

interface DealsState {
  route: { origin: string; destination: string } | null;
  year: number;
  month: number;
  durationDays: number;
  /** 0=Sun … 6=Sat. Empty array means "any day". */
  preferredDays: number[];
  sortField: DealsSortField;
  sortOrder: 'asc' | 'desc';
  maxPrice: number | null;
  maxStops: number | null;      // null = any, 0 = direct, 1 = 1 stop, 2 = 2+
  selectedAirlines: string[];   // empty = all airlines
  data: MonthDealsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const now = new Date();

/** Earliest selectable month for Monthly Deals (local calendar, first of current month). */
export function getMinimumAllowedDealsYearMonth(): { year: number; month: number } {
  const n = new Date();
  return { year: n.getFullYear(), month: n.getMonth() + 1 };
}

export function clampDealsMonth(year: number, month: number): { year: number; month: number } {
  const min = getMinimumAllowedDealsYearMonth();
  if (year > min.year || (year === min.year && month >= min.month)) {
    return { year, month };
  }
  return { ...min };
}

export const useDealsStore = create<DealsState>(() => ({
  route: null,
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  durationDays: 7,
  preferredDays: [],
  sortField: 'price' as DealsSortField,
  sortOrder: 'asc',
  maxPrice: null,
  maxStops: null,
  selectedAirlines: [],
  data: null,
  isLoading: false,
  error: null,
}));

export const dealsActions = {
  setRoute: (origin: string, destination: string) =>
    useDealsStore.setState({ route: { origin, destination } }),

  setMonth: (year: number, month: number) =>
    useDealsStore.setState(() => clampDealsMonth(year, month)),

  prevMonth: () =>
    useDealsStore.setState((state) => {
      const min = getMinimumAllowedDealsYearMonth();
      if (state.year < min.year || (state.year === min.year && state.month <= min.month)) {
        return {};
      }
      let { year, month } = state;
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      return clampDealsMonth(year, month);
    }),

  nextMonth: () =>
    useDealsStore.setState(state => {
      let { year, month } = state;
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
      return { year, month };
    }),

  setDurationDays: (durationDays: number) =>
    useDealsStore.setState({ durationDays }),

  togglePreferredDay: (day: number) =>
    useDealsStore.setState(state => {
      const has = state.preferredDays.includes(day);
      return { preferredDays: has ? state.preferredDays.filter(d => d !== day) : [...state.preferredDays, day] };
    }),

  clearPreferredDays: () =>
    useDealsStore.setState({ preferredDays: [] }),

  setSort: (field: DealsSortField, order: 'asc' | 'desc') =>
    useDealsStore.setState({ sortField: field, sortOrder: order }),

  setMaxPrice: (maxPrice: number | null) =>
    useDealsStore.setState({ maxPrice }),

  setMaxStops: (maxStops: number | null) =>
    useDealsStore.setState({ maxStops }),

  toggleAirline: (code: string) =>
    useDealsStore.setState(state => {
      const has = state.selectedAirlines.includes(code);
      return { selectedAirlines: has ? state.selectedAirlines.filter(c => c !== code) : [...state.selectedAirlines, code] };
    }),

  clearAirlines: () =>
    useDealsStore.setState({ selectedAirlines: [] }),

  setData: (data: MonthDealsResponse | null) =>
    useDealsStore.setState({ data }),

  setLoading: (isLoading: boolean) =>
    useDealsStore.setState({ isLoading }),

  setError: (error: string | null) =>
    useDealsStore.setState({ error }),
};
