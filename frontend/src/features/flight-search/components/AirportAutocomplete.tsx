import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AppIcon } from '../../../components/AppIcon';
import { searchAirportsLocal, getCityDisplayName, getAirportDisplayName, getAirportEntry } from '../../../data/airports';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import { ANYWHERE_CODE } from '../../../types';
import type { AirportCityResult } from '../../../types';

import { useRuntimeConfig } from '../../../context/RuntimeConfigContext';

const MIN_CHARS = 2;

interface AirportAutocompleteProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  /** When true, shows an "Anywhere" option pinned at the top of the dropdown. Use on destination fields only. */
  showAnywhere?: boolean;
}

export function AirportAutocomplete({
  label,
  value,
  onChange,
  placeholder,
  showAnywhere = false,
}: AirportAutocompleteProps) {
  const { theme } = useTheme();
  const { language, t } = useLocale();
  const runtimeConfig = useRuntimeConfig();
  const [query, setQuery] = useState(value);
  const [showList, setShowList] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-sync only when the stored IATA/city code changes — not when `t`/language changes, or we
  // overwrite the user's in-progress typing while value is still ANYWHERE.
  useEffect(() => {
    if (value === '') {
      setQuery('');
      return;
    }
    if (value === ANYWHERE_CODE) {
      setQuery(t('anywhere'));
      return;
    }
    const entry = getAirportEntry(value);
    if (entry) {
      const code = (entry.airportCode || entry.cityCode || entry.id).toUpperCase();
      const cityDisplay = getCityDisplayName(entry, language);
      setQuery(`${cityDisplay} (${code})`);
    } else {
      setQuery(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only when `value` changes
  }, [value]);

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < MIN_CHARS) return [];
    return searchAirportsLocal(q, 15, language);
  }, [query, language]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
    }, runtimeConfig.airportAutocompleteDebounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (item: AirportCityResult) => {
    const code = (item.airportCode || item.cityCode || item.id).toUpperCase();
    onChange(code);
    const cityDisplay = getCityDisplayName(item, language);
    setQuery(`${cityDisplay} (${code})`);
    setShowList(false);
  };

  const handleSelectAnywhere = () => {
    onChange(ANYWHERE_CODE);
    setQuery(t('anywhere'));
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
      <View style={styles.inputWrap}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.text,
            },
          ]}
          placeholder={placeholder ?? t('city_or_airport')}
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setShowList(true);
          }}
          onFocus={() => {
            setShowList(true);
          }}
        />
      </View>
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
              {/* Anywhere option pinned at top */}
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
                    <Text style={[styles.optionTitle, { color: theme.primary }]}>
                      {t('anywhere')}
                    </Text>
                    <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>
                      {t('anywhere_subtitle')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Regular airport/city results */}
              {query.trim().length >= MIN_CHARS && results.map((item) => {
                const isCity = item.type === 'CITY';
                const code = item.airportCode || item.cityCode || item.id;
                const cityDisplay = getCityDisplayName(item, language);
                const nameDisplay = isCity ? t('all_airports') : getAirportDisplayName(item, language);
                return (
                  <TouchableOpacity
                    key={`${item.id}-${code}`}
                    style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionIcon}>
                      <AppIcon
                        name={isCity ? 'location-outline' : 'airplane-outline'}
                        size={20}
                        color={isCity ? theme.primary : theme.textMuted}
                        fallbackText={isCity ? 'City' : 'Airport'}
                      />
                    </View>
                    <View style={styles.optionTextWrap}>
                      <Text style={[styles.optionTitle, { color: theme.text }]}>
                        {cityDisplay} ({code}){isCity ? '' : ''}
                      </Text>
                      <Text style={[styles.optionSubtitle, { color: isCity ? theme.primary : theme.textMuted }]}>
                        {nameDisplay} · {item.countryCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowList(false)}
          >
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
  inputWrap: { position: 'relative' },
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
    maxHeight: 320,
    overflow: 'hidden',
  },
  dropdownScroll: { maxHeight: 320 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  anywhereRow: {
    borderBottomWidth: 1,
  },
  optionIcon: { marginRight: 12 },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: '600' },
  optionSubtitle: { fontSize: 14, marginTop: 2 },
  closeBtn: { marginTop: 8, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start' },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
