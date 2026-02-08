/**
 * React Navigation Native Stack param list.
 * Add route params here as screens are implemented.
 */
export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  PlaceDetail: { placeId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
