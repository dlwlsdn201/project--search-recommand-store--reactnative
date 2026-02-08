/**
 * WebView에 로드할 지도 HTML (Leaflet + OpenStreetMap).
 * API 키·사업자 심사 없이 무료 사용 가능.
 * width/height를 주면 #map에 픽셀 크기를 지정해 iOS WebView에서 지도가 확실히 그려지도록 한다.
 *
 * @see https://leafletjs.com/
 * @see https://www.openstreetmap.org/
 */
export function getMapHTML(width?: number, height?: number): string {
  const w = width ?? 400;
  const h = height ?? 600;
  const mapSize = `width:${w}px;height:${h}px;`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    #map { ${mapSize} }
    .leaflet-container { font: inherit; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script>
    (function() {
      var map = null;
      var markers = [];

      function postToRN(obj) {
        if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
          window.ReactNativeWebView.postMessage(JSON.stringify(obj));
        }
      }

      function clearMarkers() {
        markers.forEach(function(m) { m.remove(); });
        markers = [];
      }

      function createMarkers(list) {
        if (!map) return;
        clearMarkers();
        list.forEach(function(item) {
          var m = L.marker([item.lat, item.lng]).addTo(map);
          if (item.title) m.bindTooltip(item.title, { permanent: false });
          m.on('click', function() {
            postToRN({ type: 'MARKER_CLICK', payload: { id: item.id, lat: item.lat, lng: item.lng } });
          });
          markers.push(m);
        });
      }

      window.__KakaoMapBridge = {
        setCenter: function(lat, lng) {
          if (map) map.setView([lat, lng], map.getZoom());
        },
        setZoom: function(level) {
          if (map) map.setZoom(level);
        },
        setMarkers: function(list) {
          createMarkers(list);
        }
      };

      map = L.map('map').setView([37.5665, 126.978], 14);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      map.on('click', function(e) {
        postToRN({ type: 'MAP_CLICK', payload: { lat: e.latlng.lat, lng: e.latlng.lng } });
      });

      map.on('moveend', function() {
        var c = map.getCenter();
        postToRN({
          type: 'MAP_MOVE_END',
          payload: { lat: c.lat, lng: c.lng, level: map.getZoom() }
        });
      });

      postToRN({ type: 'MAP_READY' });
    })();
  </script>
</body>
</html>
`.trim();
}
