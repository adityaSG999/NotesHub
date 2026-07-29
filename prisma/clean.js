const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  console.log('🧹 Cleaning database (tables kept, rows removed)...');

  // Delete in an order that respects foreign key constraints:
  // child/dependent tables first, parent tables last.
  await prisma.follower.deleteMany({});
  console.log('✅ Follower rows removed');

  await prisma.note.deleteMany({});
  console.log('✅ Note rows removed');

  await prisma.user.deleteMany({});
  console.log('✅ User rows removed');

  console.log('\n🎉 Clean complete! Tables are intact, all rows removed.');
}

clean()
  .catch((e) => { console.error('❌ Clean failed:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());