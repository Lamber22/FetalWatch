import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../components/constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  filters?: { key: string; label: string; icon?: string }[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  showHints?: boolean;
  hintText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  suggestions = [],
  onSuggestionPress,
  filters = [],
  activeFilter,
  onFilterChange,
  showHints = true,
  hintText = "💡 Try searching by: name, contact, or ID",
  disabled = false,
  autoFocus = false,
  onFocus,
  onBlur,
  onClear,
  debounceMs = 300,
}) => {
  const { colors } = useTheme();
  const searchInputRef = useRef<TextInput>(null);
  const searchAnimValue = useRef(new Animated.Value(0)).current;
  const debounceTimeout = useRef<number | null>(null);
  
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<string>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    // Debounced search
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      onChangeText(internalValue);
    }, debounceMs);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [internalValue, onChangeText, debounceMs]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    onFocus?.();
    Animated.timing(searchAnimValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    onBlur?.();
    Animated.timing(searchAnimValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const clearSearch = () => {
    setInternalValue('');
    onChangeText('');
    onClear?.();
    searchInputRef.current?.blur();
    Keyboard.dismiss();
  };

  const applySuggestion = (suggestion: string) => {
    setInternalValue(suggestion);
    onChangeText(suggestion);
    onSuggestionPress?.(suggestion);
    searchInputRef.current?.blur();
  };

  const handleFilterPress = (filterKey: string) => {
    onFilterChange?.(filterKey);
  };

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      {filters.length > 0 && (
        <View style={styles.filtersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: activeFilter === filter.key ? colors.primary : colors.white,
                    borderColor: activeFilter === filter.key ? colors.primary : colors.lightGray,
                  }
                ]}
                onPress={() => handleFilterPress(filter.key)}
                activeOpacity={0.8}
              >
                {filter.icon && (
                  <Ionicons
                    name={filter.icon as any}
                    size={16}
                    color={activeFilter === filter.key ? colors.white : colors.primary}
                    style={styles.filterIcon}
                  />
                )}
                <Text style={[
                  styles.filterButtonText,
                  { color: activeFilter === filter.key ? colors.white : colors.primary }
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Enhanced Search Bar */}
      <Animated.View style={[
        styles.searchContainer,
        {
          borderColor: searchAnimValue.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.lightGray, colors.primary]
          }),
          backgroundColor: colors.white,
          opacity: disabled ? 0.6 : 1,
          ...SHADOWS.light
        }
      ]}>
        <View style={[
          styles.searchInputContainer,
          {
            backgroundColor: colors.white,
            borderRadius: SIZES.radius,
          }
        ]}>
          <Animated.View style={[
            styles.searchIconContainer,
            {
              transform: [{
                scale: searchAnimValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1]
                })
              }]
            }
          ]}>
            <Ionicons
              name="search"
              size={20}
              color={isSearchFocused ? colors.primary : colors.gray}
            />
          </Animated.View>

          <TextInput
            ref={searchInputRef}
            style={[
              styles.searchInput,
              {
                color: colors.text,
                backgroundColor: 'transparent',
                borderWidth: 0,
              }
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.gray}
            value={internalValue}
            onChangeText={setInternalValue}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
            returnKeyType="search"
            onSubmitEditing={() => searchInputRef.current?.blur()}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            editable={!disabled}
            autoFocus={autoFocus}
          />

          {internalValue.length > 0 && (
            <Animated.View style={[
              styles.clearButtonContainer,
              {
                opacity: searchAnimValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1]
                })
              }
            ]}>
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: colors.lightGray }]}
                onPress={clearSearch}
                activeOpacity={0.7}
                disabled={disabled}
              >
                <Ionicons name="close" size={16} color={colors.gray} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Search hints */}
        {showHints && isSearchFocused && internalValue.length === 0 && (
          <View style={styles.searchHints}>
            <Text style={[styles.searchHintText, { color: colors.gray }]}>
              {hintText}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Search Suggestions */}
      {suggestions.length > 0 && isSearchFocused && (
        <Animated.View style={[
          styles.suggestionsContainer,
          { backgroundColor: colors.white, ...SHADOWS.light }
        ]}>
          <Text style={[styles.suggestionsTitle, { color: colors.gray }]}>Suggestions:</Text>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.suggestionItem, { borderBottomColor: colors.lightGray }]}
              onPress={() => applySuggestion(suggestion)}
              activeOpacity={0.7}
            >
              <Ionicons name="person" size={16} color={colors.gray} />
              <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
              <Ionicons name="arrow-up-outline" size={16} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  filtersContainer: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.base,
  },
  filtersContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    ...SHADOWS.light,
  },
  filterIcon: {
    marginRight: SIZES.base / 2,
  },
  filterButtonText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  searchContainer: {
    margin: SIZES.padding,
    borderRadius: SIZES.radius * 1.5,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base + 2,
    minHeight: 48,
  },
  searchIconContainer: {
    marginRight: SIZES.base,
    padding: SIZES.base / 2,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.font,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base / 2,
    borderRadius: SIZES.radius / 2,
    minHeight: 32,
  },
  clearButtonContainer: {
    marginLeft: SIZES.base,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchHints: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  searchHintText: {
    fontSize: SIZES.small,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginHorizontal: SIZES.padding,
    marginTop: -SIZES.base,
    borderRadius: SIZES.radius,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
    zIndex: 1000,
  },
  suggestionsTitle: {
    fontSize: SIZES.small,
    fontWeight: '600',
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.base,
    paddingBottom: SIZES.base / 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
  },
  suggestionText: {
    flex: 1,
    fontSize: SIZES.font,
    marginLeft: SIZES.base,
  },
});
