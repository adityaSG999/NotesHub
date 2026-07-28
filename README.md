# NotesHub

A modern microblogging/note-taking application built with Next.js 16, featuring real-time interactions, content moderation, and a comprehensive admin system. NotesHub allows users to share text-based notes, engage through likes and bookmarks, follow other users, and report inappropriate content.

## Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies, bcrypt password hashing
- **Note Management**: Create, edit, and delete notes with titles, content, and categories
- **Social Interactions**: 
  - Like/unlike notes with real-time counter updates
  - Bookmark notes for later reference
  - Follow/unfollow users
  - Reply to notes
- **Search**: Full-text search across note content, titles, categories, and author usernames
- **User Profiles**: 
  - Customizable profiles with avatar, bio, and username
  - Profile tabs showing notes, likes, followers, following, and flags
  - View other users' profiles and their content

### Content Moderation
- **Flagging System**: Users can report inappropriate notes with reasons
- **Admin Panel**: 
  - Dashboard with platform statistics (total users, notes, pending flags, daily activity)
  - User management (view all users, block/unblock accounts)
  - Note moderation (view and manage flagged content)
  - Flag management (review and resolve/dismiss reports)
- **Role-Based Access Control**: USER and ADMIN roles with appropriate permissions

### User Experience
- **Optimistic UI**: Instant feedback when creating notes with rollback on failure
- **Infinite Scroll**: Cursor-based pagination for seamless content loading
- **Responsive Design**: Mobile-first approach with TailwindCSS 4
- **Dark Mode**: Built-in theme support with CSS custom properties
- **Loading States**: Skeleton loaders for all major sections

## Tech Stack

- **Framework**: Next.js 16 (App Router with Server Components)
- **Database**: PostgreSQL with Prisma ORM 6
- **Database Hosting**: Neon (Serverless PostgreSQL with connection pooling)
- **Caching**: Upstash Redis (for session management and caching)
- **Authentication**: JWT (7-day expiry) with HttpOnly cookies, bcrypt password hashing
- **Styling**: TailwindCSS 4 with custom theme system
- **Icons**: Lucide React
- **Validation**: Zod for schema validation
- **Font**: Inter (Google Fonts)
- **Runtime**: Node.js

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Redis instance (Upstash recommended)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd NotesHub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL="your-postgresql-database-url"
JWT_SECRET="your-jwt-secret-key"
REDIS_URL="your-redis-url"
```

### 4. Set up the database

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev
```

Seed the database with initial data:

```bash
npm run seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
NotesHub/
├── app/
│   ├── (auth)/                    # Authentication route group
│   │   ├── layout.jsx            # Auth layout wrapper
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── (main)/                    # Main application route group
│   │   ├── layout.jsx            # Main layout with navigation
│   │   ├── page.jsx              # Home feed with notes
│   │   ├── bookmarks/            # Bookmarked notes page
│   │   ├── profile/              # User profile pages
│   │   │   ├── loading.jsx       # Profile loading skeleton
│   │   │   ├── page.jsx          # Profile page wrapper
│   │   │   └── [username]/       # Dynamic username routes
│   │   └── search/               # Search results page
│   ├── admin/                     # Admin panel route group
│   │   ├── layout.jsx            # Admin layout with auth check
│   │   ├── loading.jsx           # Admin loading skeleton
│   │   ├── page.jsx              # Admin dashboard
│   │   ├── users/                # User management
│   │   │   ├── loading.jsx       # Users loading skeleton
│   │   │   └── page.jsx          # Users management page
│   │   ├── notes/                # Note moderation
│   │   │   ├── loading.jsx       # Notes loading skeleton
│   │   │   └── page.jsx          # Notes moderation page
│   │   └── flags/                # Flag management
│   │       ├── loading.jsx       # Flags loading skeleton
│   │       └── page.jsx          # Flags management page
│   ├── api/                       # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/            # POST /api/auth/login
│   │   │   ├── register/         # POST /api/auth/register
│   │   │   ├── logout/           # POST /api/auth/logout
│   │   │   └── session/          # GET /api/auth/session
│   │   ├── notes/                # Note endpoints
│   │   │   ├── route.js          # GET/POST /api/notes
│   │   │   └── [id]/             # Note-specific endpoints
│   │   │       ├── route.js      # PUT/DELETE /api/notes/[id]
│   │   │       ├── like/         # POST /api/notes/[id]/like
│   │   │       ├── bookmark/     # POST /api/notes/[id]/bookmark
│   │   │       └── flag/         # POST /api/notes/[id]/flag
│   │   ├── bookmarks/            # GET /api/bookmarks
│   │   ├── search/               # GET /api/search
│   │   ├── profile/              # GET /api/profile/[username]
│   │   ├── users/                # User operations
│   │   │   ├── profile/          # PUT /api/users/profile
│   │   │   └── [id]/             # User-specific operations
│   │   │       └── follow/       # POST /api/users/[id]/follow
│   │   └── admin/                # Admin-only endpoints
│   │       ├── users/            # GET /api/admin/users
│   │       └── flags/            # GET /api/admin/flags
│   ├── globals.css               # Global styles with TailwindCSS theme
│   ├── layout.jsx                # Root layout with metadata
│   └── not-found.jsx             # Custom 404 page
├── components/
│   ├── common/                   # Reusable UI components
│   │   ├── Avatar.jsx            # User avatar component
│   │   ├── Button.jsx            # Button with loading states
│   │   ├── Skeleton.jsx          # Loading skeleton
│   │   ├── AdminDashboardSkeleton.jsx
│   │   ├── AdminFlagsSkeleton.jsx
│   │   ├── AdminNotesSkeleton.jsx
│   │   ├── AdminUsersSkeleton.jsx
│   │   ├── BookmarkSkeleton.jsx
│   │   ├── FeedSkeleton.jsx
│   │   ├── ProfileInfoSkeleton.jsx
│   │   ├── ProfileSkeleton.jsx
│   │   └── SearchSkeleton.jsx
│   ├── features/                 # Feature-specific components
│   │   ├── NoteCard.jsx          # Individual note display
│   │   ├── NoteComposer.jsx      # Note creation form
│   │   ├── HomeFeed.jsx          # Feed with infinite scroll
│   │   ├── BookmarkList.jsx      # Bookmarks display
│   │   ├── EditModal.jsx         # Note editing modal
│   │   ├── ReplyModal.jsx        # Reply creation modal
│   │   ├── EditProfileModal.jsx  # Profile editing modal
│   │   ├── ProfileInfo.jsx       # Profile header
│   │   ├── ProfileTabs.jsx       # Profile tab navigation
│   │   ├── FollowButton.jsx     # Follow/unfollow button
│   │   └── UserNav.jsx           # User navigation
│   ├── hooks/                    # Custom React hooks
│   │   └── useSession.jsx        # Session management hook
│   └── layout/                   # Layout components
│       └── MainNav.jsx           # Main navigation component
├── lib/
│   ├── auth.js                   # JWT token utilities
│   ├── prisma.js                 # Prisma client singleton
│   └── validation.js             # Zod validation schemas
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   └── seed.js                   # Database seeding script
├── public/                       # Static assets
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── LICENSE                       # License file
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
└── jsconfig.json                 # JavaScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data

## Database Schema

The application uses PostgreSQL with the following data models:

### Models

**User**
- `id` (UUID, primary key)
- `username` (String, unique, 3-30 chars, alphanumeric + underscore)
- `email` (String, unique)
- `passwordHash` (String, bcrypt hashed)
- `avatarUrl` (String, optional)
- `bio` (String, optional, max 500 chars)
- `role` (Enum: USER, ADMIN)
- `status` (Enum: ACTIVE, BLOCKED)
- `createdAt`, `updatedAt` (DateTime)
- Relations: notes, likes, bookmarks, flags, followers, following

**Note**
- `id` (UUID, primary key)
- `authorId` (String, foreign key to User)
- `title` (String, optional, max 100 chars)
- `content` (String, max 2000 chars)
- `category` (String, max 50 chars)
- `status` (Enum: DRAFT, PUBLISHED, FLAGGED, DELETED)
- `likesCount`, `bookmarksCount` (Int, counters)
- `createdAt`, `updatedAt` (DateTime)
- Relations: author, likes, bookmarks, flags

**Like**
- `id` (UUID, primary key)
- `userId`, `noteId` (String, foreign keys)
- `createdAt` (DateTime)
- Unique constraint on (userId, noteId)

**Bookmark**
- `id` (UUID, primary key)
- `userId`, `noteId` (String, foreign keys)
- `createdAt` (DateTime)
- Unique constraint on (userId, noteId)

**Follower**
- `id` (UUID, primary key)
- `followerId`, `followingId` (String, foreign keys to User)
- `createdAt` (DateTime)
- Unique constraint on (followerId, followingId)

**Flag**
- `id` (UUID, primary key)
- `reporterId`, `noteId` (String, foreign keys)
- `reason` (String, max 200 chars)
- `status` (Enum: PENDING, RESOLVED, DISMISSED)
- `createdAt` (DateTime)

### Indexes

Optimized indexes for:
- User status lookups
- Note queries by author, category, status, and creation date
- Bookmark lookups by user
- Flag status filtering

## Database Management

### Generate Prisma Client

```bash
npx prisma generate
```

### Create a new migration

```bash
npx prisma migrate dev --name <migration-name>
```

### Open Prisma Studio (database GUI)

```bash
npx prisma studio
```

### Seed the database

```bash
npm run seed
```

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL` - Your PostgreSQL connection string (Neon)
- `DIRECT_DATABASE_URL` - Direct connection URL for Prisma migrations (Neon)
- `JWT_SECRET` - A secure random string for JWT signing (min 32 chars recommended)
- `REDIS_URL` - Your Redis connection string (Upstash)

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login with email/password
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout (clears cookie)
- `GET /api/auth/session` - Get current session user

### Notes

- `GET /api/notes` - Get notes feed (supports cursor pagination, category filter)
- `POST /api/notes` - Create a new note (authenticated)
- `PUT /api/notes/[id]` - Update a note (author or admin only)
- `DELETE /api/notes/[id]` - Delete a note (author or admin only)
- `POST /api/notes/[id]/like` - Toggle like on a note
- `POST /api/notes/[id]/bookmark` - Toggle bookmark on a note
- `POST /api/notes/[id]/flag` - Report a note

### User & Profile

- `GET /api/profile/[username]` - Get user profile data (supports tabs: notes, likes, followers, following, flags)
- `GET /api/bookmarks` - Get current user's bookmarks (paginated)
- `GET /api/search` - Search notes by content, title, category, or author
- `PUT /api/users/profile` - Update current user's profile (username, bio, avatar)
- `POST /api/users/[id]/follow` - Follow/unfollow a user

### Admin (Admin role required)

- `GET /api/admin/users` - List all users with note counts
- `GET /api/admin/flags` - List flags by status (PENDING, RESOLVED, DISMISSED)

## Authentication Flow

1. **Registration**: User submits username, email, password → Password hashed with bcrypt → User created → JWT token generated → HttpOnly cookie set
2. **Login**: User submits email, password → Password verified → JWT token generated → HttpOnly cookie set
3. **Session Validation**: Each request checks for token cookie → Token verified → User payload extracted → Authorization checked
4. **Authorization**: Role-based access control (USER vs ADMIN) for protected routes

## Validation Rules

### User
- Username: 3-30 characters, alphanumeric + underscore, must start with letter
- Email: Valid email format
- Password: Minimum 6 characters
- Bio: Maximum 500 characters

### Note
- Title: Optional, maximum 100 characters
- Content: Required, 1-2000 characters
- Category: 1-50 characters

### Flag
- Reason: 5-200 characters

### Search
- Query: 2-100 characters

## Development Guidelines

### Code Organization
- Server Components for data fetching and initial rendering
- Client Components for interactivity (forms, modals, real-time updates)
- API routes for all database operations
- Shared validation schemas in `lib/validation.js`
- Reusable components in `components/common/`

### Performance Optimizations
- Cursor-based pagination for feeds
- Optimistic UI updates for better UX
- Database indexes on frequently queried fields
- Prisma client singleton to prevent connection pool exhaustion
- Skeleton loaders for perceived performance

### Security
- HttpOnly cookies for JWT tokens (prevents XSS)
- bcrypt for password hashing
- Input validation with Zod
- SQL injection prevention via Prisma ORM
- Role-based access control for admin endpoints
- CSRF protection via sameSite cookie policy

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` and `DIRECT_DATABASE_URL` are set correctly
- Check if Neon database is active
- Run `npx prisma generate` after schema changes

### Authentication Issues
- Verify `JWT_SECRET` is set in environment variables
- Check cookie settings (httpOnly, secure, sameSite)
- Ensure token is not expired (7-day expiry)

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript/ESLint errors

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM and schema management
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Neon Documentation](https://neon.tech/docs) - Serverless PostgreSQL
- [Upstash Documentation](https://upstash.com/docs) - Redis for caching
- [Zod Documentation](https://zod.dev) - TypeScript-first schema validation
