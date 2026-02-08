import { StyleSheet, Text, View } from 'react-native';

export function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>맵 화면 (Kakao Maps WebView 예정)</Text>
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
