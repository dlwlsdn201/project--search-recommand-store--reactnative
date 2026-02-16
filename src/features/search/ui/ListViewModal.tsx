import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSearchStore } from '@shared/stores/useSearchStore';
import { PlaceCard } from './PlaceCard';
import type { Place } from '@entities/place';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.4;

export type ListViewModalProps = {
  onPlacePress: (placeId: string) => void;
};

export function ListViewModal({ onPlacePress }: ListViewModalProps) {
  const { places, viewMode, setViewMode } = useSearchStore();
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const isVisible = viewMode === 'LIST';

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : SHEET_HEIGHT,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [isVisible, translateY]);

  const handleClose = useCallback(() => setViewMode('MAP'), [setViewMode]);

  const renderItem = useCallback(
    ({ item }: { item: Place }) => (
      <PlaceCard place={item} onPress={onPlacePress} />
    ),
    [onPlacePress],
  );

  const keyExtractor = useCallback((item: Place) => item.id, []);

  return (
    <Animated.View
      style={[styles.container, { height: SHEET_HEIGHT, transform: [{ translateY }] }]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <View style={styles.handle}>
        <View style={styles.handleBar} />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>검색 결과 ({places.length})</Text>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  closeText: {
    fontSize: 14,
    color: '#0064e0',
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
