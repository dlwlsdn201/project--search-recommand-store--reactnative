-- SpotFinder: PostGIS + places 테이블 + get_nearby_places RPC
-- 위치 기반 맛집 추천 시스템 DB 마이그레이션

-- 1. PostGIS 활성화
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. places 테이블
CREATE TABLE IF NOT EXISTS places (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  address       TEXT,
  description   TEXT,
  category      TEXT,
  phone         TEXT,
  image_url     TEXT,
  location      geography(Point, 4326),
  rating        NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  review_count  INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 인덱스
CREATE INDEX idx_places_location ON places USING GIST (location);
CREATE INDEX idx_places_rating_review ON places (rating DESC, review_count DESC);

-- 4. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_places_updated_at
  BEFORE UPDATE ON places FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. get_nearby_places RPC
--    Score = (rating * 0.7) + (log(review_count + 1) * 0.3)
CREATE OR REPLACE FUNCTION get_nearby_places(
  lat          FLOAT8,
  lng          FLOAT8,
  radius_meter INT DEFAULT 1000
)
RETURNS TABLE (
  id             UUID,
  name           TEXT,
  address        TEXT,
  description    TEXT,
  category       TEXT,
  phone          TEXT,
  image_url      TEXT,
  latitude       FLOAT8,
  longitude      FLOAT8,
  rating         NUMERIC,
  review_count   INTEGER,
  distance_meter FLOAT8,
  score          FLOAT8,
  created_at     TIMESTAMPTZ,
  updated_at     TIMESTAMPTZ
)
LANGUAGE sql STABLE
AS $$
  SELECT
    p.id, p.name, p.address, p.description,
    p.category, p.phone, p.image_url,
    ST_Y(p.location::geometry)  AS latitude,
    ST_X(p.location::geometry)  AS longitude,
    p.rating, p.review_count,
    ST_Distance(
      p.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) AS distance_meter,
    (p.rating * 0.7 + log(p.review_count + 1) * 0.3)::FLOAT8 AS score,
    p.created_at, p.updated_at
  FROM places p
  WHERE ST_DWithin(
    p.location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meter
  )
  ORDER BY distance_meter ASC;
$$;
