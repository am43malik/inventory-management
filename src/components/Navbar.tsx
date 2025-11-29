'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Package, ShoppingCart, FileText, LogOut, Menu, X, Home, Zap, Settings, Tag, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-foreground shadow-sm sticky top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
              Shop Manager
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1 items-center">
          <NavLink href="/dashboard" label="Dashboard" icon={<Home className="w-4 h-4" />} />
          {user.role === 'admin' && (
            <>
              <NavLink href="/products" label="Products" icon={<Package className="w-4 h-4" />} />
              <NavLink href="/categories" label="Categories" icon={<Tag className="w-4 h-4" />} />
              <NavLink href="/inventory" label="Inventory" icon={<Zap className="w-4 h-4" />} />
              <NavLink href="/inventory-history" label="History" icon={<Clock className="w-4 h-4" />} />
            </>
          )}
          <NavLink href="/pos" label="POS" icon={<ShoppingCart className="w-4 h-4" />} />
          <NavLink href="/sales" label="Sales" icon={<FileText className="w-4 h-4" />} />
          <NavLink href="/reports" label="Reports" icon={<FileText className="w-4 h-4" />} />
          {user.role === 'admin' && (
            <NavLink href="/settings" label="Settings" icon={<Settings className="w-4 h-4" />} />
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
            </div>
            <ThemeToggle />
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 gap-1"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Toggle menu"
          >
            {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-4 space-y-2">
          <div className="pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
          </div>
          
          <MobileNavLink href="/dashboard" label="Dashboard" icon={<Home className="w-4 h-4" />} />
          {user.role === 'admin' && (
            <>
              <MobileNavLink href="/products" label="Products" icon={<Package className="w-4 h-4" />} />
              <MobileNavLink href="/categories" label="Categories" icon={<Tag className="w-4 h-4" />} />
              <MobileNavLink href="/inventory" label="Inventory" icon={<Zap className="w-4 h-4" />} />
              <MobileNavLink href="/inventory-history" label="History" icon={<Clock className="w-4 h-4" />} />
            </>
          )}
          <MobileNavLink href="/pos" label="POS" icon={<ShoppingCart className="w-4 h-4" />} />
          <MobileNavLink href="/sales" label="Sales" icon={<FileText className="w-4 h-4" />} />
          <MobileNavLink href="/reports" label="Reports" icon={<FileText className="w-4 h-4" />} />
          {user.role === 'admin' && (
            <MobileNavLink href="/settings" label="Settings" icon={<Settings className="w-4 h-4" />} />
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 gap-2">
            <ThemeToggle />
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="flex-1 gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2"
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}

function MobileNavLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
