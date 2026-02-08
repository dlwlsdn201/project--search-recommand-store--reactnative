import { useCallback, useState } from 'react';
import { geocodeAddress } from '../../shared/api/geocode';

export type AddressSearchResult = {
  lat: number;
  lng: number;
  displayName: string;
};

export function useAddressSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string): Promise<AddressSearchResult | null> => {
    setError(null);
    if (!query.trim()) return null;
    setIsLoading(true);
    try {
      const result = await geocodeAddress(query);
      if (!result) {
        setError('검색 결과가 없습니다.');
        return null;
      }
      return { lat: result.lat, lng: result.lng, displayName: result.displayName };
    } catch (e) {
      setError('검색 중 오류가 났습니다.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { search, isLoading, error };
}
