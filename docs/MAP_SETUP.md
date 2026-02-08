# 지도 WebView 연동 (Leaflet + OpenStreetMap)

## 1. 사용 중인 지도

- **Leaflet** + **OpenStreetMap** 타일
- **API 키·사업자 심사 없음**, 무료 사용
- `src/features/map/mapHtml.ts`의 `getMapHTML(width?, height?)`가 HTML 문자열을 생성하고, WebView에서 로드

### 1-1. 타일 출처

- OSM 타일: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- [OpenStreetMap 이용 약관](https://www.openstreetmap.org/copyright) 준수 ( attribution 표기 포함 )

---

## 2. WebView ↔ RN 브릿지 규약

### 2-1. HTML 측 (지도 페이지)

- 전역 객체: `window.__KakaoMapBridge` (기존 브릿지 이름 유지)
- 메서드:
  - `setCenter(lat, lng)` — 지도 중심 이동
  - `setZoom(level)` — 확대 레벨 (Leaflet 0~18, 앱에서는 1~14 사용)
  - `setMarkers(list)` — 마커 배열. 각 항목: `{ id, lat, lng, title? }`

### 2-2. WebView → RN 이벤트

`window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload? }))` 로 전송:

| type         | payload | 설명             |
|-------------|---------|------------------|
| `MAP_READY` | 없음    | 지도 초기화 완료 |
| `MARKER_CLICK` | `{ id, lat, lng }` | 마커 클릭 |
| `MAP_MOVE_END` | `{ lat, lng, level }` | 지도 이동/줌 완료 |
| `MAP_CLICK` | `{ lat, lng }` | 지도 빈 영역 클릭 |

### 2-3. RN → WebView

`injectJavaScript`로 `window.__KakaoMapBridge.setCenter(...)` 등 호출 ( `useMapBridge` 훅에서 처리 ).

---

## 3. 참고

- [Leaflet](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
