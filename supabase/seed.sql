-- SpotFinder: 테스트용 시드 데이터
-- Supabase Dashboard SQL Editor에서 실행하세요.

INSERT INTO places (name, address, category, phone, location, rating, review_count) VALUES
  -- 강남역 주변
  ('을지로골뱅이', '서울시 강남구 역삼동 123', '한식', '02-1234-5678',
   ST_SetSRID(ST_MakePoint(127.0285, 37.4985), 4326)::geography, 4.5, 120),
  ('스시오마카세', '서울시 강남구 역삼동 456', '일식', '02-2345-6789',
   ST_SetSRID(ST_MakePoint(127.0270, 37.4970), 4326)::geography, 4.8, 85),
  ('강남곱창', '서울시 강남구 역삼동 789', '한식', '02-3456-7890',
   ST_SetSRID(ST_MakePoint(127.0295, 37.4992), 4326)::geography, 4.2, 200),
  ('파스타공방', '서울시 강남구 역삼동 101', '양식', '02-4567-8901',
   ST_SetSRID(ST_MakePoint(127.0260, 37.4965), 4326)::geography, 4.0, 60),
  ('매운떡볶이', '서울시 강남구 역삼동 202', '분식', '02-5678-9012',
   ST_SetSRID(ST_MakePoint(127.0300, 37.4975), 4326)::geography, 3.8, 300),

  -- 홍대입구 주변
  ('홍대칼국수', '서울시 마포구 서교동 111', '한식', '02-1111-2222',
   ST_SetSRID(ST_MakePoint(126.9240, 37.5570), 4326)::geography, 4.3, 150),
  ('타코야끼집', '서울시 마포구 서교동 222', '일식', '02-2222-3333',
   ST_SetSRID(ST_MakePoint(126.9250, 37.5563), 4326)::geography, 4.1, 90),
  ('브런치카페', '서울시 마포구 서교동 333', '카페', '02-3333-4444',
   ST_SetSRID(ST_MakePoint(126.9235, 37.5580), 4326)::geography, 4.6, 110),

  -- 서울시청/광화문 주변
  ('명동냉면', '서울시 중구 명동 444', '한식', '02-4444-5555',
   ST_SetSRID(ST_MakePoint(126.9820, 37.5640), 4326)::geography, 4.4, 250),
  ('광화문국밥', '서울시 종로구 세종로 555', '한식', '02-5555-6666',
   ST_SetSRID(ST_MakePoint(126.9770, 37.5720), 4326)::geography, 4.7, 180),

  -- 이태원 주변
  ('이태원버거', '서울시 용산구 이태원동 666', '양식', '02-6666-7777',
   ST_SetSRID(ST_MakePoint(126.9945, 37.5345), 4326)::geography, 4.0, 95),
  ('인도커리하우스', '서울시 용산구 이태원동 777', '인도식', '02-7777-8888',
   ST_SetSRID(ST_MakePoint(126.9935, 37.5350), 4326)::geography, 4.5, 70);
