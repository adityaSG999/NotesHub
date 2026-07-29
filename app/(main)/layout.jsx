import Link from 'next/link';
import { Home, Search, Bookmark, User, PenSquare, Shield } from 'lucide-react';
import MainNav from '@/components/layout/MainNav';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export default async function MainLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || null;
  const user = token ? verifyToken(token) : null;

  // Full-width layout for unauthenticated users (landing page)
  if (!user) {
    return (
      <div className="min-h-screen w-full">
        {children}
      </div>
    );
  }

  // Standard layout with sidebars for authenticated users
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto w-full relative">

      {/* ─── Desktop Left Rail ─── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-outline px-4 py-6 sticky top-0 h-screen">
        <MainNav />
      </aside>

      {/* ─── Main Feed ─── */}
      <main className="flex-1 w-full md:max-w-2xl border-r border-outline min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* ─── Desktop Right Rail ─── */}
      <aside className="hidden lg:flex flex-col w-80 px-6 py-8 sticky top-0 h-screen gap-4">
        <div className="bg-surface-container rounded-card p-5 border border-outline">
          <h3 className="font-bold text-text-primary mb-3 text-sm">Trending Topics</h3>
          <div className="flex flex-col gap-2.5">
            {['#nextjs', '#webdev', '#design', '#buildinpublic', '#oss'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${tag.slice(1)}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* ─── Mobile Bottom Tab Nav ─── */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline flex items-center justify-around py-2 px-2 z-50">
          <MobileNavItem href="/"          icon={<Home />} />
          <MobileNavItem href="/search"    icon={<Search />} />
          <Link
            href="/"
            className="bg-primary text-white p-3.5 rounded-full shadow-hover active:scale-95 transition-all -mt-6 border-4 border-background"
          >
            <PenSquare className="w-5 h-5" />
          </Link>
          <MobileNavItem href="/bookmarks" icon={<Bookmark />} />
          <MobileNavItem href="/profile"   icon={<User />} />
        </nav>
      )}
    </div>
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

function MobileNavItem({ href, icon }) {
  return (
    <Link href={href} className="p-3 text-text-secondary hover:text-primary transition-colors active:scale-95">
      <div className="[&>svg]:w-6 [&>svg]:h-6">{icon}</div>
    </Link>
  );
}
