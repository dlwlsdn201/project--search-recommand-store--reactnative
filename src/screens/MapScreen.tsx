import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KakaoMap } from '../features/map/KakaoMap';
import type { MapMarkerPayload } from '../features/map/types';
import type { RootStackParamList } from '../app/navigation/types';
import { useMapStore } from '../shared/stores/useMapStore';
import { useAddressSearch } from '../features/search/useAddressSearch';

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Map'>;

const SAMPLE_MARKERS: MapMarkerPayload[] = [
  { id: '1', lat: 37.5665, lng: 126.978, title: '서울시청' },
  { id: '2', lat: 37.5705, lng: 126.985, title: '광화문' },
];

export function MapScreen() {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { center, zoomLevel, setCenter, setZoomLevel } = useMapStore();
  const { search, isLoading, error } = useAddressSearch();
  const [addressQuery, setAddressQuery] = useState('');
  const [markers, setMarkers] = useState<MapMarkerPayload[]>(SAMPLE_MARKERS);

  const handleAddressSubmit = useCallback(async () => {
    const result = await search(addressQuery);
    if (!result) return;
    setCenter({ lat: result.lat, lng: result.lng });
    setZoomLevel(15);
    setMarkers([
      { id: 'search', lat: result.lat, lng: result.lng, title: result.displayName },
    ]);
  }, [addressQuery, search, setCenter, setZoomLevel]);

  const handleMarkerClick = useCallback(
    (payload: { id: string }) => {
      navigation.navigate('PlaceDetail', { placeId: payload.id });
    },
    [navigation]
  );

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

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="주소 또는 장소 검색"
            placeholderTextColor="#999"
            value={addressQuery}
            onChangeText={setAddressQuery}
            returnKeyType="search"
            onSubmitEditing={handleAddressSubmit}
            editable={!isLoading}
          />
          {isLoading && (
            <ActivityIndicator style={styles.loader} size="small" color="#666" />
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <KakaoMap
        center={center}
        zoomLevel={zoomLevel}
        markers={markers}
        onMarkerClick={handleMarkerClick}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    fontSize: 16,
    color: '#111',
  },
  loader: {
    position: 'absolute',
    right: 16,
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#c00',
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
