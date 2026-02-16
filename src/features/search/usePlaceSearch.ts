import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNearbyPlaces } from '@shared/api/places';
import { useSearchStore } from '@shared/stores/useSearchStore';
import { useMapStore } from '@shared/stores/useMapStore';
import { useDebounce } from '@shared/hooks';

/**
 * Orchestrates place search using current map center and radius.
 * Debounces radius changes before firing queries.
 * Syncs results into useSearchStore.
 */
export function usePlaceSearch() {
  const { center } = useMapStore();
  const { radius, setPlaces, setIsSearching } = useSearchStore();

  const debouncedRadius = useDebounce(radius, 300);

  const query = useQuery({
    queryKey: ['nearby-places', center.lat, center.lng, debouncedRadius],
    queryFn: () =>
      getNearbyPlaces({
        lat: center.lat,
        lng: center.lng,
        radiusMeter: debouncedRadius,
      }),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) setPlaces(query.data);
  }, [query.data, setPlaces]);

  useEffect(() => {
    setIsSearching(query.isFetching);
  }, [query.isFetching, setIsSearching]);

  return query;
}
