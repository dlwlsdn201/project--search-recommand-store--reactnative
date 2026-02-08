/**
 * 환경 변수 / 앱 설정
 * Expo에서는 EXPO_PUBLIC_ 접두사가 붙은 변수만 클라이언트에 노출된다.
 * @see https://docs.expo.dev/guides/environment-variables/
 */
export const env = {
  /** Kakao Developers JavaScript 키 (지도 WebView용) */
  get KAKAO_MAP_API_KEY(): string {
    return process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY ?? '';
  },
} as const;
