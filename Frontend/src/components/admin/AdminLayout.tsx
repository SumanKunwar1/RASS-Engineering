import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  User,
  Info,
  Wrench,
  FolderKanban,
  FileText,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Menu,
  ShieldCheck,
  X,
  MessageSquareQuote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Home, label: 'Home Page', path: '/admin/home' },
  { icon: Info, label: 'About Page', path: '/admin/about' },
  { icon: Wrench, label: 'Services', path: '/admin/services' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: FileText, label: 'Blog', path: '/admin/blog' },
  { icon: Mail, label: 'Contact', path: '/admin/contact' },
  { icon: HelpCircle, label: 'FAQs', path: '/admin/faqs' },
  { icon: ShieldCheck, label: 'Trusted By', path: '/admin/trustedby' },
  { icon: MessageSquareQuote, label: 'Submissions', path: '/admin/submissions' },
  { icon: User, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },

];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-admin-sidebar text-admin-sidebar-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 h-screen admin-gradient flex flex-col transition-all duration-300 z-50',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-admin-sidebar-hover">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F46A1F] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h1 className="text-admin-sidebar-foreground font-bold text-sm">RASS Admin</h1>
                <p className="text-admin-sidebar-foreground/60 text-xs">Control Panel</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-[#F46A1F] rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                    isActive(item.path)
                      ? 'bg-[#F46A1F] text-white shadow-lg shadow-[#F46A1F]/20'
                      : 'text-admin-sidebar-foreground/70 hover:bg-admin-sidebar-hover hover:text-admin-sidebar-foreground'
                  )}
                >
                  <item.icon
                    size={20}
                    className={cn(
                      'flex-shrink-0',
                      isActive(item.path) ? 'text-white' : 'group-hover:text-[#F46A1F]'
                    )}
                  />
                  {!collapsed && (
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-2 border-t border-admin-sidebar-hover">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-admin-sidebar-foreground/70 hover:text-admin-sidebar-foreground hover:bg-admin-sidebar-hover"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight size={18} className="mx-auto" />
            ) : (
              <>
                <ChevronLeft size={18} className="mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-admin-sidebar-foreground/70 hover:text-admin-sidebar-foreground hover:bg-admin-sidebar-hover mt-1"
            >
              <LogOut size={18} className={cn(collapsed ? 'mx-auto' : 'mr-2')} />
              {!collapsed && <span>Exit Admin</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="md:ml-0 ml-12">
              <h2 className="text-lg font-semibold text-foreground">
                {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your website content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" target="_blank">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}