import { useCallback, useRef, useState } from 'react';
import type { WebViewMessageEvent } from 'react-native-webview';
import type { MapMarkerPayload } from './types';
import { parseMapBridgeMessage } from './types';

export type UseMapBridgeCallbacks = {
  onMapReady?: () => void;
  onMarkerClick?: (payload: { id: string; lat: number; lng: number }) => void;
  onMapMoveEnd?: (payload: { lat: number; lng: number; level: number }) => void;
  onMapClick?: (payload: { lat: number; lng: number }) => void;
};

export type WebViewInjectRef = {
  injectJavaScript: (script: string) => void;
};

/**
 * RN ↔ WebView 양방향 통신(postMessage)을 관리하는 훅.
 * - RN → WebView: injectJavaScript로 __NaverMapBridge 메서드 호출
 * - WebView → RN: window.ReactNativeWebView.postMessage(JSON) 후 onMessage에서 파싱
 */
export function useMapBridge(callbacks: UseMapBridgeCallbacks = {}) {
  const [isReady, setIsReady] = useState(false);
  const webViewRef = useRef<WebViewInjectRef | null>(null);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const msg = parseMapBridgeMessage(event.nativeEvent.data);
      if (!msg) return;

      switch (msg.type) {
        case 'MAP_READY':
          setIsReady(true);
          callbacks.onMapReady?.();
          break;
        case 'MARKER_CLICK':
          callbacks.onMarkerClick?.(msg.payload);
          break;
        case 'MAP_MOVE_END':
          callbacks.onMapMoveEnd?.(msg.payload);
          break;
        case 'MAP_CLICK':
          callbacks.onMapClick?.(msg.payload);
          break;
      }
    },
    [callbacks.onMapReady, callbacks.onMarkerClick, callbacks.onMapMoveEnd, callbacks.onMapClick]
  );

  const sendSetCenter = useCallback((lat: number, lng: number) => {
    const script = `(function(){
      if (window.__NaverMapBridge && window.__NaverMapBridge.setCenter) {
        window.__NaverMapBridge.setCenter(${lat}, ${lng});
      }
    })(); true;`;
    webViewRef.current?.injectJavaScript(script);
  }, []);

  const sendSetZoom = useCallback((level: number) => {
    const script = `(function(){
      if (window.__NaverMapBridge && window.__NaverMapBridge.setZoom) {
        window.__NaverMapBridge.setZoom(${level});
      }
    })(); true;`;
    webViewRef.current?.injectJavaScript(script);
  }, []);

  const sendSetMarkers = useCallback((markers: MapMarkerPayload[]) => {
    const escaped = JSON.stringify(markers).replace(/</g, '\\u003c');
    const script = `(function(){
      if (window.__NaverMapBridge && window.__NaverMapBridge.setMarkers) {
        window.__NaverMapBridge.setMarkers(${escaped});
      }
    })(); true;`;
    webViewRef.current?.injectJavaScript(script);
  }, []);

  return {
    webViewRef,
    isReady,
    handleMessage,
    sendSetCenter,
    sendSetZoom,
    sendSetMarkers,
  };
}
