import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSearchStore } from '@shared/stores/useSearchStore';
import { PlaceCard } from './PlaceCard';
import type { Place } from '@entities/place';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 시트 높이 상수
const HANDLE_HEIGHT = 24; // 핸들 영역 (패딩 포함)
const HEADER_HEIGHT = 50; // 헤더 영역
const CARD_HEIGHT = 92;   // PlaceCard 1개 높이 (paddingVertical*2 + image)
const COLLAPSED_HEIGHT = HANDLE_HEIGHT + HEADER_HEIGHT + CARD_HEIGHT * 2;
const EXPANDED_HEIGHT = Math.round(SCREEN_HEIGHT * 0.65);

// translateY 좌표계 (position: absolute, bottom: 0, height: EXPANDED_HEIGHT 기준)
//   0                         → 완전 펼침 (expanded)
//   EXPANDED_HEIGHT - COLLAPSED_HEIGHT → 2개만 보임 (collapsed)
//   EXPANDED_HEIGHT           → 화면 밖 (hidden)
const Y_EXPANDED = 0;
const Y_COLLAPSED = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;
const Y_HIDDEN = EXPANDED_HEIGHT;

export type ListViewModalProps = {
  onPlacePress: (placeId: string) => void;
};

export function ListViewModal({ onPlacePress }: ListViewModalProps) {
  const { places } = useSearchStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const translateY = useRef(new Animated.Value(Y_HIDDEN)).current;
  // 마지막으로 정착한 Y값 (제스처 계산에 사용)
  const baseY = useRef(Y_HIDDEN);

  const animateTo = useCallback(
    (toValue: number) => {
      baseY.current = toValue;
      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    },
    [translateY],
  );

  // places 유무에 따라 표시/숨김 전환
  const hasPlaces = places.length > 0;
  useEffect(() => {
    if (hasPlaces) {
      setIsExpanded(false);
      animateTo(Y_COLLAPSED);
    } else {
      animateTo(Y_HIDDEN);
    }
  }, [hasPlaces, animateTo]);

  // handle/header 드래그로 시트 확장·축소
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dy) > 8 && Math.abs(gs.dy) > Math.abs(gs.dx),

      onPanResponderMove: (_, gs) => {
        const next = Math.max(Y_EXPANDED, Math.min(Y_HIDDEN, baseY.current + gs.dy));
        translateY.setValue(next);
      },

      onPanResponderRelease: (_, gs) => {
        const velocity = gs.vy;
        const moved = gs.dy;

        // 위로 빠르게 flick하거나 절반 이상 위로 드래그 → expand
        if (velocity < -0.5 || moved < -(Y_COLLAPSED - Y_EXPANDED) / 2) {
          setIsExpanded(true);
          animateTo(Y_EXPANDED);
        } else {
          // 아래로 드래그 → collapse
          setIsExpanded(false);
          animateTo(Y_COLLAPSED);
        }
      },
    }),
  ).current;

  const renderItem = useCallback(
    ({ item }: { item: Place }) => <PlaceCard place={item} onPress={onPlacePress} />,
    [onPlacePress],
  );

  const keyExtractor = useCallback((item: Place) => item.id, []);

  return (
    <Animated.View
      style={[styles.container, { height: EXPANDED_HEIGHT, transform: [{ translateY }] }]}
      pointerEvents={hasPlaces ? 'auto' : 'none'}
    >
      {/* 드래그 핸들 */}
      <View style={styles.handle} {...panResponder.panHandlers}>
        <View style={styles.handleBar} />
      </View>

      {/* 헤더 (드래그 가능) */}
      <View style={styles.header} {...panResponder.panHandlers}>
        <Text style={styles.headerTitle}>검색 결과 ({places.length})</Text>
        <Text style={styles.expandHint}>{isExpanded ? '▼ 접기' : '▲ 더 보기'}</Text>
      </View>

      {/* 목록 */}
      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isExpanded}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
    overflow: 'hidden',
  },
  handle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  expandHint: {
    fontSize: 13,
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
