export type UserRole = 'guest' | 'user' | 'admin';

export interface RuntimeConfig {
  pollIntervalMs: number;
  slowResultsPopupDelayMs: number;
  positioningBudgetMs: number;
  positioningPollIntervalMs: number;
  positioningPollMaxAttempts: number;
  explorePrefetchTimeoutMs: number;
  exploreLiveTimeoutMs: number;
  airportAutocompleteDebounceMs: number;
  datePickerDuplicateTapMs: number;
  resultsCacheTtlMs: number;
  resultsStorageTtlMs: number;
  exchangeRatesRefreshMs: number;
  apiRequestDefaultTimeoutMs: number;
  searchSessionTtlMinutes: number;
  monthDealsCacheTtlMinutes: number;
}

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  pollIntervalMs: 1500,
  slowResultsPopupDelayMs: 60_000,
  positioningBudgetMs: 45_000,
  positioningPollIntervalMs: 1500,
  positioningPollMaxAttempts: 6,
  explorePrefetchTimeoutMs: 15_000,
  exploreLiveTimeoutMs: 35_000,
  airportAutocompleteDebounceMs: 300,
  datePickerDuplicateTapMs: 400,
  resultsCacheTtlMs: 5 * 60 * 1000,
  resultsStorageTtlMs: 24 * 60 * 60 * 1000,
  exchangeRatesRefreshMs: 60 * 60 * 1000,
  apiRequestDefaultTimeoutMs: 90_000,
  searchSessionTtlMinutes: 25,
  monthDealsCacheTtlMinutes: 15,
};

export type RuntimeConfigField = keyof RuntimeConfig;

export interface RuntimeConfigFieldMeta {
  key: RuntimeConfigField;
  labelKey: string;
  descriptionKey: string;
  unit: 'ms' | 'minutes' | 'count';
  min: number;
  max: number;
  section: 'search' | 'explore' | 'positioning' | 'cache' | 'backend';
}

export const RUNTIME_CONFIG_FIELDS: RuntimeConfigFieldMeta[] = [
  {
    key: 'pollIntervalMs',
    labelKey: 'admin_cfg_poll_interval',
    descriptionKey: 'admin_cfg_poll_interval_desc',
    unit: 'ms',
    min: 500,
    max: 10_000,
    section: 'search',
  },
  {
    key: 'slowResultsPopupDelayMs',
    labelKey: 'admin_cfg_slow_popup',
    descriptionKey: 'admin_cfg_slow_popup_desc',
    unit: 'ms',
    min: 5_000,
    max: 600_000,
    section: 'search',
  },
  {
    key: 'apiRequestDefaultTimeoutMs',
    labelKey: 'admin_cfg_api_timeout',
    descriptionKey: 'admin_cfg_api_timeout_desc',
    unit: 'ms',
    min: 30_000,
    max: 600_000,
    section: 'search',
  },
  {
    key: 'explorePrefetchTimeoutMs',
    labelKey: 'admin_cfg_explore_prefetch',
    descriptionKey: 'admin_cfg_explore_prefetch_desc',
    unit: 'ms',
    min: 5_000,
    max: 120_000,
    section: 'explore',
  },
  {
    key: 'exploreLiveTimeoutMs',
    labelKey: 'admin_cfg_explore_live',
    descriptionKey: 'admin_cfg_explore_live_desc',
    unit: 'ms',
    min: 10_000,
    max: 300_000,
    section: 'explore',
  },
  {
    key: 'positioningBudgetMs',
    labelKey: 'admin_cfg_positioning_budget',
    descriptionKey: 'admin_cfg_positioning_budget_desc',
    unit: 'ms',
    min: 10_000,
    max: 300_000,
    section: 'positioning',
  },
  {
    key: 'positioningPollIntervalMs',
    labelKey: 'admin_cfg_positioning_poll',
    descriptionKey: 'admin_cfg_positioning_poll_desc',
    unit: 'ms',
    min: 500,
    max: 10_000,
    section: 'positioning',
  },
  {
    key: 'positioningPollMaxAttempts',
    labelKey: 'admin_cfg_positioning_attempts',
    descriptionKey: 'admin_cfg_positioning_attempts_desc',
    unit: 'count',
    min: 1,
    max: 30,
    section: 'positioning',
  },
  {
    key: 'airportAutocompleteDebounceMs',
    labelKey: 'admin_cfg_airport_debounce',
    descriptionKey: 'admin_cfg_airport_debounce_desc',
    unit: 'ms',
    min: 100,
    max: 2_000,
    section: 'search',
  },
  {
    key: 'datePickerDuplicateTapMs',
    labelKey: 'admin_cfg_date_tap',
    descriptionKey: 'admin_cfg_date_tap_desc',
    unit: 'ms',
    min: 100,
    max: 2_000,
    section: 'search',
  },
  {
    key: 'resultsCacheTtlMs',
    labelKey: 'admin_cfg_results_cache',
    descriptionKey: 'admin_cfg_results_cache_desc',
    unit: 'ms',
    min: 60_000,
    max: 86_400_000,
    section: 'cache',
  },
  {
    key: 'resultsStorageTtlMs',
    labelKey: 'admin_cfg_results_storage',
    descriptionKey: 'admin_cfg_results_storage_desc',
    unit: 'ms',
    min: 3_600_000,
    max: 604_800_000,
    section: 'cache',
  },
  {
    key: 'exchangeRatesRefreshMs',
    labelKey: 'admin_cfg_exchange_refresh',
    descriptionKey: 'admin_cfg_exchange_refresh_desc',
    unit: 'ms',
    min: 300_000,
    max: 86_400_000,
    section: 'cache',
  },
  {
    key: 'searchSessionTtlMinutes',
    labelKey: 'admin_cfg_session_ttl',
    descriptionKey: 'admin_cfg_session_ttl_desc',
    unit: 'minutes',
    min: 5,
    max: 240,
    section: 'backend',
  },
  {
    key: 'monthDealsCacheTtlMinutes',
    labelKey: 'admin_cfg_deals_cache',
    descriptionKey: 'admin_cfg_deals_cache_desc',
    unit: 'minutes',
    min: 1,
    max: 240,
    section: 'backend',
  },
];
