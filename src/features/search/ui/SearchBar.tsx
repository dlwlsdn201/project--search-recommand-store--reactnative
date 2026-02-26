import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSearchStore } from '@shared/stores/useSearchStore';
import { fetchAddressSuggestions } from '@shared/api/geocode';
import type { AddressSuggestion } from '@shared/api/geocode';
import { useDebounce } from '@shared/hooks';

export type SearchBarProps = {
  paddingTop?: number;
  onSubmit?: (keyword: string) => void;
};

export function SearchBar({ paddingTop = 8, onSubmit }: SearchBarProps) {
  const { keyword, setKeyword, isSearching } = useSearchStore();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  // innerContent (paddingTop + row + paddingBottom) 의 실측 높이
  const [contentHeight, setContentHeight] = useState(0);

  const debouncedKeyword = useDebounce(keyword, 100);
  const abortRef = useRef<AbortController | null>(null);

  // 100 ms debounce 후 자동완성 API 호출
  useEffect(() => {
    if (debouncedKeyword.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    // 이전 요청 취소
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetchAddressSuggestions(debouncedKeyword).then((results) => {
      if (!controller.signal.aborted) setSuggestions(results);
    });

    return () => controller.abort();
  }, [debouncedKeyword]);

  const handleSubmit = useCallback(() => {
    if (!keyword.trim()) return;
    setSuggestions([]);
    setShowDropdown(false);
    onSubmit?.(keyword);
  }, [keyword, onSubmit]);

  const handleClear = useCallback(() => {
    setKeyword('');
    setSuggestions([]);
    setShowDropdown(false);
  }, [setKeyword]);

  const handleFocus = useCallback(() => setShowDropdown(true), []);

  // blur → 150 ms 딜레이로 항목 터치가 먼저 처리되도록
  const handleBlur = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 150);
  }, []);

  const handleSuggestionPress = useCallback(
    (suggestion: AddressSuggestion) => {
      setKeyword(suggestion.displayName);
      setSuggestions([]);
      setShowDropdown(false);
      onSubmit?.(suggestion.displayName);
    },
    [setKeyword, onSubmit],
  );

  const dropdownVisible = showDropdown && suggestions.length > 0;

  return (
    // outerWrapper: zIndex 스태킹 컨텍스트. overflow: visible 로 드롭다운이
    // 아래 컴포넌트(RadiusSlider, 지도) 위에 overlay 됨.
    <View style={styles.outerWrapper}>
      {/* innerContent: 실제 SearchBar 영역. 높이를 측정해 드롭다운 top 계산에 사용 */}
      <View
        style={[styles.innerContent, { paddingTop }]}
        onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="주소 또는 장소 검색"
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!isSearching}
            autoCorrect={false}
            autoComplete="off"
          />
          {isSearching && (
            <ActivityIndicator style={styles.trailing} size="small" color="#666" />
          )}
          {keyword.length > 0 && !isSearching && (
            <TouchableOpacity onPress={handleClear} style={styles.trailing}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 자동완성 드롭다운: innerContent 바로 아래에 absolute overlay */}
      {dropdownVisible && (
        <View style={[styles.dropdown, { top: contentHeight }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.placeId}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(suggestion)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {suggestion.displayName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    zIndex: 999,
    elevation: 10,
    // overflow: 'visible' 로 드롭다운이 부모 bounds 밖으로 나올 수 있게 함
    overflow: 'visible',
  },
  innerContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    paddingRight: 40, // trailing 버튼과 겹치지 않도록
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    fontSize: 16,
    color: '#111',
  },
  trailing: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 1000,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8e8',
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#222',
    lineHeight: 20,
  },
});
