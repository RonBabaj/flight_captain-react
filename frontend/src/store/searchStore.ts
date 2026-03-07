import { create } from 'zustand';
import type {
  CreateSearchSessionRequest,
  FlightOption,
  SearchSession,
  SearchSessionStatus,
} from '../types';

export type SortField = 'price' | 'duration' | 'best';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  maxStops: number | null;       // null = any
  airlines: string[];            // empty = any
  departureAfter?: string;       // HH:mm
  departureBefore?: string;      // HH:mm
  maxDurationMinutes?: number;    // client-side only
}

interface SearchState {
  // Form / params
  params: CreateSearchSessionRequest | null;
  // Session
  sessionId: string | null;
  session: SearchSession | null;
  status: SearchSessionStatus | null;
  results: FlightOption[];
  version: number;
  // UI state
  isLoading: boolean;
  error: string | null;
  // Results view
  sortField: SortField;
  sortOrder: SortOrder;
  filters: SearchFilters;
  expandedOptionId: string | null;
}

const defaultFilters: SearchFilters = {
  maxStops: null,
  airlines: [],
};

export const useSearchStore = create<SearchState>(() => ({
  params: null,
  sessionId: null,
  session: null,
  status: null,
  results: [],
  version: 0,
  isLoading: false,
  error: null,
  sortField: 'price' as SortField,
  sortOrder: 'asc' as SortOrder,
  filters: defaultFilters,
  expandedOptionId: null,
}));

export const searchActions = {
  setParams: (params: CreateSearchSessionRequest | null) =>
    useSearchStore.setState({ params }),

  setSession: (sessionId: string | null, session: SearchSession | null, status: SearchSessionStatus | null) =>
    useSearchStore.setState((state) => {
      const sessionChanged = state.sessionId !== sessionId;
      return {
        sessionId,
        session,
        status,
        ...(sessionChanged ? { results: [], version: 0 } : {}),
      };
    }),

  setResults: (results: FlightOption[], version: number) =>
    useSearchStore.setState(state => ({
      results: state.version < version ? results : state.results,
      version,
    })),

  appendResults: (newResults: FlightOption[], version: number) =>
    useSearchStore.setState(state => {
      if (version <= state.version) return state;
      const byId = new Map(state.results.map(r => [r.id, r]));
      newResults.forEach(r => byId.set(r.id, r));
      return { results: [...byId.values()], version };
    }),

  setLoading: (isLoading: boolean) =>
    useSearchStore.setState({ isLoading }),

  setError: (error: string | null) =>
    useSearchStore.setState({ error }),

  setSort: (sortField: SortField, sortOrder: SortOrder) =>
    useSearchStore.setState({ sortField, sortOrder }),

  setFilters: (filters: Partial<SearchFilters>) =>
    useSearchStore.setState(state => ({
      filters: { ...state.filters, ...filters },
    })),

  setExpandedOption: (id: string | null) =>
    useSearchStore.setState({ expandedOptionId: id }),

  reset: () =>
    useSearchStore.setState({
      params: null,
      sessionId: null,
      session: null,
      status: null,
      results: [],
      version: 0,
      isLoading: false,
      error: null,
      sortField: 'price',
      sortOrder: 'asc',
      filters: defaultFilters,
      expandedOptionId: null,
    }),
};
