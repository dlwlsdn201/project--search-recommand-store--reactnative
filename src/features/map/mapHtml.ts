/**
 * WebView에 로드할 지도 HTML (Naver Maps JavaScript v3).
 * width/height를 주면 #map에 픽셀 크기를 지정해 iOS WebView에서 지도가 확실히 그려지도록 한다.
 *
 * @see https://api.ncloud-docs.com/docs/en/maps-js-v3-overview
 */
export function getMapHTML(
  clientId: string,
  width?: number,
  height?: number,
): string {
  const w = width ?? 400;
  const h = height ?? 600;
  const mapSize = `width:${w}px;height:${h}px;`;
  const safeClientId = clientId.replace(/"/g, "&quot;");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    #map { ${mapSize} }
  </style>
  <script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${safeClientId}"></script>
</head>
<body>
  <div id="map"></div>
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
        markers.forEach(function(m) { m.setMap(null); });
        markers = [];
      }

      function createMarkers(list) {
        if (!map || !window.naver || !window.naver.maps) return;
        clearMarkers();
        list.forEach(function(item) {
          var position = new naver.maps.LatLng(item.lat, item.lng);
          var marker = new naver.maps.Marker({
            position: position,
            map: map,
            title: item.title || item.id,
          });
          naver.maps.Event.addListener(marker, 'click', function() {
            postToRN({ type: 'MARKER_CLICK', payload: { id: item.id, lat: item.lat, lng: item.lng } });
          });
          markers.push(marker);
        });
      }

      // RN → WebView 호출용 브릿지
      window.__NaverMapBridge = {
        setCenter: function(lat, lng) {
          if (!map || !window.naver || !window.naver.maps) return;
          map.setCenter(new naver.maps.LatLng(lat, lng));
        },
        setZoom: function(level) {
          if (!map) return;
          map.setZoom(level);
        },
        setMarkers: function(list) {
          createMarkers(list);
        }
      };

      function init() {
        if (!window.naver || !window.naver.maps) {
          setTimeout(init, 50);
          return;
        }

        map = new naver.maps.Map('map', {
          center: new naver.maps.LatLng(37.5665, 126.9780),
          zoom: 14,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT,
          },
          mapDataControl: false,
        });

        naver.maps.Event.addListener(map, 'click', function(e) {
          var latlng = e.coord;
          postToRN({ type: 'MAP_CLICK', payload: { lat: latlng.y, lng: latlng.x } });
        });

        naver.maps.Event.addListener(map, 'idle', function() {
          var center = map.getCenter();
          postToRN({
            type: 'MAP_MOVE_END',
            payload: { lat: center.y, lng: center.x, level: map.getZoom() }
          });
        });

        postToRN({ type: 'MAP_READY' });
      }

      init();
    })();
  </script>
</body>
</html>
`.trim();
}
