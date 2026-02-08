/**
 * OpenStreetMap Nominatim 지오코딩 (주소 → 위경도)
 * 무료, API 키 불필요. 사용 정책: https://operations.osmfoundation.org/policies/nominatim/
 */

export type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
};

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const params = new URLSearchParams({
    q: trimmed,
    format: 'json',
    limit: '1',
  });
  const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    // Nominatim 요청은 1초 이상 간격 권장
  });

  if (!res.ok) return null;
  const data = (await res.json()) as NominatimResult[];
  if (!Array.isArray(data) || data.length === 0) return null;

  const first = data[0];
  const lat = parseFloat(first.lat);
  const lng = parseFloat(first.lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return {
    lat,
    lng,
    displayName: first.display_name ?? trimmed,
  };
}
