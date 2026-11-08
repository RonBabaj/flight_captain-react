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
  /**
   * Monotonic counter bumped on every new user-initiated search.
   * Async poll/hydrate callbacks capture the generation at start and must
   * discard updates when it no longer matches (prevents stale BKK results
   * after the user already switched to BER, etc.).
   */
  searchGeneration: number;
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
  searchGeneration: 0,
  isLoading: false,
  error: null,
  sortField: 'price' as SortField,
  sortOrder: 'asc' as SortOrder,
  filters: defaultFilters,
  expandedOptionId: null,
}));

/** True when this async work still belongs to the active search. */
export function isCurrentSearchGeneration(generation: number): boolean {
  return useSearchStore.getState().searchGeneration === generation;
}

export const searchActions = {
  setParams: (params: CreateSearchSessionRequest | null) =>
    useSearchStore.setState({ params }),

  /**
   * Start a new search: bump generation, apply params, clear prior results.
   * By default also clears the session (PENDING + null id) so Results bootstraps
   * or the caller hydrates. Pass `{ clearSession: false }` when the caller will
   * attach a new session id immediately (e.g. Explore) and must not trigger the
   * empty-session bootstrap on a still-mounted Results screen.
   */
  beginSearch: (params: CreateSearchSessionRequest, opts?: { clearSession?: boolean }) => {
    const nextGen = useSearchStore.getState().searchGeneration + 1;
    const clearSession = opts?.clearSession !== false;
    useSearchStore.setState({
      params,
      ...(clearSession
        ? { sessionId: null, session: null, status: 'PENDING' as SearchSessionStatus }
        : {}),
      results: [],
      version: 0,
      searchGeneration: nextGen,
      error: null,
      expandedOptionId: null,
    });
    return nextGen;
  },

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

  /** Apply session + results when generation/sessionId still match the active search. */
  applySessionResults: (opts: {
    generation?: number;
    sessionId: string;
    session: SearchSession | null;
    status: SearchSessionStatus | null;
    results: FlightOption[];
    version: number;
  }): boolean => {
    const state = useSearchStore.getState();
    if (opts.generation != null && state.searchGeneration !== opts.generation) {
      return false;
    }
    if (state.sessionId != null && state.sessionId !== opts.sessionId) {
      return false;
    }
    if (state.sessionId == null && state.status === 'PENDING' && opts.generation == null) {
      return false;
    }

    const sessionChanged = state.sessionId !== opts.sessionId;
    const nextVersion = opts.version;
    if (nextVersion !== 0 && !sessionChanged && state.version > nextVersion) {
      return false;
    }

    useSearchStore.setState({
      sessionId: opts.sessionId,
      session: opts.session,
      status: opts.status,
      results: opts.results,
      version: nextVersion,
      ...(state.params == null && opts.session?.params ? { params: opts.session.params } : {}),
    });
    return true;
  },

  setResults: (results: FlightOption[], version: number) =>
    useSearchStore.setState(state => {
      // version === 0 is an explicit clear (bootstrap / reset); always apply.
      if (version === 0) {
        return { results, version: 0 };
      }
      return {
        results: state.version < version ? results : state.results,
        version,
      };
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
      searchGeneration: useSearchStore.getState().searchGeneration + 1,
      isLoading: false,
      error: null,
      sortField: 'price',
      sortOrder: 'asc',
      filters: defaultFilters,
      expandedOptionId: null,
    }),
};
