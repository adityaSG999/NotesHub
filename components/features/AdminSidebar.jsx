"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LayoutDashboard, Flag, Users, FileText, LogOut, Home, X, Menu, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminSidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('/logout failed', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-surface/95 backdrop-blur-sm border-b border-outline z-50 flex items-center justify-between px-4 py-3 h-16 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-1.5 shadow-lg shadow-primary/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-text-primary text-sm leading-none tracking-tight">NotesHub</p>
            <p className="text-xs text-text-muted mt-0.5 font-medium">Admin Console</p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2.5 hover:bg-surface-container rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-text-primary" />
          ) : (
            <Menu className="w-5 h-5 text-text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
          w-72 md:w-80 lg:w-64 bg-surface border-r border-outline flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-outline bg-gradient-to-b from-surface to-surface/50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl p-2 shadow-lg shadow-primary/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-text-primary text-base leading-none tracking-tight">NotesHub</p>
              <p className="text-xs text-text-muted mt-1 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-1 overflow-y-auto">
          <div className="mb-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-3">Navigation</p>
            <AdminNavItem href="/" icon={<Home className="w-4 h-4" />} label="Back to Home" variant="home" pathname={pathname} />
          </div>
          
          <div className="border-t border-outline my-3"></div>
          
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-3">Admin</p>
            <AdminNavItem href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" pathname={pathname} />
            <AdminNavItem href="/admin/flags" icon={<Flag className="w-4 h-4" />} label="Flagged Content" pathname={pathname} />
            <AdminNavItem href="/admin/users" icon={<Users className="w-4 h-4" />} label="Users" pathname={pathname} />
            <AdminNavItem href="/admin/notes" icon={<FileText className="w-4 h-4" />} label="All Notes" pathname={pathname} />
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-outline bg-gradient-to-t from-surface to-surface/50 shrink-0">
          <form onSubmit={handleLogout}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-error hover:bg-error/10 rounded-xl transition-all duration-200 font-medium group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Sign Out</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}

function AdminNavItem({ href, icon, label, variant = 'default', pathname }) {
  const isActive = pathname === href;
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden group";
  
  if (variant === 'home') {
    return (
      <Link
        href={href}
        className={`${baseClasses} text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 ${isActive ? 'bg-primary/10 border-primary/40' : ''}`}
      >
        <div className="relative z-10 flex items-center gap-3">
          {icon}
          {label}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} text-text-secondary hover:bg-surface-container hover:text-text-primary hover:translate-x-1 ${isActive ? 'bg-primary/10 text-primary font-semibold' : ''}`}
    >
      <div className="relative z-10 flex items-center gap-3">
        {icon}
        {label}
      </div>
      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
