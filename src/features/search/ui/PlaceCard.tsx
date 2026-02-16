import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Place } from '@entities/place';

export type PlaceCardProps = {
  place: Place;
  onPress: (placeId: string) => void;
};

function formatDistance(meter: number): string {
  return meter < 1000
    ? `${Math.round(meter)}m`
    : `${(meter / 1000).toFixed(1)}km`;
}

export function PlaceCard({ place, onPress }: PlaceCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(place.id)}
      activeOpacity={0.7}
    >
      {place.image_url ? (
        <Image source={{ uri: place.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        {place.category && <Text style={styles.category}>{place.category}</Text>}
        <View style={styles.metaRow}>
          <Text style={styles.rating}>{'\u2605'} {place.rating.toFixed(1)}</Text>
          <Text style={styles.distance}>{formatDistance(place.distance_meter)}</Text>
        </View>
        {place.address && (
          <Text style={styles.address} numberOfLines={1}>
            {place.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: '#999',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 2,
  },
  rating: {
    fontSize: 13,
    color: '#f5a623',
    fontWeight: '600',
  },
  distance: {
    fontSize: 13,
    color: '#666',
  },
  address: {
    fontSize: 12,
    color: '#999',
  },
});
