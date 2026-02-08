import { create } from 'zustand';

export type MapCenter = {
  lat: number;
  lng: number;
};

type MapStore = {
  center: MapCenter;
  zoomLevel: number;
  setCenter: (center: MapCenter) => void;
  setZoomLevel: (zoom: number) => void;
};

const DEFAULT_CENTER: MapCenter = { lat: 37.5665, lng: 126.978 }; // 서울

export const useMapStore = create<MapStore>((set) => ({
  center: DEFAULT_CENTER,
  zoomLevel: 14,
  setCenter: (center) => set({ center }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
}));
