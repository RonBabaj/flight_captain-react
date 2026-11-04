import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ClearableTextInput } from '../../../components/ClearableTextInput';
import { AppIcon } from '../../../components/AppIcon';
import { getCityDisplayName, getAirportDisplayName } from '../../../data/airports';
import { getCountryDisplayName, getCountryEntry } from '../../../data/countries';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import {
  ANYWHERE_CODE,
  isCountryDestination,
  makeCountryDestination,
  parseCountryDestination,
} from '../../../types';
import type { AirportCityResult } from '../../../types';
import {
  formatPlaceCodeForDisplay,
  placeResultToCode,
  resolveCountryToPrimaryAirport,
  resolvePlaceQuery,
  searchPlacesLocal,
  PLACE_SEARCH_LIMIT,
} from '../../../utils/placeSearch';
import { getRuntimeConfig } from '../../../config/runtimeConfigStore';

const MIN_CHARS = 2;

export type CountrySelectMode = 'none' | 'resolve-primary' | 'country-code';

interface AirportAutocompleteProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  showAnywhere?: boolean;
  countryMode?: CountrySelectMode;
}

export function AirportAutocomplete({
  label,
  value,
  onChange,
  placeholder,
  showAnywhere = false,
  countryMode = 'none',
}: AirportAutocompleteProps) {
  const { theme } = useTheme();
  const { language, t } = useLocale();
  const [query, setQuery] = useState(value);
  const [showList, setShowList] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceMs = getRuntimeConfig().airportAutocompleteDebounceMs;

  const applyStoredCode = useCallback(
    (code: string) => {
      onChange(code);
      setQuery(formatPlaceCodeForDisplay(code, language, t));
    },
    [language, onChange, t],
  );

  useEffect(() => {
    if (!value) {
      setQuery('');
      return;
    }
    setQuery(formatPlaceCodeForDisplay(value, language, t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < MIN_CHARS) return [];
    return searchPlacesLocal(q, PLACE_SEARCH_LIMIT, language);
  }, [query, language]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, debounceMs]);

  const commitSelection = useCallback(
    (item: AirportCityResult) => {
      if (item.type === 'COUNTRY' && item.countryCode) {
        if (countryMode === 'resolve-primary') {
          const hub = resolveCountryToPrimaryAirport(item.countryCode);
          if (hub) {
            applyStoredCode(hub);
            setShowList(false);
            return;
          }
        }
        if (countryMode === 'country-code') {
          applyStoredCode(makeCountryDestination(item.countryCode));
          setShowList(false);
          return;
        }
      }
      applyStoredCode(placeResultToCode(item));
      setShowList(false);
    },
    [applyStoredCode, countryMode],
  );

  const tryResolveTypedQuery = useCallback(() => {
    const resolved = resolvePlaceQuery(query, language);
    if (!resolved) return false;
    if (isCountryDestination(resolved)) {
      if (countryMode === 'resolve-primary') {
        const cc = parseCountryDestination(resolved);
        const hub = cc ? resolveCountryToPrimaryAirport(cc) : null;
        if (hub) {
          applyStoredCode(hub);
          return true;
        }
        return false;
      }
      if (countryMode === 'country-code') {
        applyStoredCode(resolved);
        return true;
      }
      return false;
    }
    applyStoredCode(resolved);
    return true;
  }, [applyStoredCode, countryMode, language, query]);

  const handleSelectAnywhere = () => {
    applyStoredCode(ANYWHERE_CODE);
    setShowList(false);
  };

  const queryMatchesAnywhere = showAnywhere &&
    (query.trim().length === 0 ||
      t('anywhere').toLowerCase().startsWith(query.trim().toLowerCase()) ||
      'anywhere'.startsWith(query.trim().toLowerCase()) ||
      'everywhere'.startsWith(query.trim().toLowerCase()));

  const listVisible = showList && (
    (showAnywhere && queryMatchesAnywhere) ||
    (query.trim().length >= MIN_CHARS && results.length > 0)
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <ClearableTextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
            color: theme.text,
          },
        ]}
        placeholder={placeholder ?? t('city_country_or_airport')}
        placeholderTextColor={theme.textMuted}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShowList(true);
        }}
        onClear={() => {
          onChange('');
          setShowList(false);
        }}
        onFocus={() => setShowList(true)}
        onBlur={() => tryResolveTypedQuery()}
        onSubmitEditing={() => {
          tryResolveTypedQuery();
          setShowList(false);
        }}
      />
      {query.trim().length > 0 && query.trim().length < MIN_CHARS && !queryMatchesAnywhere && (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          {t('type_min_chars').replace('{n}', String(MIN_CHARS))}
        </Text>
      )}
      {listVisible && (
        <View style={styles.dropdownWrap}>
          <View
            style={[
              styles.dropdownCard,
              { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
            ]}
          >
            <ScrollView
              style={styles.dropdownScroll}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {showAnywhere && queryMatchesAnywhere && (
                <TouchableOpacity
                  style={[styles.optionRow, styles.anywhereRow, { borderBottomColor: theme.cardBorder, borderBottomWidth: 1 }]}
                  onPress={handleSelectAnywhere}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionIcon}>
                    <AppIcon name="globe-outline" size={20} color={theme.primary} fallbackText="Anywhere" />
                  </View>
                  <View style={styles.optionTextWrap}>
                    <Text style={[styles.optionTitle, { color: theme.primary }]}>{t('anywhere')}</Text>
                    <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>{t('anywhere_subtitle')}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {query.trim().length >= MIN_CHARS && results.map((item) => {
                const isCity = item.type === 'CITY';
                const isCountry = item.type === 'COUNTRY';
                const code = item.airportCode || item.cityCode || item.countryCode || item.id;
                const cityDisplay = isCountry && item.countryCode
                  ? getCountryDisplayName(getCountryEntry(item.countryCode)!, language)
                  : getCityDisplayName(item, language);
                const nameDisplay = isCountry
                  ? t('all_cities_airports')
                  : isCity
                    ? t('all_airports')
                    : getAirportDisplayName(item, language);
                return (
                  <TouchableOpacity
                    key={`${item.type}-${item.id}-${code}`}
                    style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
                    onPress={() => commitSelection(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionIcon}>
                      <AppIcon
                        name={isCountry ? 'flag-outline' : isCity ? 'location-outline' : 'airplane-outline'}
                        size={20}
                        color={isCountry || isCity ? theme.primary : theme.textMuted}
                        fallbackText={isCountry ? 'Country' : isCity ? 'City' : 'Airport'}
                      />
                    </View>
                    <View style={styles.optionTextWrap}>
                      <Text style={[styles.optionTitle, { color: theme.text }]}>
                        {cityDisplay}{isCountry ? ` (${item.countryCode})` : ` (${code})`}
                      </Text>
                      <Text style={[styles.optionSubtitle, { color: isCity || isCountry ? theme.primary : theme.textMuted }]}>
                        {nameDisplay}{item.countryCode ? ` · ${item.countryCode}` : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowList(false)}>
            <Text style={[styles.closeBtnText, { color: theme.primary }]}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  hint: { fontSize: 13, marginTop: 6 },
  dropdownWrap: { marginTop: 8, zIndex: 1000, elevation: 8 },
  dropdownCard: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    maxHeight: 420,
    overflow: 'hidden',
  },
  dropdownScroll: { maxHeight: 420 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  anywhereRow: { borderBottomWidth: 1 },
  optionIcon: { marginRight: 12 },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: '600' },
  optionSubtitle: { fontSize: 14, marginTop: 2 },
  closeBtn: { marginTop: 8, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start' },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
