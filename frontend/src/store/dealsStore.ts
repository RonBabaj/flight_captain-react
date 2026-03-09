import { create } from 'zustand';
import type { DayDeal, MonthDealsResponse } from '../types';

interface DealsState {
  route: { origin: string; destination: string } | null;
  year: number;
  month: number;
  durationDays: number;
  /** 0=Sun … 6=Sat. Empty array means "any day". */
  preferredDays: number[];
  data: MonthDealsResponse | null;
  isLoading: boolean;
  error: string | null;
}

const now = new Date();

export const useDealsStore = create<DealsState>(() => ({
  route: null,
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  durationDays: 7,
  preferredDays: [],
  data: null,
  isLoading: false,
  error: null,
}));

export const dealsActions = {
  setRoute: (origin: string, destination: string) =>
    useDealsStore.setState({ route: { origin, destination } }),

  setMonth: (year: number, month: number) =>
    useDealsStore.setState({ year, month }),

  prevMonth: () =>
    useDealsStore.setState(state => {
      let { year, month } = state;
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      return { year, month };
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

  setData: (data: MonthDealsResponse | null) =>
    useDealsStore.setState({ data }),

  setLoading: (isLoading: boolean) =>
    useDealsStore.setState({ isLoading }),

  setError: (error: string | null) =>
    useDealsStore.setState({ error }),
};
