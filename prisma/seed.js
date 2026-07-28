const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const CATEGORIES = ['Tech', 'Life', 'Thoughts', 'Learning', 'Ideas', 'Design', 'Career'];

const DUMMY_NOTES = [
  { title: 'Why I switched to Next.js', content: 'After spending two years on a traditional React SPA, migrating to Next.js App Router was one of the best decisions I made. Server Components alone cut our JS bundle by 40%.', category: 'Tech' },
  { title: null, content: 'Consistency beats motivation every single time. Show up even when you don\'t feel like it.', category: 'Life' },
  { title: 'The Art of Rubber Duck Debugging', content: 'Explain your problem out loud to an inanimate object. The simple act of verbalising the issue forces your brain to look at it from a fresh angle. Works 90% of the time.', category: 'Thoughts' },
  { title: 'PostgreSQL full-text search', content: 'You don\'t need Elasticsearch for most apps. PostgreSQL tsvector + GIN index is fast, free, and already in your stack. Built-in rankings too.', category: 'Tech' },
  { title: null, content: 'Reading documentation is a skill. Most engineers don\'t read it — they skim it. The ones who read it carefully are always 3x faster.', category: 'Learning' },
  { title: 'Idea: AI-powered flashcard generator', content: 'Paste any article URL, the model extracts key concepts and generates spaced-repetition flashcards. Export to Anki. Seems like a weekend project worth building.', category: 'Ideas' },
  { title: 'Material Design 3 is underrated', content: 'The color system, elevation tokens, and component states in MD3 are incredibly thoughtful. More products should adopt it instead of rolling their own half-baked design systems.', category: 'Design' },
  { title: null, content: 'Your first job is rarely about the work. It\'s about learning how to work — deadlines, communication, dependencies, tradeoffs. The technical skills come second.', category: 'Career' },
  { title: 'Redis as a rate-limiter', content: 'Use a sliding window algorithm in Redis with ZADD + ZREMRANGEBYSCORE. Scales to millions of requests per second with sub-millisecond latency. Dead simple to implement.', category: 'Tech' },
  { title: null, content: 'Stop optimising for productivity. Start optimising for recovery. You can\'t sprint every single day without burning out.', category: 'Life' },
  { title: 'Prisma transactions are underused', content: '$transaction() is your best friend when you need atomicity. Increment a counter AND create a record in one round-trip. If either fails, both roll back. No partial state ever.', category: 'Tech' },
  { title: 'The 2-minute writing habit', content: 'I started writing for just 2 minutes every morning. Three months later it\'s 45 minutes and I\'ve shipped two side projects from those sessions. Small consistent actions compound.', category: 'Learning' },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // --- Admin User ---
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@noteshub.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@noteshub.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      bio: 'NotesHub platform administrator.',
    }
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // --- Dummy Users ---
  const dummyUsers = [
    { username: 'alex_dev', email: 'alex@example.com', bio: 'Full-stack engineer. I ship things.' },
    { username: 'priya_learns', email: 'priya@example.com', bio: 'Lifelong learner. Python & ML enthusiast.' },
    { username: 'marco_design', email: 'marco@example.com', bio: 'UI/UX designer who codes. Tokyo 🗼' },
    { username: 'sara_writes', email: 'sara@example.com', bio: 'Technical writer & open source contributor.' },
  ];

  const createdUsers = [];
  const sharedHash = await bcrypt.hash('Password@123', 10);

  for (const u of dummyUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: sharedHash }
    });
    createdUsers.push(user);
    console.log(`✅ User created: @${user.username}`);
  }

  const allUsers = [admin, ...createdUsers];

  // --- Dummy Notes ---
  for (let i = 0; i < DUMMY_NOTES.length; i++) {
    const noteData = DUMMY_NOTES[i];
    const author = allUsers[i % allUsers.length];
    await prisma.note.create({
      data: { ...noteData, authorId: author.id, status: 'PUBLISHED' }
    });
  }
  console.log(`✅ ${DUMMY_NOTES.length} notes published`);

  // --- Follow Relationships ---
  // alex follows priya and marco; priya follows sara; admin follows everyone
  const followPairs = [
    [createdUsers[0], createdUsers[1]], // alex → priya
    [createdUsers[0], createdUsers[2]], // alex → marco
    [createdUsers[1], createdUsers[3]], // priya → sara
    [admin, createdUsers[0]],
    [admin, createdUsers[1]],
    [admin, createdUsers[2]],
    [admin, createdUsers[3]],
  ];

  for (const [follower, following] of followPairs) {
    await prisma.follower.upsert({
      where: { followerId_followingId: { followerId: follower.id, followingId: following.id } },
      update: {},
      create: { followerId: follower.id, followingId: following.id }
    });
  }
  console.log(`✅ Follow relationships seeded`);

  console.log('\n🎉 Seed complete!\n');
  console.log('Credentials:');
  console.log('  Admin   → admin@noteshub.com  / Admin@123');
  console.log('  Users   → alex@example.com    / Password@123  (and priya, marco, sara)');
}

seed()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
