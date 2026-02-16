import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import WebView from "react-native-webview";
import { env } from "../../shared/config";
import { getMapHTML } from "./mapHtml";
import type { MapMarkerPayload } from "./types";
import { useMapBridge } from "./useMapBridge";

export type NaverMapProps = {
  /** Naver 지도 중심 좌표 (지도 준비 후 적용) */
  center?: { lat: number; lng: number };
  /** 확대 레벨 1~14 (지도 준비 후 적용) */
  zoomLevel?: number;
  /** 마커 배열 (RN에서 전달 시 지도에 표시) */
  markers?: MapMarkerPayload[];
  /** 지도 준비 완료 콜백 */
  onMapReady?: () => void;
  /** 마커 클릭 콜백 */
  onMarkerClick?: (payload: { id: string; lat: number; lng: number }) => void;
  /** 지도 이동/줌 완료 콜백 */
  onMapMoveEnd?: (payload: { lat: number; lng: number; level: number }) => void;
  /** 지도 빈 영역 클릭 콜백 */
  onMapClick?: (payload: { lat: number; lng: number }) => void;
  /** 추가 스타일 */
  style?: object;
};

export function NaverMap({
  center,
  zoomLevel = 14,
  markers = [],
  onMapReady,
  onMarkerClick,
  onMapMoveEnd,
  onMapClick,
  style,
}: NaverMapProps) {
  const {
    webViewRef,
    isReady,
    handleMessage,
    sendSetCenter,
    sendSetZoom,
    sendSetMarkers,
  } = useMapBridge({
    onMapReady,
    onMarkerClick,
    onMapMoveEnd,
    onMapClick,
  });

  useEffect(() => {
    if (!isReady) return;
    if (center) sendSetCenter(center.lat, center.lng);
  }, [isReady, center?.lat, center?.lng, sendSetCenter]);

  useEffect(() => {
    if (!isReady) return;
    sendSetZoom(zoomLevel);
  }, [isReady, zoomLevel, sendSetZoom]);

  useEffect(() => {
    if (!isReady) return;
    sendSetMarkers(markers);
  }, [isReady, markers, sendSetMarkers]);

  const { width, height: windowHeight } = useWindowDimensions();
  const height = Math.max(300, Math.round(windowHeight) - 120);
  const w = Math.round(width);

  const source = (() => {
    const bridgeUrl = env.NAVER_MAP_BRIDGE_URL;
    const clientId = env.NAVER_MAP_CLIENT_ID;
    if (bridgeUrl && clientId) {
      const q = new URLSearchParams({
        ncpKeyId: clientId,
        width: String(w),
        height: String(height),
      });
      return { uri: bridgeUrl + "?" + q.toString() };
    }
    if (clientId) {
      return { html: getMapHTML(clientId, w, height) };
    }
    return { html: "" };
  })();

  return (
    <View style={[styles.container, style, { width: w, height }]}>
      <WebView
        ref={webViewRef}
        source={source}
        style={[styles.webview, { width: w, height }]}
        onMessage={handleMessage}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled
        originWhitelist={["*"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
});
