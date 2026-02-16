import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NaverMap } from '../features/map/NaverMap';
import type { MapMarkerPayload } from '../features/map/types';
import type { RootStackParamList } from '../app/navigation/types';
import { useMapStore } from '../shared/stores/useMapStore';
import { useSearchStore } from '../shared/stores/useSearchStore';
import { env } from '../shared/config';
import { geocodeAddress } from '../shared/api/geocode';
import {
  SearchBar,
  RadiusSlider,
  ListViewModal,
  usePlaceSearch,
} from '../features/search';
import type { Place } from '../entities/place';

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Map'>;

const SEARCH_PIN_ID = '__search_location__';

function placesToMarkers(places: Place[]): MapMarkerPayload[] {
  return places.map((p) => ({
    id: p.id,
    lat: p.latitude,
    lng: p.longitude,
    title: p.name,
  }));
}

export function MapScreen() {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { center, zoomLevel, setCenter, setZoomLevel } = useMapStore();
  const { places, reset, setIsSearching } = useSearchStore();
  const [searchPin, setSearchPin] = useState<MapMarkerPayload | null>(null);

  usePlaceSearch();

  useEffect(() => {
    return () => reset();
  }, [reset]);

  /** 키워드를 지오코딩하여 지도 센터를 이동 → usePlaceSearch가 RPC 자동 호출 */
  const handleSearchSubmit = useCallback(
    async (keyword: string) => {
      setIsSearching(true);
      const result = await geocodeAddress(keyword);
      setIsSearching(false);
      if (!result) return;
      setCenter({ lat: result.lat, lng: result.lng });
      setZoomLevel(15);
      setSearchPin({
        id: SEARCH_PIN_ID,
        lat: result.lat,
        lng: result.lng,
        title: result.displayName,
      });
    },
    [setCenter, setZoomLevel, setIsSearching],
  );

  const handleMarkerClick = useCallback(
    (payload: { id: string }) => {
      if (payload.id === SEARCH_PIN_ID) return;
      navigation.navigate('PlaceDetail', { placeId: payload.id });
    },
    [navigation],
  );

  const handlePlacePress = useCallback(
    (placeId: string) => {
      navigation.navigate('PlaceDetail', { placeId });
    },
    [navigation],
  );

  const markers = useMemo(() => {
    const placeMarkers = placesToMarkers(places);
    return searchPin ? [searchPin, ...placeMarkers] : placeMarkers;
  }, [places, searchPin]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          지도는 iOS·Android(Expo Go)에서만 이용할 수 있습니다.
        </Text>
        <Text style={styles.hint}>터미널에서 i 또는 a 키로 시뮬레이터/기기 실행</Text>
      </View>
    );
  }

  const naverClientId = env.NAVER_MAP_CLIENT_ID;

  if (!naverClientId) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          .env에 EXPO_PUBLIC_NAVER_MAP_CLIENT_ID를 설정해 주세요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar paddingTop={Math.max(insets.top, 8)} onSubmit={handleSearchSubmit} />
      <RadiusSlider />
      <NaverMap
        center={center}
        zoomLevel={zoomLevel}
        markers={markers}
        onMarkerClick={handleMarkerClick}
      />
      <ListViewModal onPlacePress={handlePlacePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  hint: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
});
