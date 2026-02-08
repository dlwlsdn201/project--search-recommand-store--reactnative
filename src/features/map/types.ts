/**
 * 마커 데이터 (RN → WebView 전달)
 */
export type MapMarkerPayload = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
};

/**
 * WebView → RN 이벤트 타입
 */
export type MapBridgeEventType =
  | 'MAP_READY'
  | 'MARKER_CLICK'
  | 'MAP_MOVE_END'
  | 'MAP_CLICK';

/**
 * WebView에서 RN으로 보내는 메시지
 */
export type MapBridgeMessage =
  | { type: 'MAP_READY' }
  | { type: 'MARKER_CLICK'; payload: { id: string; lat: number; lng: number } }
  | { type: 'MAP_MOVE_END'; payload: { lat: number; lng: number; level: number } }
  | { type: 'MAP_CLICK'; payload: { lat: number; lng: number } };

export function parseMapBridgeMessage(data: string): MapBridgeMessage | null {
  try {
    const parsed = JSON.parse(data) as MapBridgeMessage;
    if (parsed?.type) return parsed;
    return null;
  } catch {
    return null;
  }
}
