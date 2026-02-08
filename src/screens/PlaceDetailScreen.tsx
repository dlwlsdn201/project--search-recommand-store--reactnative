import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../app/navigation/types';

type PlaceDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

export function PlaceDetailScreen({ route }: PlaceDetailScreenProps) {
  const { placeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>장소 상세 (placeId: {placeId})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
  },
});
