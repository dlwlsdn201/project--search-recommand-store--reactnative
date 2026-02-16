import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSearchStore } from '@shared/stores/useSearchStore';

const MIN_RADIUS = 100;
const MAX_RADIUS = 1000;
const STEP = 50;

export function RadiusSlider() {
  const { radius, setRadius } = useSearchStore();

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>반경</Text>
        <Text style={styles.value}>{radius}m</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={MIN_RADIUS}
        maximumValue={MAX_RADIUS}
        step={STEP}
        value={radius}
        onValueChange={setRadius}
        minimumTrackTintColor="#0064e0"
        maximumTrackTintColor="#e0e0e0"
        thumbTintColor="#0064e0"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#0064e0',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 32,
  },
});
