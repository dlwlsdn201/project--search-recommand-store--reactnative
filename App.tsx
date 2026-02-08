import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AppProviders } from './src/app/providers';
import { RootNavigator } from './src/app/navigation/RootNavigator';

export default function App() {
  return (
    <AppProviders>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AppProviders>
  );
}
