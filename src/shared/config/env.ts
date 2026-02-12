/**
 * 환경 변수 / 앱 설정
 * Expo에서는 EXPO_PUBLIC_ 접두사가 붙은 변수만 클라이언트에 노출된다.
 * @see https://docs.expo.dev/guides/environment-variables/
 */
export const env = {
  /** Naver Maps JavaScript v3 클라이언트 ID */
  get NAVER_MAP_CLIENT_ID(): string {
    return process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID ?? '';
  },

  /**
   * Naver 지도 브릿지 HTML URL (호스팅).
   * 이 URL을 Naver Cloud 콘솔 Service URL에 등록해야 인증이 통과합니다.
   * 예: https://your-app.vercel.app/naver-map-bridge.html
   */
  get NAVER_MAP_BRIDGE_URL(): string {
    return (process.env.EXPO_PUBLIC_NAVER_MAP_BRIDGE_URL ?? '').replace(/\/$/, '');
  },
} as const;
