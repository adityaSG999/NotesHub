const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const CATEGORIES = ['Tech', 'Life', 'Thoughts', 'Learning', 'Ideas', 'Design', 'Career', 'Questions', 'Updates', 'Resources'];

// ---------------------------------------------------------------------------
// USERS — 30 dummy users + 1 admin
// ---------------------------------------------------------------------------
const FIRST_NAMES = [
  'Alex', 'Priya', 'Marco', 'Sara', 'Liam', 'Noah', 'Emma', 'Olivia', 'Ava',
  'Sophia', 'Isabella', 'Mia', 'Amara', 'Kenji', 'Yuki', 'Ravi', 'Ananya',
  'Diego', 'Lucia', 'Fatima', 'Omar', 'Chen', 'Wei', 'Ingrid', 'Sven',
  'Carlos', 'Elena', 'Tariq', 'Nadia', 'Jonas'
];

const LAST_HANDLES = [
  'dev', 'learns', 'design', 'writes', 'codes', 'builds', 'creates', 'thinks',
  'explores', 'makes', 'ships', 'crafts', 'studies', 'reads', 'draws',
  'plans', 'tests', 'debugs', 'hacks', 'sketches', 'notes', 'plays',
  'travels', 'cooks', 'runs', 'games', 'sings', 'paints', 'teaches', 'grows'
];

const BIOS = [
  'Full-stack engineer. I ship things.',
  'Lifelong learner. Python & ML enthusiast.',
  'UI/UX designer who codes. Tokyo 🗼',
  'Technical writer & open source contributor.',
  'Backend engineer, coffee addict, occasional hiker.',
  'Frontend developer obsessed with performance.',
  'Product manager turned indie hacker.',
  'DevOps by day, game dev by night.',
  'Data scientist exploring the edges of NLP.',
  'Mobile developer, Flutter and Swift.',
  'Cloud architect. AWS certified thrice over.',
  'CS student documenting my learning journey.',
  'Freelance designer and illustrator.',
  'Security researcher, CTF player.',
  'Building in public, one commit at a time.',
  'QA engineer who actually enjoys writing tests.',
  'Startup founder, second time around.',
  'Open source maintainer, mostly tired.',
  'Blockchain skeptic who still writes smart contracts.',
  'Teaching myself Rust one panic at a time.',
  'Remote worker, digital nomad, notebook hoarder.',
  'Accessibility advocate and frontend engineer.',
  'Database nerd. Normalize everything.',
  'ML engineer, mostly debugging tensor shapes.',
  'Technical lead, recovering perfectionist.',
  'Game developer, pixel art enjoyer.',
  'Site reliability engineer, pager on silent.',
  'API designer, JSON schema evangelist.',
  'Junior dev, learning in public.',
  'Solutions architect who still writes code.',
];

function buildDummyUsers() {
  return FIRST_NAMES.map((first, i) => {
    const username = `${first.toLowerCase()}_${LAST_HANDLES[i]}`;
    return {
      username,
      email: `${first.toLowerCase()}${i}@example.com`,
      bio: BIOS[i],
    };
  });
}

const DUMMY_USERS = buildDummyUsers(); // 30 users

// ---------------------------------------------------------------------------
// NOTES — templated content pools per category, combined to generate 100+ notes
// ---------------------------------------------------------------------------
const NOTE_POOL = {
  Tech: [
    { title: 'Why I switched to Next.js', content: 'After spending two years on a traditional React SPA, migrating to Next.js App Router was one of the best decisions I made. Server Components alone cut our JS bundle by 40%.' },
    { title: 'PostgreSQL full-text search', content: 'You don\'t need Elasticsearch for most apps. PostgreSQL tsvector + GIN index is fast, free, and already in your stack. Built-in rankings too.' },
    { title: 'Redis as a rate-limiter', content: 'Use a sliding window algorithm in Redis with ZADD + ZREMRANGEBYSCORE. Scales to millions of requests per second with sub-millisecond latency. Dead simple to implement.' },
    { title: 'Prisma transactions are underused', content: '$transaction() is your best friend when you need atomicity. Increment a counter AND create a record in one round-trip. If either fails, both roll back. No partial state ever.' },
    { title: 'Docker layer caching tips', content: 'Order your Dockerfile from least to most frequently changing. Copy package.json before your source code and your installs will cache correctly nearly every time.' },
    { title: 'GraphQL vs REST, still', content: 'GraphQL solves over-fetching but adds real complexity around caching and rate limiting. For most CRUD apps, a well-designed REST API is still the pragmatic choice.' },
    { title: 'WebSockets vs polling', content: 'If updates are frequent and bidirectional, WebSockets win outright. For occasional updates, long polling is simpler to operate and debug in production.' },
    { title: null, content: 'TypeScript strict mode caught three latent bugs in our codebase within the first hour of enabling it. Worth the migration pain every time.' },
    { title: 'Edge functions changed my architecture', content: 'Moving auth checks to edge middleware shaved 200ms off our average response time. Not every request needs to hit the origin server.' },
    { title: null, content: 'Feature flags are not optional at scale. Ship dark, test in production, roll out gradually. Anything else is just hoping for the best.' },
  ],
  Life: [
    { title: null, content: 'Consistency beats motivation every single time. Show up even when you don\'t feel like it.' },
    { title: null, content: 'Stop optimising for productivity. Start optimising for recovery. You can\'t sprint every single day without burning out.' },
    { title: 'Morning routines are overrated', content: 'What matters isn\'t the specific sequence of habits, it\'s that you have any repeatable anchor at all. Mine changes every few months and that\'s fine.' },
    { title: null, content: 'The best conversations happen when you put the phone away completely, not just face down on the table.' },
    { title: 'On saying no', content: 'Every yes to something is a no to something else, even if that something else is just rest. Choose deliberately.' },
    { title: null, content: 'Walking outside for twenty minutes solves more problems than another hour staring at the same screen.' },
    { title: 'Slow mornings, better days', content: 'I stopped checking my phone for the first hour after waking up. My mood at 10am is noticeably better than it used to be.' },
  ],
  Thoughts: [
    { title: 'The Art of Rubber Duck Debugging', content: 'Explain your problem out loud to an inanimate object. The simple act of verbalising the issue forces your brain to look at it from a fresh angle. Works 90% of the time.' },
    { title: null, content: 'Most arguments online aren\'t really about the topic at hand, they\'re about who gets to feel right at the end of it.' },
    { title: 'On overthinking', content: 'Every decision doesn\'t need a spreadsheet. Some choices are genuinely reversible, and treating them like they aren\'t is where the anxiety comes from.' },
    { title: null, content: 'Silence in a conversation isn\'t a problem to solve. Let it sit sometimes.' },
    { title: 'Why deadlines help creativity', content: 'Unlimited time doesn\'t produce better work, it just produces more procrastination. Constraints force decisions.' },
  ],
  Learning: [
    { title: null, content: 'Reading documentation is a skill. Most engineers don\'t read it — they skim it. The ones who read it carefully are always 3x faster.' },
    { title: 'The 2-minute writing habit', content: 'I started writing for just 2 minutes every morning. Three months later it\'s 45 minutes and I\'ve shipped two side projects from those sessions. Small consistent actions compound.' },
    { title: 'Teach it to learn it', content: 'I didn\'t understand closures until I tried explaining them to a junior dev. Teaching exposes every gap in your own understanding.' },
    { title: null, content: 'Spaced repetition works for code syntax the same way it works for vocabulary. Revisit, don\'t cram.' },
    { title: 'Learning in public', content: 'Posting half-finished thoughts and getting corrected by strangers online has taught me more than any course I\'ve paid for.' },
    { title: null, content: 'The fastest way to learn a new framework is to rebuild a small project you already know well in it.' },
  ],
  Ideas: [
    { title: 'Idea: AI-powered flashcard generator', content: 'Paste any article URL, the model extracts key concepts and generates spaced-repetition flashcards. Export to Anki. Seems like a weekend project worth building.' },
    { title: 'Idea: commit message linter with tone check', content: 'A pre-commit hook that flags vague messages like "fix stuff" and suggests a better structured alternative based on the diff.' },
    { title: 'Idea: local-first notes app', content: 'Sync is optional, everything works offline by default, and conflicts resolve with CRDTs instead of last-write-wins.' },
    { title: null, content: 'What if changelogs were generated automatically from PR descriptions instead of written manually after the fact?' },
    { title: 'Idea: standup bot that reads git activity', content: 'Instead of asking people what they did yesterday, summarize their commits and let them just correct it.' },
  ],
  Design: [
    { title: 'Material Design 3 is underrated', content: 'The color system, elevation tokens, and component states in MD3 are incredibly thoughtful. More products should adopt it instead of rolling their own half-baked design systems.' },
    { title: 'Whitespace is a feature', content: 'Cramming more into a screen almost never makes it more useful. It just makes it harder to scan.' },
    { title: null, content: 'Good empty states are an underrated part of any product. They\'re often the very first screen a new user sees.' },
    { title: 'Consistent spacing scales', content: 'Picking a spacing scale (4, 8, 16, 24, 32) early and sticking to it removes an entire category of design debates later.' },
    { title: null, content: 'Dark mode isn\'t just inverted colors. Contrast, elevation, and saturation all need separate tuning.' },
  ],
  Career: [
    { title: null, content: 'Your first job is rarely about the work. It\'s about learning how to work — deadlines, communication, dependencies, tradeoffs. The technical skills come second.' },
    { title: 'On asking for feedback', content: 'Asking "what should I improve" gets vague answers. Asking about one specific thing gets useful ones.' },
    { title: null, content: 'The best mentors I\'ve had didn\'t give me answers, they asked better questions than I was asking myself.' },
    { title: 'Switching from IC to lead', content: 'The hardest part wasn\'t the technical scope, it was accepting that my value now comes from unblocking others, not from my own output.' },
    { title: null, content: 'A resume gets you the interview. Everything after that is about whether people want to work with you.' },
  ],
  Questions: [
    { title: 'How do you handle scope creep?', content: 'Genuinely curious what others do here. Saying no outright feels harsh but saying yes to everything wrecks the timeline.' },
    { title: 'Best way to structure a monorepo?', content: 'Trying to decide between Turborepo and Nx for a project with three frontend apps and a shared backend. Any strong opinions?' },
    { title: 'Anyone actually enjoy writing tests?', content: 'I know they\'re important, I just want to know if the enjoyment ever kicks in or if it stays a chore forever.' },
    { title: 'How do you review PRs from senior engineers?', content: 'It feels different giving feedback upward. How do you keep it honest without it feeling awkward?' },
  ],
  Updates: [
    { title: 'Shipped v2 of my side project', content: 'Rewrote the entire backend in a weekend. Cleaner architecture, half the response time, and finally added dark mode.' },
    { title: 'New job, new city', content: 'Starting a new role next month. Excited and a little nervous about the change of stack.' },
    { title: 'Open sourced a small library', content: 'Extracted a utility I kept copy-pasting between projects into its own package. First real open source release.' },
    { title: null, content: 'Hit 1,000 users on the side project this week. Small milestone, feels enormous.' },
  ],
  Resources: [
    { title: 'A reading list for backend engineers', content: 'Designing Data-Intensive Applications is still the best single book on the topic. Everything else is a supplement to it.' },
    { title: 'Free tools I use every week', content: 'Excalidraw for diagrams, Postman for APIs, and a plain text file for todo lists. Nothing fancy, all of it sticks.' },
    { title: 'Underrated courses on system design', content: 'Most system design content online is shallow. Look for ones that walk through real production incidents instead of toy examples.' },
    { title: null, content: 'Bookmarking this thread on database indexing strategies, it\'s the clearest explanation I\'ve found so far.' },
  ],
};

function buildNotes() {
  const notes = [];
  // Cycle through the pool multiple times with light variation markers to exceed 100 notes.
  const rounds = 4;
  for (let round = 0; round < rounds; round++) {
    for (const category of CATEGORIES) {
      const pool = NOTE_POOL[category] || [];
      for (const item of pool) {
        // Skip duplicating every item every round to keep some size variance —
        // still comfortably clears 100+ while avoiding a completely uniform 4x repeat.
        if (round > 0 && Math.random() < 0.35) continue;
        notes.push({
          title: item.title,
          content: round === 0 ? item.content : `${item.content}`,
          category,
        });
      }
    }
  }
  return notes;
}

const DUMMY_NOTES = buildNotes();

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

  // --- Dummy Users (30) ---
  const createdUsers = [];
  const sharedHash = await bcrypt.hash('Password@123', 10);

  for (const u of DUMMY_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: sharedHash }
    });
    createdUsers.push(user);
    console.log(`✅ User created: @${user.username}`);
  }

  const allUsers = [admin, ...createdUsers];

  // --- Dummy Notes (100+) ---
  for (let i = 0; i < DUMMY_NOTES.length; i++) {
    const noteData = DUMMY_NOTES[i];
    const author = allUsers[i % allUsers.length];
    await prisma.note.create({
      data: { ...noteData, authorId: author.id, status: 'PUBLISHED' }
    });
  }
  console.log(`✅ ${DUMMY_NOTES.length} notes published`);

  // --- Follow Relationships ---
  // Each user follows a handful of random other users; admin follows everyone.
  const followPairs = [];

  for (const user of createdUsers) {
    const others = createdUsers.filter(u => u.id !== user.id);
    const followCount = 2 + Math.floor(Math.random() * 4); // 2-5 follows
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    for (const target of shuffled.slice(0, followCount)) {
      followPairs.push([user, target]);
    }
  }

  for (const user of createdUsers) {
    followPairs.push([admin, user]);
  }

  const seenPairs = new Set();
  for (const [follower, following] of followPairs) {
    const key = `${follower.id}-${following.id}`;
    if (seenPairs.has(key)) continue;
    seenPairs.add(key);
    await prisma.follower.upsert({
      where: { followerId_followingId: { followerId: follower.id, followingId: following.id } },
      update: {},
      create: { followerId: follower.id, followingId: following.id }
    });
  }
  console.log(`✅ ${seenPairs.size} follow relationships seeded`);

  console.log('\n🎉 Seed complete!\n');
  console.log('Credentials:');
  console.log('  Admin   → admin@noteshub.com  / Admin@123');
  console.log(`  Users   → any of the ${DUMMY_USERS.length} generated emails / Password@123`);
}

seed()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());