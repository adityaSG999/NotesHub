import { cookies } from 'next/headers';
import { Home, Search, Bookmark, User, PenSquare, Shield } from 'lucide-react';
import Link from 'next/link';
import UserNav from '@/components/features/UserNav';
import { verifyToken } from '@/lib/auth';

export default async function MainNav() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || null;
  const user = token ? verifyToken(token) : null;

  return (
    <>
      <Link href="/" className="text-2xl font-bold text-primary mb-8 tracking-tight pl-2 block">
        NotesHub
      </Link>

      {user && (
        <>
          <nav className="flex flex-col gap-1">
            <NavItem href="/" icon={<Home />} label="Home" />
            <NavItem href="/search" icon={<Search />} label="Explore" />
            <NavItem href="/bookmarks" icon={<Bookmark />} label="Bookmarks" />
            <NavItem href="/profile" icon={<User />} label="Profile" />
            {user?.role === 'ADMIN' && <NavItem href="/admin" icon={<Shield />} label="Admin" />}
          </nav>

          <Link
            href="/"
            className="bg-primary hover:bg-primary-hover text-white rounded-button py-3 px-4 font-semibold shadow-soft active:scale-95 transition-all w-full flex items-center justify-center gap-2 mt-6 text-sm"
          >
            <PenSquare className="w-5 h-5" />
            New Note
          </Link>
        </>
      )}

      {user && <UserNav user={user} />}
    </>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-surface-container text-text-primary transition-colors"
    >
      <div className="[&>svg]:w-5 [&>svg]:h-5">{icon}</div>
      <span className="font-medium text-[15px]">{label}</span>
    </Link>
  );
}
