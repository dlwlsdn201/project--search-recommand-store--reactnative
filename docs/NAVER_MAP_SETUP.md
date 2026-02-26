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

## 2. Naver Cloud 콘솔에서 Service URL 및 Dynamic Map 설정

**반드시 브라우저 검증 전에 등록해야 합니다.** 등록되지 않으면 "클라이언트 아이디와 웹 서비스 URL을 확인해 주세요" / Authentication Failed 오류가 납니다.

1. [Naver Cloud Platform](https://console.ncloud.com/) → 프로젝트 선택
2. **Maps** 서비스 → **Application** (사용 중인 애플리케이션) 선택 → **수정**
3. **Dynamic Map**이 **선택/체크**되어 있는지 확인합니다.  
   - 선택되어 있지 않으면 429(Quota Exceed) 또는 지도 미표시가 발생합니다.  
   - [NCP 문서](https://navermaps.github.io/maps.js.ncp/docs/tutorial-1-Getting-Client-ID.html): Application 수정 화면에서 Dynamic Map 선택 필수.
4. **Web 서비스 URL**(또는 Service URL)에 **도메인만** 등록합니다.  
   - **포함하지 말 것**: 포트 번호, URI/경로. (NCP: "서비스 URL은 포트 번호 및 URI를 제외한 호스트 도메인만 등록")  
   - **올바른 예**: `https://project-search-recommand-store-reac.vercel.app`  
   - **잘못된 예**: `https://...vercel.app/naver-map-bridge.html` (경로 포함)
5. 저장 후 반영까지 1~2분 걸릴 수 있으니, 그 다음에 브라우저 검증 또는 앱에서 다시 시도합니다.

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

이 프로젝트는 이미 **Root Directory = 레포 루트**, **outputDirectory = public** 이 설정된 `vercel.json`이 있으므로, Vercel에서 레포를 **Import한 뒤 Deploy만 하면** `public/` 내용이 사이트 루트로 서빙됩니다.

1. 프로젝트 루트에 `public/` 폴더가 있고 그 안에 `naver-map-bridge.html`이 있으며, `vercel.json`에 `outputDirectory: "public"`이 설정되어 있으면, 배포 시 `public/` 내용이 루트 경로에 그대로 서빙됩니다.
2. Vercel 프로젝트 설정에서 **Root Directory**를 이 레포 루트로 두고 배포하면  
   `https://<프로젝트명>.vercel.app/naver-map-bridge.html` 로 접근 가능합니다.
3. 위 URL을 `EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL`에 넣고, Naver 콘솔 Service URL에는  
   `https://<프로젝트명>.vercel.app` (또는 콘솔이 요구하는 형식)을 등록하면 됩니다.

---

## 5. 체크리스트 (요약)

- [ ] **1. 호스팅**: Vercel에서 레포 Import → Deploy → 배포 URL 확인  
  (`https://<배포도메인>/naver-map-bridge.html`)
- [ ] **2. Naver 콘솔**: [NCP 콘솔](https://console.ncloud.com/) → Maps → Application → **수정**  
  - **Dynamic Map** 선택/체크 여부 확인  
  - **Web 서비스 URL**에 **도메인만** 등록 (예: `https://project-search-recommand-store-reac.vercel.app` — 경로/URI 포함 금지)
- [ ] **3. 검증**: 1~2분 후 브라우저에서  
  `https://<배포도메인>/naver-map-bridge.html?ncpKeyId=<클라이언트_ID>&width=400&height=600` 접속해 지도 로드 확인
- [ ] **4. 앱 `.env`**: `EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL=https://<배포도메인>/naver-map-bridge.html` 설정 후 앱 재실행

---

## 6. 지도가 뜨지 않을 때 (트러블슈팅)

- **NCP Application 수정** → **Dynamic Map**이 **체크**되어 있는지 확인.  
  체크되지 않으면 지도가 로드되지 않거나 429 오류가 납니다.
- **Web 서비스 URL**은 **도메인만** 등록(경로 제외).  
  [NCP Maps 문제 해결](https://guide-fin.ncloud-docs.com/docs/maps-troubleshoot) 참고.
- 등록/수정 후 1~2분 이상 지난 뒤에 다시 시도.  
  시크릿 창 또는 다른 브라우저로 열어서 캐시 영향 제거.
- 브라우저 개발자 도구(F12) → **Console** 탭에서 에러 메시지 확인.  
  `public/naver-map-bridge.html`은 로드/생성 실패 시 화면에 에러 문구를 표시하도록 되어 있어, 브라우저에서 열었을 때 원인 파악에 도움이 됩니다.

---

정리하면, **브릿지 HTML을 HTTPS로 호스팅**하고, 그 **URL을 Naver Service URL에 등록**한 뒤, 앱에는 **`EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL`** 로 그 주소를 넘겨주면 "인증이 실패했습니다" 메시지는 해결됩니다.
