/** Place entity — mirrors the `get_nearby_places` RPC response shape. */
export type Place = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  category: string | null;
  phone: string | null;
  image_url: string | null;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  distance_meter: number;
  score: number;
  created_at: string;
  updated_at: string;
};
