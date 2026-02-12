# Naver Maps 인증 실패 해결 (Service URL)

WebView에서 **인라인 HTML**로 지도를 띄우면 요청 Origin이 `null`/`about:blank`가 되어 Naver에서 **"네이버 지도 Open API 인증이 실패했습니다"** 가 납니다.  
**지도 HTML을 우리가 호스팅하는 HTTPS URL에서 로드**하면 해결됩니다.

---

## 1. 브릿지 HTML 호스팅

1. **`public/naver-map-bridge.html`** 파일을 **HTTPS로 서빙되는 곳**에 배포합니다.
   - 예: Vercel, Netlify, GitHub Pages, 본인 서버 등
2. 배포 후 **전체 URL**을 확인합니다.  
   예: `https://your-project.vercel.app/naver-map-bridge.html`

---

## 2. Naver Cloud 콘솔에서 Service URL 등록

1. [Naver Cloud Platform](https://console.ncloud.com/) → 프로젝트 선택
2. **Maps** 서비스 → **Application** (또는 사용 중인 애플리케이션) 선택
3. **Service URL** 설정에서 위에서 쓴 **도메인/URL**을 등록합니다.
   - 예: `https://your-project.vercel.app` 또는 `https://your-project.vercel.app/naver-map-bridge.html`
   - 콘솔에서 허용하는 형식(도메인만 vs 전체 경로)에 맞춰 등록
4. 저장 후 반영까지 잠시 걸릴 수 있으니, 1~2분 뒤 앱에서 다시 시도합니다.

---

## 3. 앱 환경 변수

`.env`에 다음 두 값을 넣습니다.

```env
# Naver Maps JavaScript v3 클라이언트 ID (기존)
EXPO_PUBLIC_NAVER_MAP_CLIENT_ID=발급받은_클라이언트_ID

# 브릿지 HTML 전체 URL (새로 추가)
EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL=https://your-project.vercel.app/naver-map-bridge.html
```

- `EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL`이 **비어 있지 않으면** 앱은 인라인 HTML 대신 **이 URL**을 WebView에 로드합니다.
- 이때 요청 Origin이 `https://your-project.vercel.app`가 되므로, 위에서 등록한 Service URL과 일치해야 인증이 통과합니다.

---

## 4. Vercel로 배포하는 경우

1. 프로젝트 루트에 `public/` 폴더가 있고 그 안에 `naver-map-bridge.html`이 있으면, Vercel이 `public/` 내용을 루트 경로에 그대로 서빙합니다.
2. Vercel 프로젝트 설정에서 **Root Directory**를 이 레포 루트로 두고 배포하면  
   `https://<프로젝트명>.vercel.app/naver-map-bridge.html` 로 접근 가능합니다.
3. 위 URL을 `EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL`에 넣고, Naver 콘솔 Service URL에는  
   `https://<프로젝트명>.vercel.app` (또는 콘솔이 요구하는 형식)을 등록하면 됩니다.

---

정리하면, **브릿지 HTML을 HTTPS로 호스팅**하고, 그 **URL을 Naver Service URL에 등록**한 뒤, 앱에는 **`EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL`** 로 그 주소를 넘겨주면 "인증이 실패했습니다" 메시지는 해결됩니다.
