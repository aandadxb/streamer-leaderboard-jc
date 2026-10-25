import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const rows = await prisma.$queryRawUnsafe(`
  SELECT s.slug, s.campaign_id, li.user_id::text AS user_id, li.rank::text AS rank
  FROM streamers s
  JOIN leaderboard_influencer li ON li.campaign_id::text = s.campaign_id
  ORDER BY s.slug, li.rank
  LIMIT 20
`);
console.log(JSON.stringify(rows, null, 2));
await prisma.$disconnect();
