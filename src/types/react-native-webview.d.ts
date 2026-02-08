/**
 * react-native-webview 타입 선언 (패키지 설치 전 tsc 통과용).
 * npm install react-native-webview 후 패키지 내장 타입 사용 가능.
 */
declare module 'react-native-webview' {
  import type { RefObject } from 'react';
  import type { StyleProp, ViewStyle } from 'react-native';

  export interface WebViewMessageEvent {
    nativeEvent: {
      data: string;
    };
  }

  export interface WebViewProps {
    ref?: RefObject<WebViewRef | null>;
    source: { uri?: string; html?: string };
    style?: StyleProp<ViewStyle>;
    onMessage?: (event: WebViewMessageEvent) => void;
    scrollEnabled?: boolean;
    bounces?: boolean;
    javaScriptEnabled?: boolean;
    originWhitelist?: string[];
  }

  export interface WebViewRef {
    injectJavaScript: (script: string) => void;
  }

  const WebView: React.ComponentType<WebViewProps>;
  export default WebView;
}
