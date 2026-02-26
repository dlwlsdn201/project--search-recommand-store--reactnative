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

export type AddressSuggestion = {
  placeId: number;
  displayName: string;
  lat: number;
  lng: number;
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

/** 주소 자동완성 – 입력값 기반 후보 최대 5건 반환 */
export async function fetchAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    q: trimmed,
    format: 'json',
    limit: '5',
    countrycodes: 'kr',
  });

  try {
    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: { Accept: 'application/json', 'Accept-Language': 'ko' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as NominatimResult[];
    if (!Array.isArray(data)) return [];
    return data
      .map((item) => ({
        placeId: item.place_id,
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }))
      .filter((item) => !Number.isNaN(item.lat) && !Number.isNaN(item.lng));
  } catch {
    return [];
  }
}
