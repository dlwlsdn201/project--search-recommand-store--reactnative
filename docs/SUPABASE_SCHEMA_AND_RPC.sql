-- SpotFinder: Supabase(PostgreSQL) + PostGIS
-- 1) PostGIS 확장, 2) Place / Review / User 테이블, 3) 추천 RPC (평점 4.0+, 리뷰 10개+)

-- ----------
-- 1. PostGIS
-- ----------
CREATE EXTENSION IF NOT EXISTS postgis;

-- ----------
-- 2. 테이블 (Prisma 스키마와 동일 구조, location은 geography(Point))
-- ----------
CREATE TABLE IF NOT EXISTS "User" (
  "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"     TEXT NOT NULL UNIQUE,
  "name"      TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Place" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"        TEXT NOT NULL,
  "address"     TEXT,
  "description" TEXT,
  "location"    geography(Point, 4326),
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "Place_location_idx" ON "Place" USING GIST ("location");

CREATE TABLE IF NOT EXISTS "Review" (
  "id"        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "placeId"   UUID NOT NULL REFERENCES "Place"("id") ON DELETE CASCADE,
  "userId"    UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "rating"   DECIMAL(2,1) NOT NULL,
  "content"   TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "Review_placeId_idx" ON "Review"("placeId");
CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId");

-- ----------
-- 3. 추천 로직: 평점 4.0 이상, 리뷰 10개 이상인 Place 목록 (RPC)
-- ----------
CREATE OR REPLACE FUNCTION get_recommended_places(
  "min_rating" DECIMAL DEFAULT 4.0,
  "min_review_count" BIGINT DEFAULT 10,
  "limit_count" INT DEFAULT 50
)
RETURNS TABLE (
  "id"          UUID,
  "name"        TEXT,
  "address"     TEXT,
  "description" TEXT,
  "avg_rating"  DECIMAL,
  "review_count" BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.id,
    p.name,
    p.address,
    p.description,
    ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
    COUNT(r.id)::bigint AS review_count
  FROM "Place" p
  INNER JOIN "Review" r ON r."placeId" = p.id
  GROUP BY p.id, p.name, p.address, p.description
  HAVING AVG(r.rating) >= min_rating
     AND COUNT(r.id) >= min_review_count
  ORDER BY avg_rating DESC, review_count DESC
  LIMIT limit_count;
$$;

-- ----------
-- 4. 호출 예시 (Supabase Dashboard SQL Editor 또는 클라이언트)
-- ----------
-- SELECT * FROM get_recommended_places(4.0, 10, 50);

-- 동일 조건의 단순 쿼리 예시 (RPC 없이):
/*
SELECT
  p.id,
  p.name,
  p.address,
  ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
  COUNT(r.id) AS review_count
FROM "Place" p
JOIN "Review" r ON r."placeId" = p.id
GROUP BY p.id, p.name, p.address
HAVING AVG(r.rating) >= 4.0 AND COUNT(r.id) >= 10
ORDER BY avg_rating DESC, review_count DESC;
*/
