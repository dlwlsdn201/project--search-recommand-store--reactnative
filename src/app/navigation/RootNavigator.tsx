import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { HomeScreen } from '../../screens/HomeScreen';
import { MapScreen } from '../../screens/MapScreen';
import { PlaceDetailScreen } from '../../screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SpotFinder' }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ title: '지도' }} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ title: '장소 상세' }} />
    </Stack.Navigator>
  );
}
