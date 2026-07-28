import Link from 'next/link';
import { Shield, LayoutDashboard, Flag, Users, FileText, LogOut } from 'lucide-react';

export const metadata = {
  title: 'Admin Panel | NotesHub',
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-surface border-r border-outline flex flex-col shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-outline">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-text-primary text-sm leading-none">NotesHub</p>
              <p className="text-xs text-text-muted mt-0.5">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <AdminNavItem href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
          <AdminNavItem href="/admin/flags" icon={<Flag className="w-4 h-4" />} label="Flagged Content" />
          <AdminNavItem href="/admin/users" icon={<Users className="w-4 h-4" />} label="Users" />
          <AdminNavItem href="/admin/notes" icon={<FileText className="w-4 h-4" />} label="All Notes" />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-outline">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function AdminNavItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface-container hover:text-text-primary transition-colors text-sm font-medium active:scale-95"
    >
      {icon}
      {label}
    </Link>
  );
}
