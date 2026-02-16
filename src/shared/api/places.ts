import { supabase } from '@shared/lib/supabase';
import type { Place } from '@entities/place';

export type GetNearbyPlacesParams = {
  lat: number;
  lng: number;
  radiusMeter: number;
};

/**
 * Calls the `get_nearby_places` Supabase RPC function.
 * Returns places within the given radius sorted by distance.
 */
export async function getNearbyPlaces(params: GetNearbyPlacesParams): Promise<Place[]> {
  const { data, error } = await supabase.rpc('get_nearby_places', {
    lat: params.lat,
    lng: params.lng,
    radius_meter: params.radiusMeter,
  });

  if (error) throw new Error(error.message);

  return (data as Place[]) ?? [];
}
