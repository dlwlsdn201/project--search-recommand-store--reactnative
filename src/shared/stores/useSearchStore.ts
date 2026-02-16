import { create } from 'zustand';
import type { Place } from '@entities/place';

export type ViewMode = 'MAP' | 'LIST';

type SearchStore = {
  keyword: string;
  radius: number;
  viewMode: ViewMode;
  places: Place[];
  isSearching: boolean;

  setKeyword: (keyword: string) => void;
  setRadius: (radius: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setPlaces: (places: Place[]) => void;
  setIsSearching: (loading: boolean) => void;
  toggleViewMode: () => void;
  reset: () => void;
};

const DEFAULT_RADIUS = 500;

export const useSearchStore = create<SearchStore>((set) => ({
  keyword: '',
  radius: DEFAULT_RADIUS,
  viewMode: 'MAP',
  places: [],
  isSearching: false,

  setKeyword: (keyword) => set({ keyword }),
  setRadius: (radius) => set({ radius }),
  setViewMode: (viewMode) => set({ viewMode }),
  setPlaces: (places) => set({ places }),
  setIsSearching: (isSearching) => set({ isSearching }),
  toggleViewMode: () =>
    set((state) => ({ viewMode: state.viewMode === 'MAP' ? 'LIST' : 'MAP' })),
  reset: () =>
    set({ keyword: '', radius: DEFAULT_RADIUS, viewMode: 'MAP', places: [], isSearching: false }),
}));
