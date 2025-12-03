import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Tag,
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

interface SidebarProps {
  userRole?: 'admin' | 'cashier';
}

export function Sidebar({ userRole = 'admin' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Home className="w-5 h-5" />,
    },
    ...(userRole === 'admin'
      ? [
          {
            label: 'Products',
            href: '/products',
            icon: <Package className="w-5 h-5" />,
            adminOnly: true,
          },
          {
            label: 'Categories',
            href: '/categories',
            icon: <Tag className="w-5 h-5" />,
            adminOnly: true,
          },
          {
            label: 'Inventory',
            href: '/inventory',
            icon: <Zap className="w-5 h-5" />,
            adminOnly: true,
          },
          {
            label: 'History',
            href: '/inventory-history',
            icon: <Clock className="w-5 h-5" />,
            adminOnly: true,
          },
        ]
      : []),
    {
      label: 'POS',
      href: '/pos',
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      label: 'Sales',
      href: '/sales',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Returns',
      href: '/returns',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: <FileText className="w-5 h-5" />,
    },
    ...(userRole === 'admin'
      ? [
          {
            label: 'Settings',
            href: '/settings',
            icon: <Settings className="w-5 h-5" />,
            adminOnly: true,
          },
        ]
      : []),
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-40 hidden md:flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">Shop</h1>
              <p className="text-xs text-slate-500">Manager</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                active
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <div className={`text-xs text-slate-500 text-center ${isCollapsed ? 'hidden' : 'block'}`}>
          <p className="font-semibold text-slate-600 dark:text-slate-300 capitalize">
            {userRole}
          </p>
          <p className="mt-1">v1.0.0</p>
        </div>
        {isCollapsed && (
          <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto"></div>
        )}
      </div>
    </div>
  );
}
