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
import { searchAirportsLocal, getCityDisplayName, getAirportDisplayName } from '../../../data/airports';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocale } from '../../../context/LocaleContext';
import type { AirportCityResult } from '../../../types';

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

interface AirportAutocompleteProps {
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export function AirportAutocomplete({
  label,
  value,
  onChange,
  placeholder,
}: AirportAutocompleteProps) {
  const { theme } = useTheme();
  const { language, t } = useLocale();
  const [query, setQuery] = useState(value);
  const [showList, setShowList] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value === '') setQuery('');
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
    }, DEBOUNCE_MS);
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

  const listVisible = query.trim().length >= MIN_CHARS && results.length > 0 && showList;

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
            if (query.trim().length >= MIN_CHARS && results.length > 0) setShowList(true);
          }}
        />
      </View>
      {query.trim().length > 0 && query.trim().length < MIN_CHARS && (
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
              {results.map((item) => {
                const code = item.airportCode || item.cityCode || item.id;
                const cityDisplay = getCityDisplayName(item, language);
                const nameDisplay = getAirportDisplayName(item, language);
                return (
                  <TouchableOpacity
                    key={`${item.id}-${code}`}
                    style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionIcon}>
                      <AppIcon library="ion" name="airplane-outline" size={20} color={theme.textMuted} />
                    </View>
                    <View style={styles.optionTextWrap}>
                      <Text style={[styles.optionTitle, { color: theme.text }]}>
                        {cityDisplay} ({code})
                      </Text>
                      <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>
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
  optionIcon: { marginRight: 12 },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontSize: 17, fontWeight: '600' },
  optionSubtitle: { fontSize: 14, marginTop: 2 },
  closeBtn: { marginTop: 8, paddingVertical: 8, paddingHorizontal: 12, alignSelf: 'flex-start' },
  closeBtnText: { fontSize: 15, fontWeight: '600' },
});
