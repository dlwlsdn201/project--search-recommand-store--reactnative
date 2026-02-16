import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSearchStore } from '@shared/stores/useSearchStore';

export type SearchBarProps = {
  paddingTop?: number;
  /** 키워드 제출 시 호출 (지오코딩 → 지도 이동) */
  onSubmit?: (keyword: string) => void;
};

export function SearchBar({ paddingTop = 8, onSubmit }: SearchBarProps) {
  const { keyword, setKeyword, viewMode, toggleViewMode, isSearching } =
    useSearchStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    setError(null);
    if (!keyword.trim()) return;
    onSubmit?.(keyword);
  }, [keyword, onSubmit]);

  const handleClear = useCallback(() => {
    setKeyword('');
    setError(null);
  }, [setKeyword]);

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="주소 또는 장소 검색"
          placeholderTextColor="#999"
          value={keyword}
          onChangeText={setKeyword}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          editable={!isSearching}
          autoCorrect={false}
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
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity onPress={toggleViewMode} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {viewMode === 'MAP' ? '목록 보기' : '지도 보기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
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
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    fontSize: 16,
    color: '#111',
  },
  trailing: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0064e0',
    borderRadius: 6,
  },
  toggleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#c00',
  },
});
