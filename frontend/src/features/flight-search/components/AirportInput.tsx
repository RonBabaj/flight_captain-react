import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchAirportsLocal } from '../../../data/airports';
import { useTheme } from '../../../theme/ThemeContext';
import type { AirportCityResult } from '../../../types';

interface Props {
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export function AirportInput({ label, value, onChange, placeholder }: Props) {
  const { theme } = useTheme();
  const [query, setQuery] = useState(value);
  const [showList, setShowList] = useState(false);

  // Only clear the input when parent clears
  useEffect(() => {
    if (value === '') setQuery('');
  }, [value]);

  // Local dictionary search – no API call; only airport codes go to backend
  const results = useMemo(
    () => (query.trim() ? searchAirportsLocal(query, 15) : []),
    [query]
  );

  // Show list as soon as there are matches
  useEffect(() => {
    if (results.length > 0) setShowList(true);
    else setShowList(false);
  }, [results.length]);

  const handleSelect = (item: AirportCityResult) => {
    const code = (item.airportCode || item.cityCode || item.id).toUpperCase();
    onChange(code); // backend/Amadeus only ever gets codes (TLV, NAP, etc.)
    setQuery(`${item.cityName || item.name} (${code})`);
    setShowList(false);
  };

  const openPopup = () => {
    if (results.length > 0) setShowList(true);
  };

  const hasResults = results.length > 0;
  const listVisible = hasResults && showList;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
          placeholder={placeholder}
          value={query}
          onChangeText={text => setQuery(text)}
          placeholderTextColor={theme.textMuted}
          onFocus={openPopup}
        />
      </View>

      {listVisible && (
        <View style={styles.inlineListWrap}>
          <View style={[styles.dropdownCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <ScrollView
              style={styles.dropdownScroll}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {results.map(item => {
                const code = item.airportCode || item.cityCode || item.id;
                return (
                  <TouchableOpacity
                    key={`${item.id}-${code}`}
                    style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="airplane-outline" size={18} color={theme.textMuted} style={styles.optionIcon} />
                    <View style={styles.optionTextWrap}>
                      <Text style={[styles.optionTitle, { color: theme.text }]}>
                        {item.cityName || item.name} ({code})
                      </Text>
                      <Text style={[styles.optionSubtitle, { color: theme.textMuted }]}>
                        {item.name} | {item.countryCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={styles.closeListBtn}
            onPress={() => setShowList(false)}
          >
            <Text style={[styles.closeListBtnText, { color: theme.primary }]}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  inputWrap: { position: 'relative' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 20,
  },
  inlineListWrap: {
    marginTop: 6,
    zIndex: 1000,
    elevation: 8,
  },
  dropdownCard: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    maxHeight: 360,
    overflow: 'hidden',
  },
  dropdownScroll: { maxHeight: 360 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  optionIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  optionTextWrap: { flex: 1 },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  closeListBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  closeListBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
