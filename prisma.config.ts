/**
 * Prisma CLI 설정 (Migrate 등).
 * v7부터 connection URL은 schema.prisma가 아니라 이 파일에서 지정한다.
 * @see https://pris.ly/d/config-datasource
 */
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  },
});
